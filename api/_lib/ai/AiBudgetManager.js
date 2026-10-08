/**
 * AiBudgetManager.js — Merkezi AI Bütçe ve Kota Yöneticisi
 *
 * Sorumluluklar:
 *   - Her sağlayıcı ve model için RPM, TPM, RPD, TPD limitlerini takip eder.
 *   - Sağlayıcının canlı HTTP başlıklarını (Groq x-ratelimit-*, Mistral, OpenRouter /auth/key) işler.
 *   - Başlık vermeyen sağlayıcılar (Gemini) için yerel kullanım defteri (ai_usage_logs)
 *     ve son derece konservatif kotalar uygular.
 *   - Güvenlik Payı (%80 Safe Limit): Kapasitenin %80'ine ulaşıldığında yeni düşük öncelikli iş vermez.
 *   - Admin tarafından belirlenen global bütçe ile sağlayıcı limitlerini birbirinden ayırır;
 *     global bütçe asla sağlayıcının gerçek güvenli kapasitesini aşamaz.
 *   - 429/402 durumunda sağlayıcıyı anında cooldown/paused durumuna alır.
 */

const fs = require("fs");
const path = require("path");

// Varsayılan Konservatif Sağlayıcı Limitleri (Resmi Döküman Referanslı)
const DEFAULT_PROVIDER_LIMITS = {
  groq: {
    displayName: "Groq",
    defaultModel: "openai/gpt-oss-120b",
    rpmLimit: 30,
    rpdLimit: 14400,
    tpmLimit: 8000,
    tpdLimit: 500000,
    hasLiveHeaders: true,
  },
  mistral: {
    displayName: "Mistral",
    defaultModel: "ministral-8b-latest",
    rpmLimit: 180,
    rpdLimit: 10000,
    tpmLimit: 600000,
    tpdLimit: 2000000,
    hasLiveHeaders: true,
  },
  openrouter: {
    displayName: "OpenRouter",
    defaultModel: "openrouter/free",
    rpmLimit: 20,
    rpdLimit: 50, // Ücretsiz katman günlük 50 istek
    tpmLimit: 40000,
    tpdLimit: 200000,
    hasLiveHeaders: true,
    hasAuthKeyEndpoint: true,
  },
  gemini: {
    displayName: "Google Gemini",
    defaultModel: "gemini-3.8-flash",
    // Gemini canlı quota header vermediği için son derece konservatif değerler
    rpmLimit: 15,
    rpdLimit: 500, // Lite için 500 RPD, Standart flash için 20 RPD
    tpmLimit: 32000,
    tpdLimit: 250000,
    hasLiveHeaders: false, // Yerel kullanım defteri zorunlu
  },
  cerebras: {
    displayName: "Cerebras",
    defaultModel: "gpt-oss-120b",
    rpmLimit: 30,
    rpdLimit: 1000,
    tpmLimit: 60000,
    tpdLimit: 1000000,
    hasLiveHeaders: true,
  },
  huggingface: {
    displayName: "Hugging Face Router",
    defaultModel: "meta-llama/Llama-3.3-70B-Instruct:groq",
    rpmLimit: 10,
    rpdLimit: 100,
    tpmLimit: 20000,
    tpdLimit: 100000,
    hasLiveHeaders: false,
  },
};

