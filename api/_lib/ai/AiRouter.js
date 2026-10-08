/**
 * AiRouter.js — Akıllı, Kota Duyarlı ve Dinamik AI Yönlendiricisi
 *
 * Sorumluluklar:
 *   - SABİT BİR ZİNCİR KULLANMAZ (Groq -> Mistral -> OpenRouter sabit değildir).
 *   - Her görev çalışmadan önce tüm sağlayıcıların kalan güvenli kapasitesini,
 *     sağlık durumunu, cooldown'unu ve tahmin edilen token miktarını değerlendirir.
 *   - En uygun sağlayıcıyı dinamik olarak seçer.
 *   - Sağlayıcının güvenli token kapasitesi yetersizse kesinlikle o sağlayıcıya göndermez.
 *   - Hiçbir sağlayıcı güvenli değilse GÖREVİ ERTELER (DEFERRED), asla zorla request atmaz.
 *   - Başarılı sonuçları SHA-256 önbelleğe kaydeder, mükerrer analizleri sıfırlar.
 */

const TokenEstimator = require("./TokenEstimator");
const OpenAICompatibleProvider = require("../OpenAICompatibleProvider");

class AiRouter {
  /**
   * @param {Object} deps
   * @param {import('./AiBudgetManager')} deps.budgetManager
   * @param {import('./AiTaskQueue')} deps.taskQueue
   * @param {import('./AiCache')} deps.aiCache
   * @param {Object} [deps.providerInstances] — Hazır provider nesneleri
   */
  constructor({ budgetManager, taskQueue, aiCache, providerInstances = {} }) {
    this.budgetManager = budgetManager;
    this.taskQueue = taskQueue;
    this.aiCache = aiCache;
    this.providerInstances = providerInstances;
  }

  /**
   * Sağlayıcı anahtarına göre çalışan provider instance'ını döndürür
   */
  getProviderInstance(providerKey) {
    if (this.providerInstances[providerKey]) {
      return this.providerInstances[providerKey];
    }

    switch (providerKey) {
      case "groq":
        if (!process.env.GROQ_API_KEY) return null;
        return new OpenAICompatibleProvider({
          name: "Groq (openai/gpt-oss-120b)",
          baseUrl: "https://api.groq.com/openai/v1",
          apiKey: process.env.GROQ_API_KEY,
          model: "openai/gpt-oss-120b",
          supportsJsonMode: true,
          timeout: 25000,
        });

      case "mistral":
        if (!process.env.MISTRAL_API_KEY) return null;
        return new OpenAICompatibleProvider({
          name: "Mistral (ministral-8b-latest)",
          baseUrl: "https://api.mistral.ai/v1",
          apiKey: process.env.MISTRAL_API_KEY,
          model: "ministral-8b-latest",
          supportsJsonMode: true,
          timeout: 25000,
        });

      case "openrouter":
        if (!process.env.OPENROUTER_API_KEY) return null;
        return new OpenAICompatibleProvider({
          name: "OpenRouter (openrouter/free)",
          baseUrl: "https://openrouter.ai/api/v1",
          apiKey: process.env.OPENROUTER_API_KEY,
          model: "openrouter/free",
          extraHeaders: {
            "HTTP-Referer": "https://samer.life",
            "X-Title": "Samer Life AutoSEO",
          },
          supportsJsonMode: false,
          timeout: 30000,
        });

      case "gemini":
        if (!process.env.GEMINI_API_KEY) return null;
        return new OpenAICompatibleProvider({
          name: "Gemini (gemini-3.8-flash)",
          baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
          apiKey: process.env.GEMINI_API_KEY,
          model: "gemini-3.8-flash",
          supportsJsonMode: true,
          timeout: 25000,
        });

      case "cerebras":
        if (!process.env.CEREBRAS_API_KEY) return null;
        return new OpenAICompatibleProvider({
          name: "Cerebras (gpt-oss-120b)",
          baseUrl: "https://api.cerebras.ai/v1",
          apiKey: process.env.CEREBRAS_API_KEY,
          model: "gpt-oss-120b",
          supportsJsonMode: true,
          timeout: 20000,
        });

      case "huggingface":
        if (!process.env.HF_TOKEN) return null;
        return new OpenAICompatibleProvider({
          name: "Hugging Face Router",
          baseUrl: "https://router.huggingface.co/v1",
          apiKey: process.env.HF_TOKEN,
          model: "meta-llama/Llama-3.3-70B-Instruct:groq",
          supportsJsonMode: false,
          timeout: 25000,
        });

      default:
        return null;
    }
  }

