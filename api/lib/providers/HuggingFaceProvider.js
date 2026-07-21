const OpenAICompatibleProvider = require("../OpenAICompatibleProvider");

/**
 * HuggingFace Router Providers — Öncelik 3, 4, 5
 *
 * HuggingFace Router, farklı backend sağlayıcılar üzerinden
 * güçlü açık kaynak modellere erişim sağlar.
 * Base URL: https://router.huggingface.co/v1
 *
 * Env: HF_TOKEN
 *
 * Model formatı: "owner/ModelName:backend"
 *   - :groq    → Groq altyapısı
 *   - :novita  → Novita altyapısı
 *   - :nscale  → Nscale altyapısı
 */
const HF_MODELS = [
  {
    model: "meta-llama/Llama-3.3-70B-Instruct:groq",
    label: "HuggingFace Router (Llama-3.3-70B via Groq)",
  },
  {
    model: "deepseek-ai/DeepSeek-V3:novita",
    label: "HuggingFace Router (DeepSeek-V3 via Novita)",
  },
  {
    model: "Qwen/Qwen3-32B:nscale",
    label: "HuggingFace Router (Qwen3-32B via Nscale)",
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
        // HF Router bazı modellerde json_object formatını desteklemeyebilir
        supportsJsonMode: false,
        timeout: 30000,
      })
  );
}

module.exports = createHuggingFaceProviders;
