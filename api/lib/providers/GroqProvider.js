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
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
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