  /**
   * Dinamik Sağlayıcı Seçim Algoritması
   * Tüm sağlayıcıları değerlendirir ve en yüksek güvenli kapasiteye sahip olanı seçer.
   *
   * @param {number} estimatedTokens Görevin tahmini token ihtiyacı
   * @param {Array<string>} [excludeProviders=[]] Hata alan ve bu denemede elenenler
   * @returns {Promise<{ selectedProvider: string, providerInstance: Object, evaluation: Object }|null>}
   */
  async selectBestProvider(estimatedTokens, excludeProviders = []) {
    const candidateKeys = ["groq", "mistral", "openrouter", "gemini", "cerebras", "huggingface"];
    const evaluations = [];

    // Global daily budget kontrolü (Ek güvenlik katmanı)
    const globalUsage = await this.budgetManager.getGlobalDailyUsage();
    const globalTokensRemaining = Math.max(0, this.budgetManager.settings.maxTokensPerDay - globalUsage.tokens);
    const globalTasksRemaining = Math.max(0, this.budgetManager.settings.maxTasksPerDay - globalUsage.requests);

    if (globalTokensRemaining < estimatedTokens || globalTasksRemaining <= 0) {
      console.warn("[AiRouter] 🛑 Global günlük AI bütçe tavanına ulaşıldı! Görev ertelenmeli.");
      return null;
    }

    for (const key of candidateKeys) {
      if (excludeProviders.includes(key)) continue;

      try {
        const capacity = await this.budgetManager.evaluateProviderCapacity(key);

        // Kural 1: Sağlayıcı PAUSED veya Kredi Yetersiz ise atla
        if (capacity.health === "INSUFFICIENT_CREDITS" || capacity.health === "PAUSED") {
          continue;
        }

        // Kural 2: Cooldown aktif ise atla
        if (capacity.inCooldown) {
          continue;
        }

        // Kural 3: Kalan güvenli RPM veya RPD sıfırsa atla
        if (capacity.safeRpmCapacity <= 0 || capacity.safeRpdCapacity <= 0) {
          continue;
        }

        // Kural 4: Kalan güvenli TPM veya TPD tahmini token'dan küçükse atla!
        if (capacity.safeTpmCapacity < estimatedTokens || capacity.safeTpdCapacity < estimatedTokens) {
          continue;
        }

        // Kural 5: Global budget ek güvenlik katmanıdır, asla provider limitini genişletemez!
        const effectiveSafeTpd = Math.min(capacity.safeTpdCapacity, globalTokensRemaining);
        if (effectiveSafeTpd < estimatedTokens) {
          continue;
        }

        // Kural 6: Dinamik Skor Hesaplama (Başarı ihtimali ve oda payı en yüksek sağlayıcı kazanır)
        const rpmHeadroom = capacity.safeRpmCapacity / (capacity.rpmLimit || 1);
        const tpmHeadroom = capacity.safeTpmCapacity / (capacity.tpmLimit || 1);
        const rpdHeadroom = capacity.safeRpdCapacity / (capacity.rpdLimit || 1);
        const tokenFitRatio = Math.min(10, capacity.safeTpmCapacity / (estimatedTokens || 1));
        const healthFactor = capacity.health === "HEALTHY" ? 1.0 : 0.6;

        // Dinamik Çok Kriterli Skor
        const score = (rpmHeadroom * 25 + tpmHeadroom * 35 + rpdHeadroom * 20 + tokenFitRatio * 20) * healthFactor;

        evaluations.push({ providerKey: key, capacity, score, effectiveSafeTpd });
      } catch (err) {
        // Hata durumunda devam et
      }
    }

    if (evaluations.length === 0) {
      return null; // Hiçbir sağlayıcı güvenli değil!
    }

    // Skoruna göre sırala (En yüksek skora sahip olan ilk sırada)
    evaluations.sort((a, b) => b.score - a.score);

    const winner = evaluations[0];
    const instance = this.getProviderInstance(winner.providerKey);

    if (!instance) {
      return null;
    }

    return {
      selectedProvider: winner.providerKey,
      providerInstance: instance,
      evaluation: winner.capacity,
    };
  }

