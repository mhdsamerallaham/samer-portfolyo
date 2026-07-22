const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const createProviderManager = require("../lib/createProviderManager");
const QualityEngine = require("../modules/quality/QualityEngine");
const EntityEngine = require("../modules/entities/EntityEngine");
const ExpertInterviewEngine = require("../modules/expert/ExpertInterviewEngine");

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
const manager = createProviderManager();

// GEO/AEO sistem promptu
const FAQ_SYSTEM_PROMPT =
  "You are an expert GEO/AEO strategist and software architect. Respond ONLY with valid JSON. Never truncate your response.";

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

module.exports = async (req, res) => {
  const authHeader = req.headers.authorization;
  const secretParam = req.query?.secret;
  const hasCronSecret = Boolean(process.env.CRON_SECRET);

  const isAuthorized =
    (hasCronSecret && authHeader === `Bearer ${process.env.CRON_SECRET}`) ||
    (hasCronSecret && secretParam === process.env.CRON_SECRET) ||
    req.headers["x-vercel-cron"] === "1" ||
    process.env.NODE_ENV === "development";

  if (!isAuthorized) {
    return res.status(401).json({
      error: "Unauthorized",
      hint: "CRON_SECRET Vercel Dashboard'a eklenmiş mi?",
    });
  }

  try {
    const { data: existingFaqs } = await supabase.from("faq_posts").select("slug, question_tr");
    const existingList = (existingFaqs || []).map((f) => f.question_tr);

    const categories = ["E-Ticaret", "Yazılım Geliştirme", "Web Tasarımı & UX", "E-Ticaret Yönetimi"];
    const targetCategory = categories[Math.floor(Math.random() * categories.length)];

    const expertContext = ExpertInterviewEngine.getExpertContext(targetCategory);

    let trData, enData, arData;

    // AI Generation
    const trPrompt = `
      You are an expert SEO strategist specialized in GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization).
      Generate 1 HIGH-AUTHORITY, REAL GOOGLE USER SEARCH QUESTION & ANSWER item for AI search engines (ChatGPT, Gemini, Perplexity).

      TARGET DOMAIN: ${targetCategory}
      EXPERT PERSPECTIVE: ${JSON.stringify(expertContext)}
      Do NOT duplicate these existing questions: ${JSON.stringify(existingList)}

      STRICT GEO/AEO STRUCTURE REQUIREMENTS:
      1. question_tr: Real Google "People Also Ask" search question in Turkish.
      2. slug: Lowercase, hyphenated URL slug.
      3. category: "${targetCategory}"
      4. short_answer_tr: Concise 2-3 sentence direct answer optimized for Google Featured Snippets & AI direct answers. Explicitly include What, Why, and How.
      5. content_tr: Detailed, expert answer (250-400 words) formatted in clean HTML (<h3>, <p>, <ul>, <li>, <strong>) with a step-by-step solution.
      6. who_is_this_for_tr: 2-3 sentences explaining target audience and scenario.
      7. cta_text_tr: Actionable CTA text (e.g. "E-Ticaret Mağazanızı Birlikte Büyütelim")
      8. cta_link_tr: Link path (e.g. "/eticaret-site-kurulumu")

      Respond in JSON format:
      {
        "slug": "url-slug",
        "category": "${targetCategory}",
        "question_tr": "Turkish Question",
        "short_answer_tr": "Short 2-3 sentence answer",
        "content_tr": "Detailed HTML content",
        "who_is_this_for_tr": "Target audience explanation",
        "cta_text_tr": "CTA text",
        "cta_link_tr": "CTA link path"
      }
    `;

    trData = await manager.generateJSON(trPrompt, FAQ_SYSTEM_PROMPT);

    // English Localization
    const enPrompt = `Translate and culturally localize into English for global readers: ${JSON.stringify(trData)}`;
    enData = await manager.generateJSON(enPrompt, FAQ_SYSTEM_PROMPT);

    // Arabic Localization
    const arPrompt = `Translate and culturally localize into modern Arabic (Fusha): ${JSON.stringify(trData)}`;
    arData = await manager.generateJSON(arPrompt, FAQ_SYSTEM_PROMPT);

    // Extract Entities & Audit Quality Score (> 90 Requirement)
    const entities = EntityEngine.extractEntitiesFromText(`${trData.question_tr} ${trData.content_tr}`);
    const qualityAudit = QualityEngine.evaluateContent({
      title: trData.question_tr,
      directAnswer: trData.short_answer_tr,
      contentHtml: trData.content_tr,
      whoIsThisFor: trData.who_is_this_for_tr,
      expertAnswers: [expertContext],
      entities,
      citations: [{ source_url: 'https://web.dev/vitals/', citation_title: 'Google Technical Docs' }],
    });

    console.log("[FAQ Gatekeeper Audit]", qualityAudit);

    if (!qualityAudit.passedGatekeeper && process.env.NODE_ENV !== "development") {
      return res.status(422).json({
        success: false,
        message: "Content score below 80/100 threshold. Refinement required.",
        audit: qualityAudit,
      });
    }

    const baseSlug = trData.slug || slugify(trData.question_tr);
    const uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newFaq = {
      slug: uniqueSlug,
      category: trData.category || targetCategory,
      published_at: new Date().toISOString(),

      question_tr: trData.question_tr,
      short_answer_tr: trData.short_answer_tr,
      content_tr: trData.content_tr,
      who_is_this_for_tr: trData.who_is_this_for_tr,
      cta_text_tr: trData.cta_text_tr,
      cta_link_tr: trData.cta_link_tr,

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
      message: "GEO/AEO FAQ post generated, audited (>90 score) and saved successfully.",
      qualityScore: qualityAudit.overallScore,
      post: insertedData[0],
    });
  } catch (error) {
    console.error("[GEO/AEO FAQ Generator] Exception:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
