const OpenAICompatibleProvider = require("../OpenAICompatibleProvider");

/**
 * Groq Provider — Yüksek hız LPU inference
 *
 * Groq API'sinde doğrulanmış aktif modeller (Temmuz 2026).
 * Kaynak: https://console.groq.com/docs/models
 *
 * Env: GROQ_API_KEY
 */
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",    // Meta Llama 3.3 70B — güçlü, çok yönlü
  "llama-3.1-8b-instant",       // Meta Llama 3.1 8B — hızlı, hafif
  "qwen-qwq-32b",               // Qwen QWQ 32B — reasoning destekli
  "openai/gpt-oss-120b",        // OpenAI OSS 120B — flagship açık model
  "openai/gpt-oss-20b",         // OpenAI OSS 20B — hafif açık model
];

/**
 * @param {string} apiKey
 * @returns {OpenAICompatibleProvider[]}
 */
function createGroqProviders(apiKey) {
  return GROQ_MODELS.map(
    (model) =>
      new OpenAICompatibleProvider({
        name: `Groq (${model})`,
        baseUrl: "https://api.groq.com/openai/v1",
        apiKey,
        model,
        supportsJsonMode: true,
        timeout: 20000,
      })
  );
}

module.exports = createGroqProviders;
