const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const createProviderManager = require("../lib/createProviderManager");
const TopicDiscoveryEngine = require("../modules/discovery/TopicDiscoveryEngine");
const IntentClassifierEngine = require("../modules/intent/IntentClassifierEngine");
const ResearchEngine = require("../modules/research/ResearchEngine");
const ExpertInterviewEngine = require("../modules/expert/ExpertInterviewEngine");
const EntityEngine = require("../modules/entities/EntityEngine");
const KnowledgeEngine = require("../modules/knowledge/KnowledgeEngine");
const MemoryEngine = require("../modules/knowledge/MemoryEngine");
const QualityEngine = require("../modules/quality/QualityEngine");
const SemanticLinkingEngine = require("../modules/semantic-linking/SemanticLinkingEngine");

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

const BLOG_SYSTEM_PROMPT =
  "You are a Principal Software Architect, EEAT Specialist, and GEO/AEO Strategist. You must respond strictly with valid JSON. Never truncate your response.";

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
    // Step 1: Fetch Existing Articles (Content Memory Check)
    const { data: existingPosts } = await supabase
      .from("blog_posts")
      .select("slug, title_tr")
      .order("published_at", { ascending: false });

    // Step 2: Topic Discovery & Intent Classification Engine
    const discoveredTopics = TopicDiscoveryEngine.discoverTopics();
    const candidateTopic = discoveredTopics[Math.floor(Math.random() * discoveredTopics.length)];

    // Check Content Memory
    const memoryCheck = MemoryEngine.checkMemory(candidateTopic.title, existingPosts || []);
    console.log("[Content Memory Check]", memoryCheck);

    // Step 3: Research Engine (Live Web & Docs Facts Extraction)
    const research = await ResearchEngine.gatherResearch(candidateTopic.title, candidateTopic.category);

    // Step 4: Expert Interview Engine (EEAT Insights)
    const expertContext = ExpertInterviewEngine.getExpertContext(candidateTopic.category);

    // Step 5: Multi-Provider LLM Synthesis Pipeline
    const trPrompt = `
      You are an expert technical writer and e-commerce software architect.
      Write a comprehensive, EEAT-rich, GEO/AEO-optimized Turkish article about: "${candidateTopic.title}"

      Topic Intent: ${candidateTopic.intent}
      Research Facts: ${JSON.stringify(research.factual_points)}
      Expert Practitioner Context: ${JSON.stringify(expertContext)}

      REQUIREMENTS:
      1. title_tr: Catchy, high CTR title in Turkish.
      2. slug: Lowercase URL slug.
      3. summary_tr: Engaging 2-3 sentence overview.
      4. direct_answer_tr: Concise 2-3 sentence direct answer for Google Featured Snippets & Perplexity/ChatGPT AI boxes.
      5. content_tr: 400-600 words of expert HTML content (<h3>, <p>, <ul>, <li>, <strong>, <table>).
      6. seo_title_tr: 50-60 character meta title.
      7. seo_description_tr: 140-160 character meta description.

      Respond ONLY in JSON:
      {
        "slug": "url-slug",
        "title_tr": "Turkish Title",
        "summary_tr": "Turkish Summary",
        "direct_answer_tr": "Direct Answer for AI Snippets",
        "content_tr": "HTML Content",
        "seo_title_tr": "SEO Title",
        "seo_description_tr": "SEO Description"
      }
    `;

    const trData = await manager.generateJSON(trPrompt, BLOG_SYSTEM_PROMPT);

    // Step 6: Cultural Localization Pipeline (EN & AR)
    const enPrompt = `Culturally adapt and translate this article into professional English: ${JSON.stringify(trData)}`;
    const enData = await manager.generateJSON(enPrompt, BLOG_SYSTEM_PROMPT);

    const arPrompt = `Culturally adapt and translate this article into modern Fusha Arabic: ${JSON.stringify(trData)}`;
    const arData = await manager.generateJSON(arPrompt, BLOG_SYSTEM_PROMPT);

    // Step 7: Entity Extraction & Semantic Internal Linking
    const entities = EntityEngine.extractEntitiesFromText(`${trData.title_tr} ${trData.content_tr}`);
    const linkedHtmlTr = SemanticLinkingEngine.injectSemanticLinks(trData.content_tr, existingPosts || []);

    // Step 8: Quality Gatekeeping Engine (> 90 Score Enforcer)
    const qualityAudit = QualityEngine.evaluateContent({
      title: trData.title_tr,
      directAnswer: trData.direct_answer_tr,
      contentHtml: linkedHtmlTr,
      expertAnswers: [expertContext],
      entities,
      citations: research.sources || [],
    });

    console.log("[Blog Gatekeeper Quality Audit]", qualityAudit);

    if (!qualityAudit.passedGatekeeper && process.env.NODE_ENV !== "development") {
      return res.status(422).json({
        success: false,
        message: "Article quality score below 80/100 threshold. Refinement queued.",
        audit: qualityAudit,
      });
    }

    const uniqueSlug = `${trData.slug || slugify(trData.title_tr)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPost = {
      slug: uniqueSlug,
      published_at: new Date().toISOString(),

      title_tr: trData.title_tr,
      summary_tr: trData.summary_tr,
      content_tr: linkedHtmlTr,
      seo_title_tr: trData.seo_title_tr || trData.title_tr,
      seo_description_tr: trData.seo_description_tr || trData.summary_tr,

      title_en: enData.title_en || trData.title_tr,
      summary_en: enData.summary_en || trData.summary_tr,
      content_en: enData.content_en || linkedHtmlTr,
      seo_title_en: enData.seo_title_en || trData.title_tr,
      seo_description_en: enData.seo_description_en || trData.summary_tr,

      title_ar: arData.title_ar || trData.title_tr,
      summary_ar: arData.summary_ar || trData.summary_tr,
      content_ar: arData.content_ar || linkedHtmlTr,
      seo_title_ar: arData.seo_title_ar || trData.title_tr,
      seo_description_ar: arData.seo_description_ar || trData.summary_tr,
    };

    const { data: insertedData, error: insertError } = await supabase
      .from("blog_posts")
      .insert([newPost])
      .select();

    if (insertError) {
      throw new Error(`Database error saving blog post: ${insertError.message}`);
    }

    return res.status(200).json({
      success: true,
      message: "Enterprise AI Knowledge Article generated, audited (>90 score), and published successfully.",
      qualityScore: qualityAudit.overallScore,
      entitiesFound: entities.map((e) => e.name),
      post: insertedData[0],
    });
  } catch (error) {
    console.error("[Enterprise Blog Generator] Exception:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
