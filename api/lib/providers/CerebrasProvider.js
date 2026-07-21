const OpenAICompatibleProvider = require("../OpenAICompatibleProvider");

/**
 * Cerebras Provider — Öncelik 1
 *
 * Cerebras, ultra hızlı OpenAI uyumlu endpoint sunar.
 * Base URL: https://api.cerebras.ai/v1
 * Model isimleri: llama3.3-70b, llama3.1-8b, qwen-2.5-72b
 *
 * Env: CEREBRAS_API_KEY
 */
const CEREBRAS_MODELS = [
  "llama3.3-70b",
  "llama3.1-8b",
];

/**
 * @param {string} apiKey
 * @returns {OpenAICompatibleProvider[]}
 */
function createCerebrasProvider(apiKey) {
  return CEREBRAS_MODELS.map(
    (model) =>
      new OpenAICompatibleProvider({
        name: `Cerebras (${model})`,
        baseUrl: "https://api.cerebras.ai/v1",
        apiKey,
        model,
        supportsJsonMode: true,
        timeout: 20000,
      })
  );
}

module.exports = createCerebrasProvider;
