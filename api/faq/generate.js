const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

let geminiQuotaExceeded = false;

function getProviders() {
  const providers = [];

  if (process.env.GEMINI_API_KEY && !geminiQuotaExceeded) {
    for (const model of ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite"]) {
      providers.push({
        name: `Gemini (${model})`,
        url: `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
        model,
        apiKey: process.env.GEMINI_API_KEY,
        isGemini: true
      });
    }
  }

  if (process.env.GROQ_API_KEY) {
    for (const model of ["llama-3.3-70b-versatile", "mixtral-8x7b-32768", "llama-3.1-8b-instant"]) {
      providers.push({
        name: `Groq (${model})`,
        url: "https://api.groq.com/openai/v1/chat/completions",
        model,
        apiKey: process.env.GROQ_API_KEY
      });
    }
  }

  if (process.env.MISTRAL_API_KEY) {
    for (const model of ["mistral-small-latest", "open-mistral-7b"]) {
      providers.push({
        name: `Mistral (${model})`,
        url: "https://api.mistral.ai/v1/chat/completions",
        model,
        apiKey: process.env.MISTRAL_API_KEY
      });
    }
  }

  providers.push({
    name: "Pollinations (free, fast)",
    url: "https://text.pollinations.ai/openai",
    model: "openai",
    apiKey: null,
    noJsonMode: true
  });

  return providers;
}

function safeParseJSON(raw) {
  if (!raw) return null;
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim();
  
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    try {
      let openBraces = (cleaned.match(/\{/g) || []).length;
      let closeBraces = (cleaned.match(/\}/g) || []).length;
      let openBrackets = (cleaned.match(/\[/g) || []).length;
      let closeBrackets = (cleaned.match(/\]/g) || []).length;
      let patched = cleaned;
      if (patched.endsWith(',')) patched = patched.slice(0, -1);
      if ((patched.match(/"/g) || []).length % 2 !== 0) patched += '"';
      while (closeBraces < openBraces) { patched += '}'; closeBraces++; }
      while (closeBrackets < openBrackets) { patched += ']'; closeBrackets++; }
      return JSON.parse(patched);
    } catch {
      return null;
    }
  }
}

function slugify(text) {
  if (!text) return "";
  const trMap = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
  let str = text.toString();
  for (const char in trMap) str = str.replaceAll(char, trMap[char]);
  return str.toLowerCase().trim().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

async function callProvider(provider, prompt) {
  const headers = { "Content-Type": "application/json" };
  if (provider.apiKey) headers["Authorization"] = `Bearer ${provider.apiKey}`;

  const body = {
    model: provider.model,
    max_tokens: 3000,
    messages: [
      { role: "system", content: "You are an expert GEO/AEO strategist. Respond ONLY with valid JSON as requested." },
      { role: "user", content: prompt }
    ]
  };
  if (!provider.noJsonMode) body.response_format = { type: "json_object" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const res = await fetch(provider.url, { method: "POST", headers, body: JSON.stringify(body), signal: controller.signal });
    if (!res.ok) {
      if (res.status === 429 && provider.isGemini) geminiQuotaExceeded = true;
      throw new Error(`HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.choices?.[0]?.message?.content;
  } finally {
    clearTimeout(timeout);
  }
}

async function generateJSONWithFallback(prompt) {
  const providers = getProviders();
  let lastError;
  for (const provider of providers) {
    try {
      console.log(`[GEO/AEO Generator] Trying: ${provider.name}`);
      const text = await callProvider(provider, prompt);
      const parsed = safeParseJSON(text);
      if (parsed) return parsed;
    } catch (err) {
      lastError = err;
    }
  }
  throw new Error(`All providers failed. Last: ${lastError?.message || "unknown"}`);
}

module.exports = async (req, res) => {
  const authHeader = req.headers.authorization;
  const secretParam = req.query?.secret;
  const isAuthorized = (authHeader === `Bearer ${process.env.CRON_SECRET}`) || (secretParam === process.env.CRON_SECRET) || (process.env.NODE_ENV === 'development');

  if (!isAuthorized) return res.status(401).json({ error: "Unauthorized" });

  try {
    // 1. Fetch existing FAQ questions to avoid duplicate questions
    const { data: existingFaqs } = await supabase.from("faq_posts").select("slug, question_tr");
    const existingList = (existingFaqs || []).map(f => f.question_tr);

    // Select category randomly to ensure balanced coverage across 4 domains
    const categories = ["E-Ticaret", "Yazılım Geliştirme", "Web Tasarımı & UX", "E-Ticaret Yönetimi"];
    const targetCategory = categories[Math.floor(Math.random() * categories.length)];

    // 2. Generate GEO / AEO Structured Q&As in Turkish
    const trPrompt = `
      You are an expert SEO strategist specialized in GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization).
      Generate 1 HIGH-AUTHORITY, REAL GOOGLE USER SEARCH QUESTION & ANSWER item for AI search engines (ChatGPT, Gemini, Perplexity).

      TARGET DOMAIN: ${targetCategory}
      Do NOT duplicate these existing questions: ${JSON.stringify(existingList)}

      STRICT GEO/AEO STRUCTURE REQUIREMENTS:
      1. question_tr: Must be a real, high-volume Google "People Also Ask" search question in Turkish (e.g. "Shopify'da Sepeti Terk Etme Oranı Nasıl Düşürülür?" or "Next.js ile E-Ticaret Sitem Nasıl Hızlandırılır?").
      2. slug: Language-agnostic, lowercase, hyphenated URL slug (e.g. "shopify-sepeti-terk-etme-orani-dusurme").
      3. category: "${targetCategory}"
      4. short_answer_tr: Concise 2-3 sentence direct answer optimized for Google Featured Snippets & AI direct answers. Explicitly include What, Why, and How.
      5. content_tr: Detailed, expert answer (250-400 words) formatted in clean HTML (<h3>, <p>, <ul>, <li>, <strong>) with a step-by-step solution. Include 1 internal link to a relevant service page (e.g. <a href="/eticaret-optimizasyon">E-Ticaret Optimizasyon</a> or <a href="/ozel-yazilim-gelistirme">Özel Yazılım Geliştirme</a>).
      6. who_is_this_for_tr: 2-3 sentences explaining target audience and scenario.
      7. cta_text_tr: Actionable CTA text (e.g. "E-Ticaret Mağazanızı Birlikte Büyütelim")
      8. cta_link_tr: Link path (e.g. "/eticaret-site-kurulumu" or "/web-sitesi-gelistirme")

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

    const trData = await generateJSONWithFallback(trPrompt);

    // 3. Translate and localize into English
    const enPrompt = `
      Translate and localize the following GEO/AEO Q&A item into English for a global audience.
      Turkish Item: ${JSON.stringify(trData)}

      JSON Format:
      {
        "question_en": "English Question",
        "short_answer_en": "English 2-3 sentence short answer",
        "content_en": "English detailed HTML content with step-by-step solution",
        "who_is_this_for_en": "English target audience",
        "cta_text_en": "English CTA text",
        "cta_link_en": "English CTA link path"
      }
    `;
    const enData = await generateJSONWithFallback(enPrompt);

    // 4. Translate and localize into Arabic
    const arPrompt = `
      Translate and localize the following GEO/AEO Q&A item into modern Arabic (Fusha).
      Turkish Item: ${JSON.stringify(trData)}

      JSON Format:
      {
        "question_ar": "Arabic Question",
        "short_answer_ar": "Arabic 2-3 sentence short answer",
        "content_ar": "Arabic detailed HTML content with step-by-step solution",
        "who_is_this_for_ar": "Arabic target audience",
        "cta_text_ar": "Arabic CTA text",
        "cta_link_ar": "Arabic CTA link path"
      }
    `;
    const arData = await generateJSONWithFallback(arPrompt);

    // 5. Construct single multilingual record
    const baseSlug = trData.slug || slugify(trData.question_tr);
    const uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newFaq = {
      slug: uniqueSlug,
      category: "e-commerce",
      published_at: new Date().toISOString(),

      question_tr: trData.question_tr,
      short_answer_tr: trData.short_answer_tr,
      content_tr: trData.content_tr,
      who_is_this_for_tr: trData.who_is_this_for_tr,
      cta_text_tr: trData.cta_text_tr,
      cta_link_tr: trData.cta_link_tr || "/eticaret-site-kurulumu",

      question_en: enData.question_en,
      short_answer_en: enData.short_answer_en,
      content_en: enData.content_en,
      who_is_this_for_en: enData.who_is_this_for_en,
      cta_text_en: enData.cta_text_en,
      cta_link_en: enData.cta_link_en || "/en/ecommerce-setup",

      question_ar: arData.question_ar,
      short_answer_ar: arData.short_answer_ar,
      content_ar: arData.content_ar,
      who_is_this_for_ar: arData.who_is_this_for_ar,
      cta_text_ar: arData.cta_text_ar,
      cta_link_ar: arData.cta_link_ar || "/ar/shopify-setup-turkey"
    };

    const { data: inserted, error: insertErr } = await supabase.from("faq_posts").insert([newFaq]).select();
    if (insertErr) throw new Error(`DB Error: ${insertErr.message}`);

    return res.status(200).json({
      success: true,
      message: "GEO/AEO Q&A post generated and published successfully in 3 languages.",
      faq: inserted[0]
    });
  } catch (err) {
    console.error("[GEO/AEO Generator] Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