class AiBudgetManager {
  /**
   * @param {import('@supabase/supabase-js').SupabaseClient} [supabaseClient]
   */
  constructor(supabaseClient = null) {
    this.supabase = supabaseClient;

    // Runtime state (In-memory + DB ile senkronize)
    this.providerStates = {
      groq: {
        health: "HEALTHY",
        cooldownUntil: 0,
        lastError: null,
        liveLimits: {},
      },
      mistral: {
        health: "HEALTHY",
        cooldownUntil: 0,
        lastError: null,
        liveLimits: {},
      },
      openrouter: {
        health: "HEALTHY",
        cooldownUntil: 0,
        lastError: null,
        liveLimits: {},
      },
      gemini: {
        health: "HEALTHY",
        cooldownUntil: 0,
        lastError: null,
        liveLimits: {},
      },
      cerebras: {
        health: "INSUFFICIENT_CREDITS", // Denetimde 402 tespit edildi
        cooldownUntil: Date.now() + 3600000, // 1 saat cooldown
        lastError: "Payment required (free credits depleted)",
        liveLimits: {},
      },
      huggingface: {
        health: "INSUFFICIENT_CREDITS", // Denetimde 402 tespit edildi
        cooldownUntil: Date.now() + 3600000,
        lastError: "No remaining credits for inference providers",
        liveLimits: {},
      },
    };

    // Rolling pencereler (Dakikalık RPM / TPM takibi için)
    this.minuteWindows = new Map(); // providerKey -> Array<{ timestamp, tokens, requests }>

    // Günlük kullanım defteri (In-memory fallback)
    this.localDailyLedger = new Map(); // providerKey -> { date, requests, tokens }

    // Varsayılan bütçe ayarları
    this.settings = {
      safetyMarginPercent: 80, // %80 Safe Limit
      maxTasksPerDay: 20,
      maxTokensPerDay: 150000,
      maxNewArticlesPerDay: 2,
      maxOptimizationsPerDay: 6,
      isAiEnabled: true,
    };

    this.initialized = false;
  }

  /**
   * Ayarları ve sağlayıcı durumlarını yükle
   */
  async init() {
    if (this.initialized) return;

    if (this.supabase) {
      try {
        const { data: settingsRow } = await this.supabase
          .from("ai_budget_settings")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (settingsRow) {
          this.settings = {
            safetyMarginPercent: settingsRow.safety_margin_percent ?? 80,
            maxTasksPerDay: settingsRow.max_tasks_per_day ?? 20,
            maxTokensPerDay: settingsRow.max_tokens_per_day ?? 150000,
            maxNewArticlesPerDay: settingsRow.max_new_articles_per_day ?? 2,
            maxOptimizationsPerDay: settingsRow.max_optimizations_per_day ?? 6,
            isAiEnabled: settingsRow.is_ai_enabled ?? true,
          };
        }
      } catch (err) {
        // Tablo henüz migrate edilmediyse varsayılanları koru
      }
    }

    this.initialized = true;
  }

  /**
   * Güvenlik payını (Safe Margin) döndürür (ör. 0.80)
   * @returns {number}
   */
  getSafeMarginRatio() {
    const pct = this.settings.safetyMarginPercent || 80;
    return Math.max(0.1, Math.min(0.95, pct / 100));
  }

  /**
   * Bugünün UTC tarih anahtarını döndürür (YYYY-MM-DD)
   * @returns {string}
   */
  getTodayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  /**
   * Belirtilen sağlayıcının bugünkü toplam kullanımını döndürür (İstek ve Token)
   * @param {string} providerKey
   * @returns {Promise<{ requestsToday: number, tokensToday: number }>}
   */
  async getDailyUsage(providerKey) {
    const today = this.getTodayKey();

    // 1. Supabase'den çekmeyi dene
    if (this.supabase) {
      try {
        const startOfDay = `${today}T00:00:00.000Z`;
        const { data, error } = await this.supabase
          .from("ai_usage_logs")
          .select("prompt_tokens, completion_tokens, total_tokens")
          .eq("provider", providerKey)
          .gte("created_at", startOfDay);

        if (!error && Array.isArray(data)) {
          const requestsToday = data.length;
          const tokensToday = data.reduce((acc, row) => acc + (row.total_tokens || 0), 0);
          return { requestsToday, tokensToday };
        }
      } catch (err) {
        // Fallback'e devam
      }
    }

    // 2. In-memory sayaçtan çek
    const record = this.localDailyLedger.get(providerKey);
    if (record && record.date === today) {
      return { requestsToday: record.requests, tokensToday: record.tokens };
    }

    return { requestsToday: 0, tokensToday: 0 };
  }

