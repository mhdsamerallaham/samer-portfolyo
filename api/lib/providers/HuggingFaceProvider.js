const OpenAICompatibleProvider = require("../OpenAICompatibleProvider");

/**
 * HuggingFace Router Providers
 *
 * HuggingFace Router, farklı backend sağlayıcılar üzerinden
 * güçlü açık kaynak modellere erişim sağlar.
 * Base URL: https://router.huggingface.co/v1
 *
 * Aktif modeller ve providerlar (Temmuz 2026).
 *
 * Env: HF_TOKEN
 */
const HF_MODELS = [
  // ── Groq backend ───────────────────────────────────────────
  {
    model: "meta-llama/Llama-3.3-70B-Instruct:groq",
    label: "HF Router (Llama-3.3-70B via Groq)",
  },
  // ── Together AI backend ────────────────────────────────────
  {
    model: "meta-llama/Llama-3.3-70B-Instruct:together",
    label: "HF Router (Llama-3.3-70B via Together)",
  },
  // ── Cerebras backend ───────────────────────────────────────
  {
    model: "meta-llama/Llama-3.3-70B-Instruct:cerebras",
    label: "HF Router (Llama-3.3-70B via Cerebras)",
  },
  // ── SambaNova backend ──────────────────────────────────────
  {
    model: "meta-llama/Llama-3.3-70B-Instruct:sambanova",
    label: "HF Router (Llama-3.3-70B via SambaNova)",
  },
  // ── Fireworks AI backend ───────────────────────────────────
  {
    model: "Qwen/Qwen2.5-Coder-32B-Instruct:fireworks-ai",
    label: "HF Router (Qwen2.5-Coder-32B via Fireworks)",
  },
  // ── Nscale backend ─────────────────────────────────────────
  {
    model: "Qwen/Qwen2.5-Coder-32B-Instruct:nscale",
    label: "HF Router (Qwen2.5-Coder-32B via Nscale)",
  },
  // ── DeepInfra backend ──────────────────────────────────────
  {
    model: "meta-llama/Llama-3.3-70B-Instruct:deepinfra",
    label: "HF Router (Llama-3.3-70B via DeepInfra)",
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
