const OpenAICompatibleProvider = require("../OpenAICompatibleProvider");

/**
 * Cerebras Provider — Öncelik 1
 *
 * Cerebras API'sinde aktif onaylanmış modeller:
 * gemma-4-31b, zai-glm-4.7, gpt-oss-120b
 *
 * Env: CEREBRAS_API_KEY
 */
const CEREBRAS_MODELS = [
  "gemma-4-31b",
  "zai-glm-4.7",
  "gpt-oss-120b",
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