  /**
   * Bir AI Görevini Uçtan Uca Kota Güvenliğiyle Çalıştırır
   *
   * @param {Object} task seo_ai_tasks tablosundan gelen görev nesnesi
   * @returns {Promise<{ success: boolean, result?: Object, cached?: boolean, deferred?: boolean, error?: string }>}
   */
  async executeTask(task) {
    const { id, task_type, payload, content_hash, prompt_version = "v1", article_id } = task;

    // 1. ÖNBELLEK KONTROLÜ (Cache Check)
    const cacheKey = this.aiCache.constructor.generateCacheKey({
      taskType: task_type,
      articleId: article_id,
      contentHash: content_hash || "no-hash",
      promptVersion: prompt_version,
    });

    const cachedResult = await this.aiCache.get(cacheKey);
    if (cachedResult) {
      console.log(`[AiRouter] ⚡ CACHE HIT! Görev sıfır token ile önbellekten çözüldü (ID: ${id})`);
      await this.taskQueue.completeTask(id, cachedResult, 0, "cache", "cache");
      return { success: true, result: cachedResult, cached: true };
    }

    // 2. TOKEN TAHMİNİ (Token Estimation)
    const userPrompt = payload.prompt || payload.userPrompt || "";
    const systemPrompt = payload.systemPrompt || "You are an SEO assistant. Respond ONLY with valid JSON.";
    const estimated = TokenEstimator.estimateTotalTokens({
      taskType: task_type,
      prompt: `${systemPrompt}\n${userPrompt}`,
    });

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    // 3. DİNAMİK SAĞLAYICI SEÇİMİ VE YÜRÜTME (Retry & Fallback Loop)
    const excluded = [];
    let lastError = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      const selection = await this.selectBestProvider(estimated.totalTokens, excluded);

      if (!selection) {
        // Hiçbir sağlayıcının güvenli bütçesi yetmiyor -> KESİNLİKLE ZORLA GÖNDERME!
        console.warn(`[AiRouter] 🛑 Tüm sağlayıcıların güvenli kotası yetersiz veya tükendi! Görev erteleniyor.`);
        await this.taskQueue.deferTask(id, "All AI providers safe capacity exhausted");
        return { success: false, deferred: true, reason: "safe_capacity_exhausted" };
      }

      const { selectedProvider, providerInstance, evaluation } = selection;
      console.log(
        `[AiRouter] 🎯 Görev ${id} (${task_type}, ~${estimated.totalTokens} token) için dinamik seçilen: ` +
          `${selectedProvider} (Kalan Güvenli TPM: ${evaluation.safeTpmCapacity}, RPD: ${evaluation.safeRpdCapacity})`
      );

      try {
        const metaResult = await providerInstance.chatWithMeta(messages, {
          jsonMode: true,
          maxTokens: estimated.outputTokens,
        });

        // JSON Doğrulaması
        let parsedResult = null;
        try {
          parsedResult = JSON.parse(metaResult.content.trim().replace(/^```json/i, "").replace(/```$/i, ""));
        } catch {
          // Ham metin olarak paketle
          parsedResult = { text: metaResult.content };
        }

        // Kullanım defterine kaydet
        await this.budgetManager.recordSuccessfulCall({
          providerKey: selectedProvider,
          model: metaResult.model,
          usage: metaResult.usage,
          headers: metaResult.headers,
          taskId: id,
          durationMs: metaResult.durationMs,
        });

        // Önbelleğe kaydet (Mükerrer istekleri engelle)
        await this.aiCache.set({
          cacheKey,
          taskType: task_type,
          articleId: article_id,
          contentHash: content_hash || "no-hash",
          promptVersion: prompt_version,
          resultJson: parsedResult,
        });

        // Görevi tamamlandı olarak işaretle
        await this.taskQueue.completeTask(
          id,
          parsedResult,
          metaResult.usage.total_tokens,
          selectedProvider,
          metaResult.model
        );

        console.log(`[AiRouter] ✓ Görev başarıyla tamamlandı: ${selectedProvider} (${metaResult.usage.total_tokens} token)`);
        return { success: true, result: parsedResult, tokens: metaResult.usage.total_tokens };
      } catch (err) {
        lastError = err;
        console.warn(`[AiRouter] ✗ ${selectedProvider} başarısız oldu: ${err.message}`);

        // Sağlayıcıyı cooldown'a al ve bu denemeden ele
        this.budgetManager.handleProviderError(selectedProvider, err);
        excluded.push(selectedProvider);

        // Exponential backoff beklemesi
        const backoffMs = Math.min(2000 * Math.pow(2, attempt - 1), 8000);
        await new Promise((r) => setTimeout(r, backoffMs));
      }
    }

    // 3 deneme de başarısız olduysa görevi yeniden denemek üzere bırak veya fail et
    await this.taskQueue.failOrRetryTask(id, lastError?.message || "Execution failed on all attempts");
    return { success: false, error: lastError?.message };
  }
}

module.exports = AiRouter;
