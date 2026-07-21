/**
 * createProviderManager — Fabrika fonksiyonu
 *
 * Env değişkenlerinden API key'leri okur ve sağlayıcıları
 * öncelik sırasına göre AIProviderManager'a yükler.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │   Öncelik Sırası                                            │
 * │                                                             │
 * │   1. Cerebras (llama-3.3-70b)           CEREBRAS_API_KEY    │
 * │   2. Groq (llama-3.3-70b-versatile)     GROQ_API_KEY        │
 * │   3. Groq (mixtral-8x7b-32768)          GROQ_API_KEY        │
 * │   4. Groq (llama-3.1-8b-instant)        GROQ_API_KEY        │
 * │   5. HF Router → Llama-3.3-70B (Groq)  HF_TOKEN            │
 * │   6. HF Router → DeepSeek-V3 (Novita)  HF_TOKEN            │
 * │   7. HF Router → Qwen3-32B (Nscale)    HF_TOKEN            │
 * │   8. Gemini (gemini-1.5-flash)          GEMINI_API_KEY      │
 * │   9. Gemini (gemini-2.0-flash)          GEMINI_API_KEY      │
 * │  10. Mistral (mistral-small-latest)     MISTRAL_API_KEY     │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Yeni sağlayıcı eklemek için:
 *   1. api/lib/providers/ altına yeni bir dosya oluştur
 *   2. Bu dosyada uygun if bloğunun altına providers.push(...) ekle
 */

const AIProviderManager = require("./AIProviderManager");
const OpenAICompatibleProvider = require("./OpenAICompatibleProvider");
const createCerebrasProvider = require("./providers/CerebrasProvider");
const createGroqProviders = require("./providers/GroqProvider");
const createHuggingFaceProviders = require("./providers/HuggingFaceProvider");

function createProviderManager() {
  const providers = [];

  // ── 1. Cerebras ─────────────────────────────────────────────
  if (process.env.CEREBRAS_API_KEY) {
    providers.push(createCerebrasProvider(process.env.CEREBRAS_API_KEY));
  }

  // ── 2–4. Groq ───────────────────────────────────────────────
  if (process.env.GROQ_API_KEY) {
    providers.push(...createGroqProviders(process.env.GROQ_API_KEY));
  }

  // ── 5–7. HuggingFace Router ─────────────────────────────────
  if (process.env.HF_TOKEN) {
    providers.push(...createHuggingFaceProviders(process.env.HF_TOKEN));
  }

  // ── 8–9. Gemini (legacy, düşük öncelik) ─────────────────────
  if (process.env.GEMINI_API_KEY) {
    for (const model of ["gemini-1.5-flash", "gemini-2.0-flash"]) {
      providers.push(
        new OpenAICompatibleProvider({
          name: `Gemini (${model})`,
          baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
          apiKey: process.env.GEMINI_API_KEY,
          model,
          supportsJsonMode: true,
          timeout: 20000,
        })
      );
    }
  }

  // ── 10. Mistral (legacy, düşük öncelik) ─────────────────────
  if (process.env.MISTRAL_API_KEY) {
    providers.push(
      new OpenAICompatibleProvider({
        name: "Mistral (mistral-small-latest)",
        baseUrl: "https://api.mistral.ai/v1",
        apiKey: process.env.MISTRAL_API_KEY,
        model: "mistral-small-latest",
        supportsJsonMode: true,
        timeout: 20000,
      })
    );
  }

  if (providers.length === 0) {
    console.error(
      "[AIProviderManager] UYARI: Hiçbir API key bulunamadı! " +
        "Lütfen .env dosyasına CEREBRAS_API_KEY, GROQ_API_KEY veya HF_TOKEN ekleyin."
    );
  } else {
    console.log(
      `[AIProviderManager] ${providers.length} sağlayıcı yapılandırıldı: ` +
        providers.map((p) => p.name).join(" → ")
    );
  }

  return new AIProviderManager(providers);
}

module.exports = createProviderManager;
