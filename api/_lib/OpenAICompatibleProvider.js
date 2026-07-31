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
   * OpenAI chat/completions formatında istek at.
   * @param {Array<{role: string, content: string}>} messages
   * @param {Object} [options]
   * @param {number} [options.maxTokens=2500]
   * @param {boolean} [options.jsonMode=true]
   * @returns {Promise<string>} — choices[0].message.content
   */
  async chat(messages, options = {}) {
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

    // JSON mode yalnızca destekleyen sağlayıcılara gönderilir
    if (jsonMode && this.supportsJsonMode) {
      body.response_format = { type: "json_object" };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${errText.slice(0, 200)}`);
      }

      const json = await res.json();
      const content = json.choices?.[0]?.message?.content;
      if (!content) throw new Error("Boş yanıt (choices içinde content yok)");

      return content;
    } finally {
      clearTimeout(timer);
    }
  }
}

module.exports = OpenAICompatibleProvider;
