/**
 * createProviderManager — Fabrika fonksiyonu
 *
 * Env değişkenlerinden API key'leri okur ve sağlayıcıları
 * öncelik sırasına göre AIProviderManager'a yükler.
 *
 * ┌───────────────────────────────────────────────────────────────────┐
 * │   Öncelik Sırası (Toplam 24 sağlayıcı)                           │
 * │                                                                   │
 * │   ── Gemini (GEMINI_API_KEY) ──────────────────────────────────── │
 * │    1. gemini-3.1-flash-lite          500 RPD, 15 RPM              │
 * │    2. gemini-3.5-flash-lite          500 RPD, 15 RPM              │
 * │    3. gemini-3.6-flash               20 RPD, 5 RPM               │
 * │    4. gemini-3-flash                 20 RPD, 5 RPM               │
 * │    5. gemini-2.5-flash               20 RPD, 5 RPM               │
 * │    6. gemini-2.5-flash-lite          20 RPD, 10 RPM              │
 * │                                                                   │
 * │   ── Groq (GROQ_API_KEY) ─────────────────────────────────────── │
 * │    7. llama-3.3-70b-versatile        Yüksek hız LPU              │
 * │    8. llama-3.1-8b-instant           Ultra hızlı                  │
 * │    9. qwen-qwq-32b                   Reasoning destekli           │
 * │   10. openai/gpt-oss-120b            Flagship açık model          │
 * │   11. openai/gpt-oss-20b             Hafif açık model             │
 * │                                                                   │
 * │   ── Cerebras (CEREBRAS_API_KEY) ──────────────────────────────── │
 * │   12. gemma-4-31b                    Preview                      │
 * │   13. zai-glm-4.7                    Preview (deprecated 17 Aug)  │
 * │   14. gpt-oss-120b                   Production                   │
 * │                                                                   │
 * │   ── HuggingFace Router (HF_TOKEN) ────────────────────────────── │
 * │   15. Llama-3.3-70B via Groq                                      │
 * │   16. Llama-3.3-70B via Together                                  │
 * │   17. Llama-3.3-70B via Cerebras                                  │
 * │   18. Llama-3.3-70B via SambaNova                                 │
 * │   19. Qwen2.5-Coder-32B via Fireworks                            │
 * │   20. Qwen2.5-Coder-32B via Nscale                               │
 * │   21. Llama-3.3-70B via DeepInfra                                 │
 * │                                                                   │
 * │   ── OpenRouter (OPENROUTER_API_KEY) ──────────────────────────── │
 * │   22. Free Auto-Router               Otomatik model seçimi        │
 * │   23. DeepSeek Chat Free                                          │
 * │   24. Llama-4-Maverick Free                                       │
 * │   25. Qwen3-Coder Free                                           │
 * │                                                                   │
 * │   ── Mistral (MISTRAL_API_KEY) ────────────────────────────────── │
 * │   26. mistral-small-latest           Hızlı, çok dilli             │
 * │   27. ministral-8b-latest            Hafif, edge uyumlu           │
 * └───────────────────────────────────────────────────────────────────┘
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
const createOpenRouterProviders = require("./providers/OpenRouterProvider");

function createProviderManager() {
  const providers = [];

  // ── 1. Gemini (En yüksek kota — 500 RPD lite modeller önce) ───
  if (process.env.GEMINI_API_KEY) {
    const geminiModels = [
      { model: "gemini-3.8-flash",      label: "Gemini (gemini-3.8-flash)" },        // Google güncel model
      { model: "gemini-3.1-flash-lite", label: "Gemini (gemini-3.1-flash-lite)" },   // 500 RPD, 15 RPM
      { model: "gemini-3.5-flash-lite", label: "Gemini (gemini-3.5-flash-lite)" },   // 500 RPD, 15 RPM
      { model: "gemini-3.6-flash",      label: "Gemini (gemini-3.6-flash)" },        // 20 RPD, 5 RPM
      { model: "gemini-3-flash",        label: "Gemini (gemini-3-flash)" },          // 20 RPD, 5 RPM
      { model: "gemini-2.5-flash-lite", label: "Gemini (gemini-2.5-flash-lite)" },   // 20 RPD, 10 RPM
    ];
    for (const { model, label } of geminiModels) {
      providers.push(
        new OpenAICompatibleProvider({
          name: label,
          baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
          apiKey: process.env.GEMINI_API_KEY,
          model,
          supportsJsonMode: true,
          timeout: 20000,
        })
      );
    }
  }

  // ── 2. Groq (Yüksek hız LPU — 5 model) ──────────────────────
  if (process.env.GROQ_API_KEY) {
    providers.push(...createGroqProviders(process.env.GROQ_API_KEY));
  }

  // ── 3. Cerebras (3 model) ─────────────────────────────────────
  if (process.env.CEREBRAS_API_KEY) {
    providers.push(...createCerebrasProvider(process.env.CEREBRAS_API_KEY));
  }

  // ── 4. HuggingFace Router (7 backend) ─────────────────────────
  if (process.env.HF_TOKEN) {
    providers.push(...createHuggingFaceProviders(process.env.HF_TOKEN));
  }

  // ── 5. OpenRouter (Ücretsiz modeller — 4 model) ───────────────
  if (process.env.OPENROUTER_API_KEY) {
    providers.push(...createOpenRouterProviders(process.env.OPENROUTER_API_KEY));
  }

  // ── 6. Mistral (2 model) ──────────────────────────────────────
  if (process.env.MISTRAL_API_KEY) {
    const mistralModels = [
      { model: "ministral-8b-latest",  label: "Mistral (ministral-8b-latest)" },
      { model: "mistral-small-latest", label: "Mistral (mistral-small-latest)" },
    ];
    for (const { model, label } of mistralModels) {
      providers.push(
        new OpenAICompatibleProvider({
          name: label,
          baseUrl: "https://api.mistral.ai/v1",
          apiKey: process.env.MISTRAL_API_KEY,
          model,
          supportsJsonMode: true,
          timeout: 20000,
        })
      );
    }
  }

  if (providers.length === 0) {
    console.error(
      "[AIProviderManager] UYARI: Hiçbir API key bulunamadı! " +
        "Lütfen .env dosyasına GEMINI_API_KEY, GROQ_API_KEY, CEREBRAS_API_KEY, HF_TOKEN veya OPENROUTER_API_KEY ekleyin."
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
