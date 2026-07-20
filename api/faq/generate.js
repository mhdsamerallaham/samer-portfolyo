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
    max_tokens: 2000,
    messages: [
      { role: "system", content: "You are an expert GEO/AEO strategist. Respond ONLY with valid JSON." },
      { role: "user", content: prompt }
    ]
  };
  if (!provider.noJsonMode) body.response_format = { type: "json_object" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000); // Strict 12s timeout per call

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
      console.warn(`[GEO/AEO Generator] ✗ ${provider.name} failed: ${err.message}`);
      lastError = err;
    }
  }
  throw new Error(`All providers failed. Last: ${lastError?.message || "unknown"}`);
}

const fallbackFAQDrafts = [
  {
    category: "E-Ticaret",
    slug: "shopify-donusum-orani-artirma-yollari",
    question_tr: "Shopify'da Sepeti Terk Etme Oranı Nasıl Düşürülür?",
    short_answer_tr: "Sepeti terk etme oranını düşürmek için şeffaf kargo ücretleri sunmalı, misafir ödeme (guest checkout) seçeneği eklemeli ve tek sayfada ödeme (one-page checkout) düzenine geçmelisiniz.",
    content_tr: "<h3>Sepeti Terk Etme Oranını Düşürme Stratejileri</h3><p>E-ticarette ziyaretçilerin %70'inden fazlası ürünleri sepete ekledikten sonra satın almadan ayrılır. Bu durumun en yaygın sebepleri sürpriz kargo ücretleri ve karmaşık ödeme adımlarıdır.</p><h3>Çözüm Adımları</h3><ul><li><strong>Tek Sayfa Ödeme:</strong> Ödeme adımlarını minimuma indirin.</li><li><strong>Şeffaf Fiyatlandırma:</strong> Kargo ve vergi tutarlarını ürün sayfasında gösterin.</li><li><strong>Terk Eposta Otomasyonu:</strong> Sepetini terk eden kullanıcılara 1 saat sonra hatırlatma e-postası gönderin.</li></ul>",
    who_is_this_for_tr: "Shopify mağazasında yüksek sepet terki yaşayan e-ticaret yöneticileri ve marka sahipleri için.",
    cta_text_tr: "E-Ticaret Mağazanızı Birlikte Büyütelim",
    cta_link_tr: "/eticaret-optimizasyon",

    question_en: "How to Reduce Cart Abandonment Rate on Shopify?",
    short_answer_en: "To reduce cart abandonment, offer transparent shipping costs, enable guest checkout, and switch to a one-page checkout layout.",
    content_en: "<h3>Cart Abandonment Strategies</h3><p>Over 70% of e-commerce shoppers abandon their carts before purchase due to hidden fees or complex checkout steps.</p>",
    who_is_this_for_en: "For Shopify store owners experiencing high cart abandonment.",
    cta_text_en: "Optimize Your E-Commerce Store",
    cta_link_en: "/en/ecommerce-optimization",

    question_ar: "كيفية تقليل نسبة ترك السلة في شوبيفاي؟",
    short_answer_ar: "لتقليل نسبة ترك السلة، قدم تكاليف شحن شفافة، وفعل خيار الدفع كزائر، واستخدم صفحة دفع واحدة.",
    content_ar: "<h3>استراتيجيات تقليل ترك السلة</h3><p>أكثر من 70٪ من متسوقي التجارة الإلكترونية يتركون سلاتهم قبل الشراء بسبب الرسوم المخفية أو خطوات الدفع المعقدة.</p>",
    who_is_this_for_ar: "لمالكي متجر شوبيفاي الذين يعانون من ارتفاع نسبة ترك السلة.",
    cta_text_ar: "حسن متجرك الإلكتروني",
    cta_link_ar: "/ar/ecommerce-optimization"
  },
  {
    category: "Yazılım Geliştirme",
    slug: "nextjs-eticaret-hizlandirma-rehberi",
    question_tr: "Next.js ile E-Ticaret Sitem Nasıl Hızlandırılır?",
    short_answer_tr: "Next.js e-ticaret sitenizi hızlandırmak için Sunucu Tarafı İşleme (SSR) veya Statik Üretim (SSG) kullanmalı, görselleri next/image bileşeni ile optimize etmeli ve gereksiz JavaScript paketlerini elemelisiniz.",
    content_tr: "<h3>Next.js E-Ticaret Hız Optimizasyonu</h3><p>Google Core Web Vitals metriklerini yeşile çevirmek için dinamik sayfalarınızda ISR (Incremental Static Regeneration) mimarisini tercih edebilirsiniz.</p>",
    who_is_this_for_tr: "Yüksek hızlı ve ölçeklenebilir e-ticaret altyapısı kurmak isteyen frontend ve fullstack yazılımcılar için.",
    cta_text_tr: "Özel Yazılım Projenizi Başlatalım",
    cta_link_tr: "/ozel-yazilim-gelistirme",

    question_en: "How to Speed Up Next.js E-Commerce Website?",
    short_answer_en: "To speed up Next.js e-commerce sites, leverage SSR or SSG, optimize images with next/image, and eliminate heavy JS bundles.",
    content_en: "<h3>Next.js Speed Optimization</h3><p>Utilize Incremental Static Regeneration (ISR) to achieve sub-second load times and 95+ Core Web Vitals scores.</p>",
    who_is_this_for_en: "For developers and tech leads building high-performance web applications.",
    cta_text_en: "Start Your Custom Software Project",
    cta_link_en: "/en/custom-software",

    question_ar: "كيفية تسريع موقع التجارة الإلكترونية باستخدام Next.js؟",
    short_answer_ar: "لتسريع موقع Next.js، استخدم العرض على جانب الخادم SSR أو التوليد الثابت SSG، وقم بتحسين الصور كودياً.",
    content_ar: "<h3>تحسين سرعة Next.js</h3><p>استخدم ISR لتحقيق سرعة تحميل فائقة في أقل من ثانية واحدة.</p>",
    who_is_this_for_ar: "لمطوري المواقع الذين يبنون تطبيقات تجارة إلكترونية عالية الأداء.",
    cta_text_ar: "ابدأ مشروعك البرمجي",
    cta_link_ar: "/ar/custom-software"
  }
];

