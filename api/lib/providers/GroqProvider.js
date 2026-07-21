const OpenAICompatibleProvider = require("../OpenAICompatibleProvider");

/**
 * Groq Provider — Öncelik 2
 *
 * Groq API'sinde doğrudan doğrulanmış aktif modeller.
 *
 * Env: GROQ_API_KEY
 */
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "qwen/qwen3.6-27b",
  "openai/gpt-oss-120b",
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
