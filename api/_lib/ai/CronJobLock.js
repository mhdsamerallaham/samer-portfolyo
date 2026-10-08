/**
 * CronJobLock.js — Dağıtık ve Idempotent Cron Kilit Yöneticisi
 *
 * Sorumluluklar:
 *   - Vercel Cron veya Admin tarafından aynı anda iki kez tetiklenen
 *     görevlerin çakışmasını engeller.
 *   - Lock alamazsa işlemi güvenli bir şekilde atlar.
 *   - Zaman aşımına uğramış kilitleri otomatik temizler.
 */

class CronJobLock {
  /**
   * @param {import('@supabase/supabase-js').SupabaseClient} [supabaseClient]
   */
  constructor(supabaseClient = null) {
    this.supabase = supabaseClient;
    this.memoryLocks = new Map(); // lockKey -> expiresAt
  }

  /**
   * Kilit almaya çalışır
   *
   * @param {string} lockKey
   * @param {number} [ttlSeconds=120] Kilidin geçerlilik süresi (saniye)
   * @returns {Promise<boolean>} Kilit alındıysa true, alınamadıysa false
   */
  async acquire(lockKey = "autoseo_queue_lock", ttlSeconds = 120) {
    const now = Date.now();
    const expiresAt = new Date(now + ttlSeconds * 1000).toISOString();

    // 1. Supabase ile atomik kilit
    if (this.supabase) {
      try {
        // Eski zaman aşımına uğramış kilitleri sil
        await this.supabase
          .from("ai_cron_locks")
          .delete()
          .eq("lock_key", lockKey)
          .lt("expires_at", new Date(now).toISOString());

        // Yeni kilidi eklemeyi dene
        const { error } = await this.supabase.from("ai_cron_locks").insert({
          lock_key: lockKey,
          locked_at: new Date(now).toISOString(),
          locked_by: `process_${process.pid || "node"}`,
          expires_at: expiresAt,
        });

        if (!error) {
          return true; // Kilit başarıyla alındı
        }

        // Hata varsa (primary key conflict), kilit başkasında
        return false;
      } catch (err) {
        // Fallback
      }
    }

    // 2. In-memory kilit kontrolü
    const existingExpiry = this.memoryLocks.get(lockKey);
    if (existingExpiry && existingExpiry > now) {
      return false; // Kilit meşgul
    }

    this.memoryLocks.set(lockKey, now + ttlSeconds * 1000);
    return true;
  }

  /**
   * Kilidi serbest bırak
   * @param {string} lockKey
   */
  async release(lockKey = "autoseo_queue_lock") {
    if (this.supabase) {
      try {
        await this.supabase.from("ai_cron_locks").delete().eq("lock_key", lockKey);
      } catch (err) {
        // Sessizce geç
      }
    }

    this.memoryLocks.delete(lockKey);
  }
}

module.exports = CronJobLock;
