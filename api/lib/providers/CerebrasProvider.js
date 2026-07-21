const OpenAICompatibleProvider = require("../OpenAICompatibleProvider");

/**
 * Cerebras Provider — Öncelik 1
 *
 * Cerebras, OpenAI uyumlu endpoint sunar.
 * Base URL: https://api.cerebras.ai/v1
 * Desteklenen modeller: llama-3.3-70b, llama3.1-8b, qwen-3-32b
 *
 * Env: CEREBRAS_API_KEY
 */
function createCerebrasProvider(apiKey) {
  return new OpenAICompatibleProvider({
    name: "Cerebras (llama-3.3-70b)",
    baseUrl: "https://api.cerebras.ai/v1",
    apiKey,
    model: "llama-3.3-70b",
    supportsJsonMode: true,
    timeout: 20000,
  });
}

module.exports = createCerebrasProvider;