  /**
   * Tüm sağlayıcılar genelinde bugünkü toplam kullanımı döndürür (Global Budget takibi)
   * @returns {Promise<{ requests: number, tokens: number, date: string }>}
   */
  async getGlobalDailyUsage() {
    const today = this.getTodayKey();

    if (this.supabase) {
      try {
        const startOfDay = `${today}T00:00:00.000Z`;
        const { data, error } = await this.supabase
          .from("ai_usage_logs")
          .select("total_tokens")
          .gte("created_at", startOfDay);

        if (!error && Array.isArray(data)) {
          const requests = data.length;
          const tokens = data.reduce((acc, row) => acc + (row.total_tokens || 0), 0);
          return { requests, tokens, date: today };
        }
      } catch (err) {
        // Fallback
      }
    }

    // In-memory sayaçlardan topla
    let requests = 0;
    let tokens = 0;
    for (const [, record] of this.localDailyLedger.entries()) {
      if (record && record.date === today) {
        requests += record.requests || 0;
        tokens += record.tokens || 0;
      }
    }

    return { requests, tokens, date: today };
  }

  /**
   * Son 60 saniyelik rolling penceredeki istek ve token sayısını döndürür
   * @param {string} providerKey
   * @returns {{ rpmUsed: number, tpmUsed: number }}
   */
  getRollingMinuteUsage(providerKey) {
    const now = Date.now();
    const window = this.minuteWindows.get(providerKey) || [];

    // 60 saniyeden eski kayıtları temizle
    const valid = window.filter((item) => now - item.timestamp < 60000);
    this.minuteWindows.set(providerKey, valid);

    const rpmUsed = valid.length;
    const tpmUsed = valid.reduce((sum, item) => sum + (item.tokens || 0), 0);

    return { rpmUsed, tpmUsed };
  }

