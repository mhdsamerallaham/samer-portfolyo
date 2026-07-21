const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const createProviderManager = require("../lib/createProviderManager");

// ─── Supabase Client ─────────────────────────────────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ─── AI Provider Manager ──────────────────────────────────────────────────────
// Öncelik: Cerebras → Groq → HuggingFace Router → Gemini → Mistral
// Her yeni istek Cerebras'tan başlar (cache yok).
const manager = createProviderManager();

// GEO/AEO sistem promptu
const FAQ_SYSTEM_PROMPT =
  "You are an expert GEO/AEO strategist. Respond ONLY with valid JSON. Never truncate your response.";

// ─── Yardımcı Fonksiyonlar ───────────────────────────────────────────────────

function slugify(text) {
  if (!text) return "";
  const trMap = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  let str = text.toString();
  for (const char in trMap) str = str.replaceAll(char, trMap[char]);
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}



// ─── Ana Handler ──────────────────────────────────────────────────────────────
module.exports = async (req, res) => {
  // Authorization Check
  const authHeader = req.headers.authorization;
  const secretParam = req.query?.secret;
  const hasCronSecret = Boolean(process.env.CRON_SECRET);

  const isAuthorized =
    (hasCronSecret && authHeader === `Bearer ${process.env.CRON_SECRET}`) ||
    (hasCronSecret && secretParam === process.env.CRON_SECRET) ||
    req.headers["x-vercel-cron"] === "1" ||
    process.env.NODE_ENV === "development";

  if (!isAuthorized) {
    console.error("[FAQ Generator] 401 Unauthorized. Debug:", {
      hasCronSecret,
      receivedHeader: authHeader ? authHeader.slice(0, 20) + "..." : "(boş)",
      hasSecretParam: Boolean(secretParam),
      isVercelCron: req.headers["x-vercel-cron"],
      nodeEnv: process.env.NODE_ENV,
    });
    return res.status(401).json({
      error: "Unauthorized",
      hint: "CRON_SECRET Vercel Dashboard'a eklenmiş mi? Settings → Environment Variables",
    });
  }

  try {
    const { data: existingFaqs } = await supabase.from("faq_posts").select("slug, question_tr");
    const existingList = (existingFaqs || []).map((f) => f.question_tr);

    const categories = ["E-Ticaret", "Yazılım Geliştirme", "Web Tasarımı & UX", "E-Ticaret Yönetimi"];
    const targetCategory = categories[Math.floor(Math.random() * categories.length)];

    let trData, enData, arData;

    // ── AI Üretim Bloğu ──────────────────────────────────────────────────────
    try {
      const trPrompt = `
        You are an expert SEO strategist specialized in GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization).
        Generate 1 HIGH-AUTHORITY, REAL GOOGLE USER SEARCH QUESTION & ANSWER item for AI search engines (ChatGPT, Gemini, Perplexity).

        TARGET DOMAIN: ${targetCategory}
        Do NOT duplicate these existing questions: ${JSON.stringify(existingList)}

        STRICT GEO/AEO STRUCTURE REQUIREMENTS:
        1. question_tr: Must be a real, high-volume Google "People Also Ask" search question in Turkish.
        2. slug: Language-agnostic, lowercase, hyphenated URL slug (e.g. "shopify-sepeti-terk-etme-orani-dusurme").
        3. category: "${targetCategory}"
        4. short_answer_tr: Concise 2-3 sentence direct answer optimized for Google Featured Snippets & AI direct answers. Explicitly include What, Why, and How.
        5. content_tr: Detailed, expert answer (250-400 words) formatted in clean HTML (<h3>, <p>, <ul>, <li>, <strong>) with a step-by-step solution. Include 1 internal link to a relevant service page (e.g. <a href="/eticaret-optimizasyon">E-Ticaret Optimizasyon</a>).
        6. who_is_this_for_tr: 2-3 sentences explaining target audience and scenario.
        7. cta_text_tr: Actionable CTA text (e.g. "E-Ticaret Mağazanızı Birlikte Büyütelim")
        8. cta_link_tr: Link path (e.g. "/eticaret-site-kurulumu")

        Respond in JSON format:
        {
          "slug": "url-slug",
          "category": "${targetCategory}",
          "question_tr": "Turkish Question",
          "short_answer_tr": "Short 2-3 sentence answer",
          "content_tr": "Detailed HTML content with step-by-step solution",
          "who_is_this_for_tr": "Target audience explanation",
          "cta_text_tr": "CTA text",
          "cta_link_tr": "CTA link path"
        }
      `;

      // Adım 1: Türkçe soru & cevap
      trData = await manager.generateJSON(trPrompt, FAQ_SYSTEM_PROMPT);

      // Adım 2: Arapça çeviri (önce Arapça)
      const arPrompt = `
        Translate and localize into modern Arabic (Fusha):
        ${JSON.stringify(trData)}
        Respond in JSON format:
        {
          "question_ar": "Arabic Question",
          "short_answer_ar": "Arabic 2-3 sentence short answer",
          "content_ar": "Arabic detailed HTML content",
          "who_is_this_for_ar": "Arabic target audience",
          "cta_text_ar": "Arabic CTA text",
          "cta_link_ar": "Arabic CTA link path"
        }
      `;
      arData = await manager.generateJSON(arPrompt, FAQ_SYSTEM_PROMPT);

      // Adım 3: İngilizce çeviri (sonra İngilizce)
      const enPrompt = `
        Translate and localize into English:
        ${JSON.stringify(trData)}
        Respond in JSON format:
        {
          "question_en": "English Question",
          "short_answer_en": "English 2-3 sentence short answer",
          "content_en": "English detailed HTML content",
          "who_is_this_for_en": "English target audience",
          "cta_text_en": "English CTA text",
          "cta_link_en": "English CTA link path"
        }
      `;
      enData = await manager.generateJSON(enPrompt, FAQ_SYSTEM_PROMPT);

    } catch (llmErr) {
      console.error(
        "[FAQ Generator] All LLM providers timed out or failed. Skipping publication.",
        llmErr.message
      );
      throw new Error(`FAQ AI generation failed: ${llmErr.message}`);
    }

    const baseSlug = trData.slug || slugify(trData.question_tr);
    const uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newFaq = {
      slug: uniqueSlug,
      category: trData.category || targetCategory || "e-commerce",
      published_at: new Date().toISOString(),

      question_tr: trData.question_tr || "Shopify Sepeti Terk Etme Oranı Nasıl Düşürülür?",
      short_answer_tr: trData.short_answer_tr || "Tek sayfada ödeme seçeneği sunarak sepet terki düşürülebilir.",
      content_tr: trData.content_tr || "<p>Detaylı e-ticaret optimizasyonu hakkında bilgi alın.</p>",
      who_is_this_for_tr: trData.who_is_this_for_tr || "E-ticaret yöneticileri için.",
      cta_text_tr: trData.cta_text_tr || "E-Ticaret Mağazanızı Birlikte Büyütelim",
      cta_link_tr: trData.cta_link_tr || "/eticaret-site-kurulumu",

      question_en: enData.question_en || trData.question_tr,
      short_answer_en: enData.short_answer_en || trData.short_answer_tr,
      content_en: enData.content_en || trData.content_tr,
      who_is_this_for_en: enData.who_is_this_for_en || trData.who_is_this_for_tr,
      cta_text_en: enData.cta_text_en || "Optimize Your E-Commerce Store",
      cta_link_en: enData.cta_link_en || "/en/ecommerce-setup",

      question_ar: arData.question_ar || trData.question_tr,
      short_answer_ar: arData.short_answer_ar || trData.short_answer_tr,
      content_ar: arData.content_ar || trData.content_tr,
      who_is_this_for_ar: arData.who_is_this_for_ar || trData.who_is_this_for_tr,
      cta_text_ar: arData.cta_text_ar || "حسن متجرك الإلكتروني",
      cta_link_ar: arData.cta_link_ar || "/ar/shopify-setup-turkey",
    };

    const { data: insertedData, error: insertError } = await supabase
      .from("faq_posts")
      .insert([newFaq])
      .select();

    if (insertError) {
      throw new Error(`Database error saving FAQ post: ${insertError.message}`);
    }

    return res.status(200).json({
      success: true,
      message: "GEO/AEO FAQ post generated and saved successfully.",
      post: insertedData[0],
    });

  } catch (error) {
    console.error("[GEO/AEO FAQ Generator] Exception:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
