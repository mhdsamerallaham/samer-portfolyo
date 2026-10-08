/**
 * AiTaskQueue.js — P0-P3 Öncelikli AI Görev Kuyruğu ve Erteleme Sistemi
 *
 * Sorumluluklar:
 *   - AI görevlerini doğrudan API'ye göndermez, kuyruğa alır.
 *   - Öncelik Sıralaması: P0 (Kritik GSC) > P1 (CTR) > P2 (FAQ/Diff) > P3 (Semantik)
 *   - Mükerrer İstek Engelleme: Aynı makale + görev tipi + content_hash bekliyorsa tekrar eklemez.
 *   - Güvenli Kota Dolunca: Görevi silmez, `deferred` yapar (deferred_until = yarın).
 *   - Ertesi Gün: Ertelenen görevler kota sıfırlandığında otomatik olarak devam eder.
 */

const crypto = require("crypto");

const PRIORITY_WEIGHTS = {
  P0: 4,
  P1: 3,
  P2: 2,
  P3: 1,
};

class AiTaskQueue {
  /**
   * @param {import('@supabase/supabase-js').SupabaseClient} [supabaseClient]
   */
  constructor(supabaseClient = null) {
    this.supabase = supabaseClient;
    this.memoryQueue = []; // In-memory fallback kuyruğu
  }