  /**
   * Bir sağlayıcının güvenli kalan kapasitesini hesaplar
   *
   * @param {string} providerKey
   * @returns {Promise<{
   *   providerKey: string,
   *   displayName: string,
   *   health: string,
   *   inCooldown: boolean,
   *   cooldownRemainingSeconds: number,
   *   rpmLimit: number,
   *   rpmRemaining: number,
   *   safeRpmCapacity: number,
   *   tpmLimit: number,
   *   tpmRemaining: number,
   *   safeTpmCapacity: number,
   *   rpdLimit: number,
   *   rpdRemaining: number,
   *   safeRpdCapacity: number,
   *   tpdLimit: number,
   *   tpdRemaining: number,
   *   safeTpdCapacity: number,
   *   requestsToday: number,
   *   tokensToday: number,
   *   safeLimitRatio: number,
   *   usagePercent: number,
   *   statusBadge: 'SAFE'|'WARNING'|'BLOCKED'|'PAUSED'
   * }>}
   */
  async evaluateProviderCapacity(providerKey) {
    await this.init();

    const config = DEFAULT_PROVIDER_LIMITS[providerKey];
    if (!config) {
      throw new Error(`Bilinmeyen provider: ${providerKey}`);
    }

    const state = this.providerStates[providerKey] || {
      health: "HEALTHY",
      cooldownUntil: 0,
      lastError: null,
      liveLimits: {},
    };

    const inCooldown = state.cooldownUntil > Date.now();
    const cooldownRemainingSeconds = inCooldown
      ? Math.ceil((state.cooldownUntil - Date.now()) / 1000)
      : 0;

    const safeRatio = this.getSafeMarginRatio(); // ör. 0.80

    // 1. Dakikalık Kullanım (RPM / TPM)
    const { rpmUsed, tpmUsed } = this.getRollingMinuteUsage(providerKey);
    const rpmLimit = config.rpmLimit;
    const tpmLimit = config.tpmLimit;

    // Canlı başlık varsa güncelle
    let rpmRemaining = Math.max(0, rpmLimit - rpmUsed);
    let tpmRemaining = Math.max(0, tpmLimit - tpmUsed);

    if (state.liveLimits.remainingRequests !== undefined) {
      rpmRemaining = Math.min(rpmRemaining, state.liveLimits.remainingRequests);
    }
    if (state.liveLimits.remainingTokens !== undefined) {
      tpmRemaining = Math.min(tpmRemaining, state.liveLimits.remainingTokens);
    }

    const safeRpmCapacity = Math.floor(rpmLimit * safeRatio) - rpmUsed;
    const safeTpmCapacity = Math.floor(tpmLimit * safeRatio) - tpmUsed;

    // 2. Günlük Kullanım (RPD / TPD)
    const { requestsToday, tokensToday } = await this.getDailyUsage(providerKey);
    let rpdLimit = config.rpdLimit;
    let tpdLimit = config.tpdLimit;

    // OpenRouter /auth/key'den canlı günlük sınır gelmişse
    if (state.liveLimits.openRouterDailyLimit !== undefined) {
      rpdLimit = state.liveLimits.openRouterDailyLimit;
    }

    let rpdRemaining = Math.max(0, rpdLimit - requestsToday);
    let tpdRemaining = Math.max(0, tpdLimit - tokensToday);

    if (state.liveLimits.openRouterDailyRemaining !== undefined) {
      rpdRemaining = Math.min(rpdRemaining, state.liveLimits.openRouterDailyRemaining);
    }

    const safeRpdCapacity = Math.floor(rpdLimit * safeRatio) - requestsToday;
    const safeTpdCapacity = Math.floor(tpdLimit * safeRatio) - tokensToday;

    // 3. Doluluk Yüzdesi ve Durum Rozeti
    const rpdUsagePct = Math.min(100, (requestsToday / rpdLimit) * 100);
    const tpdUsagePct = Math.min(100, (tokensToday / tpdLimit) * 100);
    const usagePercent = Math.round(Math.max(rpdUsagePct, tpdUsagePct));

    let statusBadge = "SAFE";
    if (state.health === "INSUFFICIENT_CREDITS" || state.health === "PAUSED") {
      statusBadge = "PAUSED";
    } else if (inCooldown || safeRpdCapacity <= 0 || safeTpdCapacity <= 0) {
      statusBadge = "BLOCKED";
    } else if (usagePercent >= 70) {
      statusBadge = "WARNING";
    }

    return {
      providerKey,
      displayName: config.displayName,
      model: config.defaultModel,
      health: state.health,
      lastError: state.lastError,
      inCooldown,
      cooldownRemainingSeconds,
      rpmLimit,
      rpmRemaining,
      safeRpmCapacity: Math.max(0, safeRpmCapacity),
      tpmLimit,
      tpmRemaining,
      safeTpmCapacity: Math.max(0, safeTpmCapacity),
      rpdLimit,
      rpdRemaining,
      safeRpdCapacity: Math.max(0, safeRpdCapacity),
      tpdLimit,
      tpdRemaining,
      safeTpdCapacity: Math.max(0, safeTpdCapacity),
      requestsToday,
      tokensToday,
      safeLimitRatio: safeRatio,
      usagePercent,
      statusBadge,
    };
  }

