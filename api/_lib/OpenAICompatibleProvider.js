const BaseProvider = require("./BaseProvider");

/**
 * OpenAICompatibleProvider — OpenAI uyumlu API endpoint kullanan tüm sağlayıcılar
 * için ortak implementasyon. Kod tekrarını önler.
 *
 * Kullanım:
 *   new OpenAICompatibleProvider({
 *     name: "Cerebras",
 *     baseUrl: "https://api.cerebras.ai/v1",
 *     apiKey: process.env.CEREBRAS_API_KEY,
 *     model: "llama-3.3-70b",
 *   })
 */
class OpenAICompatibleProvider extends BaseProvider {
  /**
   * @param {Object} config
   * @param {string} config.name            — Sağlayıcı adı (log'da görünür)
   * @param {string} config.baseUrl         — API kök URL (örn. "https://api.groq.com/openai/v1")
   * @param {string|null} config.apiKey     — Bearer token, null ise header eklenmez
   * @param {string} config.model           — Model adı
   * @param {Object} [config.extraHeaders]  — Ek HTTP başlıkları (örn. Referer)
   * @param {boolean} [config.supportsJsonMode=true] — JSON mode response_format desteği
   * @param {number} [config.timeout=22000] — İstek zaman aşımı (ms)
   */
  constructor({
    name,
    baseUrl,
    apiKey,
    model,
    extraHeaders = {},
    supportsJsonMode = true,
    timeout = 22000,
  }) {
    super(name);
    this.baseUrl = baseUrl.replace(/\/$/, ""); // trailing slash kaldır
    this.apiKey = apiKey;
    this.model = model;
    this.extraHeaders = extraHeaders;
    this.supportsJsonMode = supportsJsonMode;
    this.timeout = timeout;
  }

  /**
   * OpenAI chat/completions formatında istek at ve zengin meta verilerle döndür.
   * Rate limit başlıklarını, token kullanımını ve zamanlamayı yakalar.
   *
   * @param {Array<{role: string, content: string}>} messages
   * @param {Object} [options]
   * @returns {Promise<{ content: string, usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number }, headers: Object, model: string, provider: string, durationMs: number }>}
   */
  async chatWithMeta(messages, options = {}) {
    const { maxTokens = 2500, jsonMode = true } = options;

    const headers = {
      "Content-Type": "application/json",
      ...this.extraHeaders,
    };
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    const body = {
      model: this.model,
      max_tokens: maxTokens,
      messages,
    };

    if (jsonMode && this.supportsJsonMode) {
      body.response_format = { type: "json_object" };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    const startTime = Date.now();

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const durationMs = Date.now() - startTime;

      // Rate limit & kota başlıklarını topla
      const rateLimitHeaders = {};
      for (const [k, v] of res.headers.entries()) {
        const lower = k.toLowerCase();
        if (
          lower.includes("rate") ||
          lower.includes("limit") ||
          lower.includes("retry") ||
          lower.includes("quota")
        ) {
          rateLimitHeaders[lower] = v;
        }
      }

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        const err = new Error(`HTTP ${res.status}: ${errText.slice(0, 250)}`);
        err.statusCode = res.status;
        err.providerName = this.name;
        err.headers = rateLimitHeaders;

        // Retry-After varsa saniye olarak parse et
        const retryAfterHeader =
          rateLimitHeaders["retry-after"] ||
          rateLimitHeaders["x-ratelimit-reset-requests"];
        if (retryAfterHeader) {
          const parsedSeconds = parseInt(retryAfterHeader, 10);
          err.retryAfterSeconds = !isNaN(parsedSeconds) ? parsedSeconds : 60;
        }
        throw err;
      }

      const json = await res.json();
      const content = json.choices?.[0]?.message?.content;
      if (!content) throw new Error("Boş yanıt (choices içinde content yok)");

      const usage = {
        prompt_tokens: json.usage?.prompt_tokens || 0,
        completion_tokens: json.usage?.completion_tokens || 0,
        total_tokens: json.usage?.total_tokens || 0,
      };

      return {
        content,
        usage,
        headers: rateLimitHeaders,
        model: this.model,
        provider: this.name,
        durationMs,
      };
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * OpenAI chat/completions formatında istek at.
   * Geriye dönük uyumluluk için yalnızca string content döndürür.
   * @param {Array<{role: string, content: string}>} messages
   * @param {Object} [options]
   * @returns {Promise<string>} — choices[0].message.content
   */
  async chat(messages, options = {}) {
    const meta = await this.chatWithMeta(messages, options);
    return meta.content;
  }
}

module.exports = OpenAICompatibleProvider;