  /**
   * Yeni bir AI görevini kuyruğa ekle
   *
   * @param {Object} params
   * @param {string} params.taskType
   * @param {'P0'|'P1'|'P2'|'P3'} [params.priority='P2']
   * @param {string} [params.articleId]
   * @param {string} [params.opportunityId]
   * @param {string} [params.contentHash]
   * @param {string} [params.promptVersion='v1']
   * @param {Object} params.payload
   * @param {number} [params.estimatedTokens=1500]
   * @returns {Promise<Object>} Oluşturulan görev nesnesi
   */
  async enqueue({
    taskType,
    priority = "P2",
    articleId = null,
    opportunityId = null,
    contentHash = null,
    promptVersion = "v1",
    payload = {},
    estimatedTokens = 1500,
  }) {
    // 1. Mükerrer kontrolü (Duplicate check)
    const existing = await this.findPendingDuplicate({ taskType, articleId, contentHash });
    if (existing) {
      console.log(`[AiTaskQueue] Mükerrer görev engellendi (ID: ${existing.id})`);
      return existing;
    }

    const task = {
      id: crypto.randomUUID(),
      task_type: taskType,
      priority,
      status: "pending",
      article_id: articleId,
      opportunity_id: opportunityId,
      content_hash: contentHash,
      prompt_version: promptVersion,
      payload,
      estimated_tokens: estimatedTokens,
      actual_tokens: 0,
      retry_count: 0,
      max_retries: 3,
      error: null,
      deferred_until: null,
      created_at: new Date().toISOString(),
      started_at: null,
      completed_at: null,
    };

    // 2. Supabase'e yazmayı dene
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from("seo_ai_tasks")
          .insert(task)
          .select()
          .maybeSingle();

        if (!error && data) return data;
      } catch (err) {
        // Fallback'e devam
      }
    }

    // 3. In-memory kuyruğa ekle
    this.memoryQueue.push(task);
    return task;
  }

  /**
   * Aynı içerik ve görev için zaten bekleyen bir iş var mı?
   */
  async findPendingDuplicate({ taskType, articleId, contentHash }) {
    if (!articleId && !contentHash) return null;

    if (this.supabase) {
      try {
        let query = this.supabase
          .from("seo_ai_tasks")
          .select("*")
          .eq("task_type", taskType)
          .in("status", ["pending", "processing"]);

        if (articleId) query = query.eq("article_id", articleId);
        if (contentHash) query = query.eq("content_hash", contentHash);

        const { data } = await query.limit(1).maybeSingle();
        if (data) return data;
      } catch (err) {
        // Fallback
      }
    }

    return (
      this.memoryQueue.find(
        (t) =>
          t.task_type === taskType &&
          (t.article_id === articleId || (contentHash && t.content_hash === contentHash)) &&
          (t.status === "pending" || t.status === "processing")
      ) || null
    );
  }

  /**
   * Ertelenen (deferred) görevleri, tarihi geldiyse tekrar "pending" durumuna al
   */
  async resumeDeferredTasks() {
    const today = new Date().toISOString().slice(0, 10);

    if (this.supabase) {
      try {
        await this.supabase
          .from("seo_ai_tasks")
          .update({ status: "pending", deferred_until: null })
          .eq("status", "deferred")
          .lte("deferred_until", today);
      } catch (err) {
        // Fallback
      }
    }

    // In-memory kuyrukta güncelle
    for (const t of this.memoryQueue) {
      if (t.status === "deferred" && t.deferred_until && t.deferred_until <= today) {
        t.status = "pending";
        t.deferred_until = null;
      }
    }
  }

  /**
   * İşlenmek üzere en yüksek öncelikli bekleyen görevi seç (P0 > P1 > P2 > P3)
   *
   * @returns {Promise<Object|null>}
   */
  async pickNextTask() {
    await this.resumeDeferredTasks();

    // 1. Supabase'den öncelik sırasına göre seç
    if (this.supabase) {
      try {
        // Supabase Postgres: Priority custom sorting
        const { data, error } = await this.supabase
          .from("seo_ai_tasks")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: true })
          .limit(20);

        if (!error && Array.isArray(data) && data.length > 0) {
          // Client-side priority sort: P0 > P1 > P2 > P3
          data.sort((a, b) => {
            const wa = PRIORITY_WEIGHTS[a.priority] || 1;
            const wb = PRIORITY_WEIGHTS[b.priority] || 1;
            return wb - wa; // En yüksek önce
          });

          const selected = data[0];
          // Durumu processing yap
          await this.supabase
            .from("seo_ai_tasks")
            .update({ status: "processing", started_at: new Date().toISOString() })
            .eq("id", selected.id);

          selected.status = "processing";
          return selected;
        }
      } catch (err) {
        // Fallback
      }
    }

    // 2. In-memory kuyruktan seç
    const pendingList = this.memoryQueue.filter((t) => t.status === "pending");
    if (pendingList.length === 0) return null;

    pendingList.sort((a, b) => {
      const wa = PRIORITY_WEIGHTS[a.priority] || 1;
      const wb = PRIORITY_WEIGHTS[b.priority] || 1;
      return wb - wa;
    });

    const chosen = pendingList[0];
    chosen.status = "processing";
    chosen.started_at = new Date().toISOString();
    return chosen;
  }

  /**
   * Görevi ertesi güne ertele (Bütçe veya Kota Dolduğunda)
   *
   * @param {string} taskId
   * @param {string} reason
   */
  async deferTask(taskId, reason = "AI Safe Budget Exceeded") {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    console.log(`[AiTaskQueue] ⏳ Görev ertelendi (ID: ${taskId}, Sebep: ${reason}, Tarih: ${tomorrow})`);

    if (this.supabase) {
      try {
        await this.supabase
          .from("seo_ai_tasks")
          .update({
            status: "deferred",
            deferred_until: tomorrow,
            error: reason,
          })
          .eq("id", taskId);
      } catch (err) {
        // Fallback
      }
    }

    const t = this.memoryQueue.find((item) => item.id === taskId);
    if (t) {
      t.status = "deferred";
      t.deferred_until = tomorrow;
      t.error = reason;
    }
  }

  /**
   * Görevi başarıyla tamamla
   */
  async completeTask(taskId, resultJson, actualTokens = 0, provider = "", model = "") {
    const now = new Date().toISOString();

    if (this.supabase) {
      try {
        await this.supabase
          .from("seo_ai_tasks")
          .update({
            status: "completed",
            result: resultJson,
            actual_tokens: actualTokens,
            provider,
            model,
            completed_at: now,
          })
          .eq("id", taskId);
      } catch (err) {
        // Fallback
      }
    }

    const t = this.memoryQueue.find((item) => item.id === taskId);
    if (t) {
      t.status = "completed";
      t.result = resultJson;
      t.actual_tokens = actualTokens;
      t.provider = provider;
      t.model = model;
      t.completed_at = now;
    }
  }

  /**
   * Görevi hata ile sonlandır veya retry yap
   */
  async failOrRetryTask(taskId, errorMessage) {
    const t = this.memoryQueue.find((item) => item.id === taskId);
    const retryCount = (t ? t.retry_count : 0) + 1;
    const maxRetries = t ? t.max_retries : 3;

    const newStatus = retryCount < maxRetries ? "pending" : "failed";

    if (this.supabase) {
      try {
        await this.supabase
          .from("seo_ai_tasks")
          .update({
            status: newStatus,
            retry_count: retryCount,
            error: errorMessage,
          })
          .eq("id", taskId);
      } catch (err) {
        // Fallback
      }
    }

    if (t) {
      t.status = newStatus;
      t.retry_count = retryCount;
      t.error = errorMessage;
    }
  }

  /**
   * Kuyruk İstatistiklerini Döndür (Dashboard için)
   */
  async getQueueStats() {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from("seo_ai_tasks")
          .select("status, priority");

        if (!error && Array.isArray(data)) {
          const stats = {
            total: data.length,
            pending: 0,
            processing: 0,
            completed: 0,
            failed: 0,
            deferred: 0,
            p0Count: 0,
            p1Count: 0,
          };
          for (const row of data) {
            stats[row.status] = (stats[row.status] || 0) + 1;
            if (row.priority === "P0") stats.p0Count++;
            if (row.priority === "P1") stats.p1Count++;
          }
          return stats;
        }
      } catch (err) {
        // Fallback
      }
    }

    return {
      total: this.memoryQueue.length,
      pending: this.memoryQueue.filter((t) => t.status === "pending").length,
      processing: this.memoryQueue.filter((t) => t.status === "processing").length,
      completed: this.memoryQueue.filter((t) => t.status === "completed").length,
      failed: this.memoryQueue.filter((t) => t.status === "failed").length,
      deferred: this.memoryQueue.filter((t) => t.status === "deferred").length,
      p0Count: this.memoryQueue.filter((t) => t.priority === "P0").length,
      p1Count: this.memoryQueue.filter((t) => t.priority === "P1").length,
    };
  }
}

module.exports = AiTaskQueue;