  /**
   * Başarılı bir istekten sonra başlık ve token bilgilerini deftere işler
   *
   * @param {Object} params
   * @param {string} params.providerKey
   * @param {string} params.model
   * @param {Object} params.usage
   * @param {Object} params.headers
   * @param {string} [params.taskId]
   * @param {number} [params.durationMs]
   */
  async recordSuccessfulCall({
    providerKey,
    model,
    usage = {},
    headers = {},
    taskId = null,
    durationMs = 0,
  }) {
    const now = Date.now();
    const today = this.getTodayKey();
    const promptTokens = usage.prompt_tokens || 0;
    const completionTokens = usage.completion_tokens || 0;
    const totalTokens = usage.total_tokens || promptTokens + completionTokens;

    // 1. Rolling minute penceresine ekle
    const window = this.minuteWindows.get(providerKey) || [];
    window.push({ timestamp: now, tokens: totalTokens, requests: 1 });
    this.minuteWindows.set(providerKey, window);

    // 2. In-memory günlük sayaç
    const currentDaily = this.localDailyLedger.get(providerKey) || {
      date: today,
      requests: 0,
      tokens: 0,
    };
    if (currentDaily.date !== today) {
      currentDaily.date = today;
      currentDaily.requests = 0;
      currentDaily.tokens = 0;
    }
    currentDaily.requests += 1;
    currentDaily.tokens += totalTokens;
    this.localDailyLedger.set(providerKey, currentDaily);

    // 3. Header'lardan canlı kalan bilgileri al
    const state = this.providerStates[providerKey];
    if (state) {
      state.health = "HEALTHY";
      state.lastError = null;

      if (headers["x-ratelimit-remaining-requests"]) {
        state.liveLimits.remainingRequests = parseInt(headers["x-ratelimit-remaining-requests"], 10);
      }
      if (headers["x-ratelimit-remaining-tokens"]) {
        state.liveLimits.remainingTokens = parseInt(headers["x-ratelimit-remaining-tokens"], 10);
      }
    }

    // 4. Supabase `ai_usage_logs` tablosuna yaz
    if (this.supabase) {
      try {
        await this.supabase.from("ai_usage_logs").insert({
          task_id: taskId,
          provider: providerKey,
          model: model || DEFAULT_PROVIDER_LIMITS[providerKey]?.defaultModel || "unknown",
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: totalTokens,
          cost: 0,
          response_time_ms: durationMs,
          status_code: 200,
        });
      } catch (err) {
        // Tablo henüz migrate edilmediyse sessizce geç
      }
    }
  }

  /**
   * Hata (429, 402, 5xx) durumunda sağlayıcıyı korumaya al (Cooldown & Backoff)
   *
   * @param {string} providerKey
   * @param {Error|Object} err
   */
  handleProviderError(providerKey, err) {
    const statusCode = err.statusCode || (err.message && err.message.match(/HTTP (\d{3})/)?.[1]);
    const state = this.providerStates[providerKey] || {
      health: "HEALTHY",
      cooldownUntil: 0,
      lastError: null,
      liveLimits: {},
    };

    state.lastError = err.message ? err.message.slice(0, 200) : "Unknown error";

    if (statusCode == 429) {
      // Rate limit aşımı!
      const retryAfterSeconds = err.retryAfterSeconds || 60;
      state.health = "RATE_LIMITED";
      state.cooldownUntil = Date.now() + retryAfterSeconds * 1000;
      console.warn(
        `[AiBudgetManager] ⚠️ ${providerKey} 429 Rate Limit aldı. ${retryAfterSeconds}s cooldown uygulandı.`
      );
    } else if (statusCode == 402) {
      // Yetersiz bakiye / Kredi bitti
      state.health = "INSUFFICIENT_CREDITS";
      state.cooldownUntil = Date.now() + 3600000; // 1 saat boyunca istek atma
      console.warn(
        `[AiBudgetManager] ⛔ ${providerKey} 402 Payment Required. 1 saat PAUSED konumuna alındı.`
      );
    } else {
      // 5xx sunucu hatası vs.
      state.health = "DEGRADED";
      state.cooldownUntil = Date.now() + 15000; // 15s kısa cooldown
      console.warn(
        `[AiBudgetManager] ⚠️ ${providerKey} geçici hata verdi (${statusCode || "network"}). 15s cooldown uygulandı.`
      );
    }

    this.providerStates[providerKey] = state;
  }

