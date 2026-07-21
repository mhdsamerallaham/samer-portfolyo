const OpenAICompatibleProvider = require("../OpenAICompatibleProvider");

/**
 * Groq Provider — Öncelik 2
 *
 * Groq, OpenAI uyumlu hızlı inference sağlar.
 * Decommission edilmiş modeller (mixtral-8x7b-32768) kaldırıldı, aktif güncel modeller eklendi.
 *
 * Env: GROQ_API_KEY
 */
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "deepseek-r1-distill-llama-70b",
  "qwen-2.5-coder-32b",
  "gemma2-9b-it",
  "llama-3.1-8b-instant",
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
