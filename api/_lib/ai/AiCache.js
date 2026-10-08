/**
 * AiCache.js — Deterministik SHA-256 Tabanlı AI Önbellek Sistemi
 *
 * Sorumluluklar:
 *   - Aynı makale, aynı içerik hash'i, aynı görev tipi ve aynı prompt sürümü
 *     için mükerrer AI çağrısı yapılmasını %100 engeller.
 *   - Makale değişmediği sürece (content_hash aynı kaldıkça) tekrar analiz yapmaz.
 *   - Supabase `ai_cache` tablosunu kullanır; veritabanı erişilemezse yerel bellek
 *     önbelleğine düşer.
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

class AiCache {
  /**
   * @param {import('@supabase/supabase-js').SupabaseClient} [supabaseClient]
   */
  constructor(supabaseClient = null) {
    this.supabase = supabaseClient;
    this.memoryCache = new Map(); // In-memory fallback
  }

  /**
   * Bir makalenin içerik SHA-256 hash'ini hesaplar.
   * Makalenin başlığı, meta açıklaması veya gövdesi değişirse hash değişir.
   *
   * @param {Object} article
   * @returns {string} SHA-256 hex string
   */
  static computeContentHash(article = {}) {
    const title = article.title_tr || article.title || "";
    const desc = article.seo_description_tr || article.summary_tr || "";
    const body = article.content_tr || article.content || "";
    const slug = article.slug || "";

    const raw = `${slug}:::${title}:::${desc}:::${body}`;
    return crypto.createHash("sha256").update(raw, "utf8").digest("hex");
  }

  /**
   * Deterministik Cache Anahtarı Üretir
   * sha256(task_type:article_id:content_hash:prompt_version)
   *
   * @param {Object} params
   * @param {string} params.taskType
   * @param {string} [params.articleId]
   * @param {string} params.contentHash
   * @param {string} [params.promptVersion='v1']
   * @returns {string} SHA-256 hex string
   */
  static generateCacheKey({ taskType, articleId = "global", contentHash, promptVersion = "v1" }) {
    const raw = `${taskType}:${articleId}:${contentHash}:${promptVersion}`;
    return crypto.createHash("sha256").update(raw, "utf8").digest("hex");
  }

  /**
   * Önbellekten sonucu sorgula
   *
   * @param {string} cacheKey
   * @returns {Promise<Object|null>}
   */
  async get(cacheKey) {
    if (!cacheKey) return null;

    // 1. Önce memory cache kontrol et
    const memoryHit = this.memoryCache.get(cacheKey);
    if (memoryHit) {
      if (memoryHit.expiresAt && memoryHit.expiresAt < Date.now()) {
        this.memoryCache.delete(cacheKey);
      } else {
        return memoryHit.data;
      }
    }

    // 2. Supabase'den sorgula
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from("ai_cache")
          .select("result_json, expires_at")
          .eq("cache_key", cacheKey)
          .maybeSingle();

        if (!error && data && data.result_json) {
          const isExpired = data.expires_at && new Date(data.expires_at).getTime() < Date.now();
          if (!isExpired) {
            // Memory cache'e de kaydet
            this.memoryCache.set(cacheKey, {
              data: data.result_json,
              expiresAt: data.expires_at ? new Date(data.expires_at).getTime() : null,
            });
            return data.result_json;
          }
        }
      } catch (err) {
        // Sessizce devam et
      }
    }

    return null;
  }

  /**
   * Sonucu önbelleğe yaz
   *
   * @param {Object} params
   * @param {string} params.cacheKey
   * @param {string} params.taskType
   * @param {string} [params.articleId]
   * @param {string} params.contentHash
   * @param {string} [params.promptVersion='v1']
   * @param {Object} params.resultJson
   * @param {number} [params.ttlDays=30]
   */
  async set({
    cacheKey,
    taskType,
    articleId = null,
    contentHash,
    promptVersion = "v1",
    resultJson,
    ttlDays = 30,
  }) {
    if (!cacheKey || !resultJson) return;

    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString();

    // 1. Memory cache'e yaz
    this.memoryCache.set(cacheKey, {
      data: resultJson,
      expiresAt: Date.now() + ttlDays * 24 * 60 * 60 * 1000,
    });

    // 2. Supabase'e yaz
    if (this.supabase) {
      try {
        await this.supabase.from("ai_cache").upsert(
          {
            cache_key: cacheKey,
            task_type: taskType,
            article_id: articleId,
            content_hash: contentHash,
            prompt_version: promptVersion,
            result_json: resultJson,
            expires_at: expiresAt,
          },
          { onConflict: "cache_key" }
        );
      } catch (err) {
        // Tablo henüz migrate edilmediyse sessizce geç
      }
    }
  }
}

module.exports = AiCache;