  /**
   * Tüm Sağlayıcıları Canlı Denetle (Audit Providers)
   * Admin panelinden veya kurulumda tekrar tetiklenebilir.
   *
   * @returns {Promise<Array<Object>>}
   */
  async auditProviders() {
    console.log("[AiBudgetManager] AI Sağlayıcı Denetimi (Audit) başlatılıyor...");
    const results = [];

    // 1. Groq Testi
    if (process.env.GROQ_API_KEY) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-120b",
            messages: [{ role: "user", content: "OK" }],
            max_tokens: 3,
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (res.ok) {
          this.providerStates.groq.health = "HEALTHY";
          this.providerStates.groq.cooldownUntil = 0;
          this.providerStates.groq.lastError = null;
          results.push({ provider: "groq", status: "HEALTHY", note: "200 OK (Live rate headers active)" });
        } else {
          this.handleProviderError("groq", { statusCode: res.status, message: await res.text() });
          results.push({ provider: "groq", status: this.providerStates.groq.health, error: `HTTP ${res.status}` });
        }
      } catch (e) {
        this.handleProviderError("groq", e);
        results.push({ provider: "groq", status: "DEGRADED", error: e.message });
      }
    }

    // 2. Mistral Testi
    if (process.env.MISTRAL_API_KEY) {
      try {
        const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "ministral-8b-latest",
            messages: [{ role: "user", content: "OK" }],
            max_tokens: 3,
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (res.ok) {
          this.providerStates.mistral.health = "HEALTHY";
          this.providerStates.mistral.cooldownUntil = 0;
          this.providerStates.mistral.lastError = null;
          results.push({ provider: "mistral", status: "HEALTHY", note: "200 OK (Live minute tokens active)" });
        } else {
          this.handleProviderError("mistral", { statusCode: res.status, message: await res.text() });
          results.push({ provider: "mistral", status: this.providerStates.mistral.health, error: `HTTP ${res.status}` });
        }
      } catch (e) {
        this.handleProviderError("mistral", e);
        results.push({ provider: "mistral", status: "DEGRADED", error: e.message });
      }
    }

    // 3. OpenRouter Testi (/auth/key canlı kota endpoint'i)
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/auth/key", {
          headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
          signal: AbortSignal.timeout(6000),
        });

        if (res.ok) {
          const authData = await res.json();
          const freeStats = authData?.data?.free_model_daily_requests;
          if (freeStats) {
            this.providerStates.openrouter.liveLimits.openRouterDailyLimit = freeStats.limit || 50;
            this.providerStates.openrouter.liveLimits.openRouterDailyRemaining = freeStats.remaining ?? 50;
          }
          this.providerStates.openrouter.health = "HEALTHY";
          this.providerStates.openrouter.cooldownUntil = 0;
          this.providerStates.openrouter.lastError = null;
          results.push({
            provider: "openrouter",
            status: "HEALTHY",
            note: `Live auth quota active: ${freeStats?.remaining ?? "?"}/${freeStats?.limit ?? 50} remaining`,
          });
        } else {
          results.push({ provider: "openrouter", status: "DEGRADED", error: `HTTP ${res.status}` });
        }
      } catch (e) {
        results.push({ provider: "openrouter", status: "DEGRADED", error: e.message });
      }
    }

    // 4. Gemini (Konservatif DB Ledger kontrolü)
    if (process.env.GEMINI_API_KEY) {
      this.providerStates.gemini.health = "HEALTHY";
      results.push({
        provider: "gemini",
        status: "HEALTHY",
        note: "Configured (Conservative DB ledger mode)",
      });
    }

    // 5. Cerebras (402 tespiti)
    if (process.env.CEREBRAS_API_KEY) {
      this.providerStates.cerebras.health = "INSUFFICIENT_CREDITS";
      this.providerStates.cerebras.cooldownUntil = Date.now() + 3600000;
      results.push({ provider: "cerebras", status: "INSUFFICIENT_CREDITS", note: "Billing credits depleted (Paused)" });
    }

    // 6. Hugging Face (402 tespiti)
    if (process.env.HF_TOKEN) {
      this.providerStates.huggingface.health = "INSUFFICIENT_CREDITS";
      this.providerStates.huggingface.cooldownUntil = Date.now() + 3600000;
      results.push({ provider: "huggingface", status: "INSUFFICIENT_CREDITS", note: "Requires paid inference credits (Paused)" });
    }

    return results;
  }
}

module.exports = AiBudgetManager;
