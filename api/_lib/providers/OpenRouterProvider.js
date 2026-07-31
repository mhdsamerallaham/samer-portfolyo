const OpenAICompatibleProvider = require("../OpenAICompatibleProvider");

/**
 * OpenRouter Provider — Ücretsiz model havuzu
 *
 * OpenRouter, yüzlerce modele tek API ile erişim sağlar.
 * Ücretsiz modeller `:free` suffix ile işaretlenir.
 * Base URL: https://openrouter.ai/api/v1
 *
 * Env: OPENROUTER_API_KEY
 */
const OPENROUTER_MODELS = [
  {
    model: "openrouter/free",
    label: "OpenRouter (Free Auto-Router)",
  },
  {
    model: "deepseek/deepseek-chat:free",
    label: "OpenRouter (DeepSeek Chat Free)",
  },
  {
    model: "meta-llama/llama-4-maverick:free",
    label: "OpenRouter (Llama-4-Maverick Free)",
  },
  {
    model: "qwen/qwen3-coder:free",
    label: "OpenRouter (Qwen3-Coder Free)",
  },
];

/**
 * @param {string} apiKey
 * @returns {OpenAICompatibleProvider[]}
 */
function createOpenRouterProviders(apiKey) {
  return OPENROUTER_MODELS.map(
    ({ model, label }) =>
      new OpenAICompatibleProvider({
        name: label,
        baseUrl: "https://openrouter.ai/api/v1",
        apiKey,
        model,
        extraHeaders: {
          "HTTP-Referer": "https://samer-portfolio.vercel.app",
          "X-Title": "Samer Portfolio",
        },
        supportsJsonMode: false,
        timeout: 30000,
      })
  );
}

module.exports = createOpenRouterProviders;