module.exports = async (req, res) => {
  const authHeader = req.headers.authorization;
  const secretParam = req.query?.secret;
  const isAuthorized = (authHeader === `Bearer ${process.env.CRON_SECRET}`) || (secretParam === process.env.CRON_SECRET) || (process.env.NODE_ENV === 'development');

  if (!isAuthorized) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { data: existingFaqs } = await supabase.from("faq_posts").select("slug, question_tr");
    const existingList = (existingFaqs || []).map(f => f.question_tr);

    const categories = ["E-Ticaret", "Yazılım Geliştirme", "Web Tasarımı & UX", "E-Ticaret Yönetimi"];
    const targetCategory = categories[Math.floor(Math.random() * categories.length)];

    let trData, enData, arData;

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
      trData = await generateJSONWithFallback(trPrompt);

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
      enData = await generateJSONWithFallback(enPrompt);

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
      arData = await generateJSONWithFallback(arPrompt);

    } catch (llmErr) {
      console.warn("[FAQ Generator] All LLM providers timed out or failed. Loading fail-safe fallback draft...", llmErr.message);
      const draft = fallbackFAQDrafts[Math.floor(Math.random() * fallbackFAQDrafts.length)];
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);

      trData = {
        slug: `${draft.slug}-${randomSuffix}`,
        category: draft.category,
        question_tr: draft.question_tr,
        short_answer_tr: draft.short_answer_tr,
        content_tr: draft.content_tr,
        who_is_this_for_tr: draft.who_is_this_for_tr,
        cta_text_tr: draft.cta_text_tr,
        cta_link_tr: draft.cta_link_tr
      };

      enData = {
        question_en: draft.question_en,
        short_answer_en: draft.short_answer_en,
        content_en: draft.content_en,
        who_is_this_for_en: draft.who_is_this_for_en,
        cta_text_en: draft.cta_text_en,
        cta_link_en: draft.cta_link_en
      };

      arData = {
        question_ar: draft.question_ar,
        short_answer_ar: draft.short_answer_ar,
        content_ar: draft.content_ar,
        who_is_this_for_ar: draft.who_is_this_for_ar,
        cta_text_ar: draft.cta_text_ar,
        cta_link_ar: draft.cta_link_ar
      };
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
      cta_link_ar: arData.cta_link_ar || "/ar/shopify-setup-turkey"
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
      post: insertedData[0]
    });

  } catch (error) {
    console.error("[GEO/AEO FAQ Generator] Exception:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
