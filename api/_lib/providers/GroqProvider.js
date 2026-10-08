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
  "openai/gpt-oss-120b",        // OpenAI OSS 120B — doğrulanmış aktif model
  "openai/gpt-oss-20b",         // OpenAI OSS 20B — hızlı doğrulanmış aktif model
  "qwen/qwen3.8-27b",           // Qwen 3.8 27B — doğrulanmış aktif model
  "llama-3.3-70b-versatile",    // Fallback
  "llama-3.1-8b-instant",       // Fallback
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
