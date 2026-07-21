/**
 * AIProviderManager — Merkezi AI sağlayıcı yöneticisi
 *
 * Sorumluluklar:
 *   - Sırayla sağlayıcıları dener (Cerebras → Groq → HF → ...)
 *   - Başarılı yanıt gelince durur ve döndürür
 *   - Her denemede ayrıntılı log yazar
 *   - Hiçbir başarıyı cache'lemez (her istek en baştan başlar)
 *   - generateJSON() ile JSON çıktısını otomatik parse eder ve onarır
 *
 * Yeni sağlayıcı eklemek için yalnızca createProviderManager.js'i düzenlemeniz yeterlidir.
 */
class AIProviderManager {
  /**
   * @param {import('./BaseProvider')[]} providers — Öncelik sırasına göre sağlayıcı listesi
   */
  constructor(providers) {
    this.providers = providers;
  }

  /**
   * Ham metin yanıtı için provider zinciri.
   * Başarılı ilk yanıtı döndürür, başarısız olanlarda sıradakine geçer.
   *
   * @param {Array<{role: string, content: string}>} messages
   * @param {Object} [options]
   * @param {number} [options.maxTokens=2500]
   * @param {boolean} [options.jsonMode=true]
   * @returns {Promise<string>}
   */
  async chat(messages, options = {}) {
    if (this.providers.length === 0) {
      throw new Error("[AIProviderManager] Hiçbir sağlayıcı yapılandırılmamış.");
    }

    let lastError;

    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      const isLast = i === this.providers.length - 1;

      try {
        console.log(`[AIProviderManager] Trying ${provider.name}...`);
        const content = await provider.chat(messages, options);
        console.log(`[AIProviderManager] ✓ Success: ${provider.name}`);
        return content;
      } catch (err) {
        const msg = err.message || "Bilinmeyen hata";
        const causeMsg = err.cause ? ` (Cause: ${err.cause.message || err.cause.code || err.cause})` : "";

        // Hata tipini belirle (log okunabilirliği için)
        let label = (msg + causeMsg).slice(0, 150);
        if (msg.includes("429") || /rate.?limit/i.test(msg)) label = "429 Rate Limit";
        else if (/quota/i.test(msg)) label = "Quota Exceeded";
        else if (/timeout|aborted/i.test(msg)) label = "Timeout";
        else if (/5\d\d/.test(msg)) label = `Server Error (${msg.match(/5\d\d/)?.[0]})`;
        else if (/401|auth/i.test(msg)) label = "Authentication Error";

        console.warn(`[AIProviderManager] ✗ ${provider.name}: ${label}`);

        if (!isLast) {
          console.log(`[AIProviderManager] Switching to ${this.providers[i + 1].name}...`);
        }

        lastError = err;
      }
    }

    throw new Error(
      `[AIProviderManager] No AI provider available. All ${this.providers.length} provider(s) failed. Last error: ${lastError?.message}`
    );
  }

  /**
   * JSON üretimi için provider zinciri.
   * chat()'ı çağırır, sonucu JSON olarak parse eder ve onarır.
   * Parse başarısız olursa sıradaki sağlayıcıya geçer.
   *
   * @param {string} userPrompt
   * @param {string} [systemPrompt]
   * @returns {Promise<Object>} — Parse edilmiş JSON nesnesi
   */
  async generateJSON(
    userPrompt,
    systemPrompt = "You are a helpful assistant. Respond ONLY with valid JSON. Never truncate your response."
  ) {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    if (this.providers.length === 0) {
      throw new Error("[AIProviderManager] Hiçbir sağlayıcı yapılandırılmamış.");
    }

    let lastError;

    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      const isLast = i === this.providers.length - 1;

      try {
        console.log(`[AIProviderManager] Trying ${provider.name}...`);
        const raw = await provider.chat(messages, { jsonMode: provider.supportsJsonMode !== false });
        const parsed = safeParseJSON(raw);

        if (!parsed) {
          throw new Error("JSON doğrulama başarısız (parse edilemedi)");
        }

        console.log(`[AIProviderManager] ✓ Success: ${provider.name}`);
        return parsed;
      } catch (err) {
        const msg = err.message || "Bilinmeyen hata";
        const causeMsg = err.cause ? ` [Cause: ${err.cause.message || err.cause.code || err.cause}]` : "";
        let label = (msg + causeMsg).slice(0, 150);
        if (msg.includes("429") || /rate.?limit/i.test(msg)) label = "429 Rate Limit";
        else if (/quota/i.test(msg)) label = "Quota Exceeded";
        else if (/timeout|aborted/i.test(msg)) label = "Timeout";

        console.warn(`[AIProviderManager] ✗ ${provider.name}: ${label}`);
        if (!isLast) {
          console.log(`[AIProviderManager] Switching to ${this.providers[i + 1].name}...`);
        }
        lastError = err;
      }
    }

    throw new Error(
      `[AIProviderManager] All ${this.providers.length} provider(s) failed. Last: ${lastError?.message}`
    );
  }

  /**
   * Tüm sağlayıcıların sağlık durumunu kontrol et.
   * @returns {Promise<Array<{provider: string, healthy: boolean, error?: string}>>}
   */
  async health() {
    const results = await Promise.allSettled(
      this.providers.map((p) => p.health())
    );
    return results.map((r, i) => ({
      provider: this.providers[i].name,
      ...(r.status === "fulfilled"
        ? r.value
        : { healthy: false, error: r.reason?.message }),
    }));
  }
}

// ─── JSON Onarıcı ────────────────────────────────────────────────────────────
// Markdown bloklarını temizler, eksik parantezleri kapatır.
// ─────────────────────────────────────────────────────────────────────────────

function safeParseJSON(raw) {
  if (!raw) return null;

  let cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  // Try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try extracting JSON object {...} substring if model included text before/after
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(cleaned);
      } catch {
        // Continue to auto-repair below
      }
    }

    try {
      let patched = cleaned;

      // Sondaki gereksiz virgülü kaldır
      if (patched.endsWith(",")) patched = patched.slice(0, -1);

      // Tek sayıda tırnak varsa kapat
      if ((patched.match(/"/g) || []).length % 2 !== 0) patched += '"';

      // Eksik kapanış parantezlerini ekle
      const ob = (patched.match(/\{/g) || []).length;
      const cb = (patched.match(/\}/g) || []).length;
      const oB = (patched.match(/\[/g) || []).length;
      const cB = (patched.match(/\]/g) || []).length;
      for (let i = 0; i < ob - cb; i++) patched += "}";
      for (let i = 0; i < oB - cB; i++) patched += "]";

      return JSON.parse(patched);
    } catch {
      return null;
    }
  }
}

module.exports = AIProviderManager;
