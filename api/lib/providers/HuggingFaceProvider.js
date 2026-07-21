const OpenAICompatibleProvider = require("../OpenAICompatibleProvider");

/**
 * HuggingFace Router Providers — Öncelik 3, 4, 5
 *
 * HuggingFace Router, farklı backend sağlayıcılar üzerinden
 * güçlü açık kaynak modellere erişim sağlar.
 * Base URL: https://router.huggingface.co/v1
 *
 * Env: HF_TOKEN
 */
const HF_MODELS = [
  {
    model: "meta-llama/Llama-3.3-70B-Instruct:groq",
    label: "HuggingFace Router (Llama-3.3-70B via Groq)",
  },
  {
    model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B:novita",
    label: "HuggingFace Router (DeepSeek-R1-32B via Novita)",
  },
  {
    model: "Qwen/Qwen2.5-Coder-32B-Instruct:nscale",
    label: "HuggingFace Router (Qwen2.5-Coder-32B via Nscale)",
  },
  {
    model: "mistralai/Mistral-7B-Instruct-v0.3:featherless",
    label: "HuggingFace Router (Mistral-7B via Featherless)",
  },
];

/**
 * @param {string} hfToken
 * @returns {OpenAICompatibleProvider[]}
 */
function createHuggingFaceProviders(hfToken) {
  return HF_MODELS.map(
    ({ model, label }) =>
      new OpenAICompatibleProvider({
        name: label,
        baseUrl: "https://router.huggingface.co/v1",
        apiKey: hfToken,
        model,
        supportsJsonMode: false,
        timeout: 25000,
      })
  );
}

module.exports = createHuggingFaceProviders;
