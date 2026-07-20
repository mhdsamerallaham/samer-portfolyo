const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Lightweight LLM Router ────────────────────────────────────────────────
// OpenAI-uyumlu unified format: her provider tek bir fonksiyonla çağrılır.
// Otomatik fallback, dinamik model keşfi, zero-config free provider'lar.
// OmniRoute'un yaptığını ~60 satırda, ayrı servis deploy etmeden yapıyoruz.
// ────────────────────────────────────────────────────────────────────────────

// Her provider, OpenAI chat/completions formatında tanımlanır.
// Sıra = öncelik. Biri başarısız olursa sonrakine geçer.
function getProviders() {
  const providers = [];

  // 1) Gemini — en güvenilir, free tier 1500 req/gün
  if (process.env.GEMINI_API_KEY) {
    const geminiModels = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-2.5-flash-lite"
    ];
    for (const model of geminiModels) {
      providers.push({
        name: `Gemini (${model})`,
        url: `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
        model,
        apiKey: process.env.GEMINI_API_KEY,
        headers: {}
      });
    }
  }

  // 2) Groq — hızlı, free tier cömert
  if (process.env.GROQ_API_KEY) {
    for (const model of ["llama-3.3-70b-versatile", "mixtral-8x7b-32768", "llama-3.1-8b-instant"]) {
      providers.push({
        name: `Groq (${model})`,
        url: "https://api.groq.com/openai/v1/chat/completions",
        model,
        apiKey: process.env.GROQ_API_KEY,
        headers: {}
      });
    }
  }

  // 3) Mistral — free tier mevcut
  if (process.env.MISTRAL_API_KEY) {
    for (const model of ["mistral-small-latest", "open-mistral-7b"]) {
      providers.push({
        name: `Mistral (${model})`,
        url: "https://api.mistral.ai/v1/chat/completions",
        model,
        apiKey: process.env.MISTRAL_API_KEY,
        headers: {}
      });
    }
  }

  // 4) OpenRouter — dinamik free model keşfi (ID'ler sık değişir, bu yüzden runtime'da çekiyoruz)
  if (process.env.OPENROUTER_API_KEY) {
    providers.push({
      name: "OpenRouter (dynamic free models)",
      url: "https://openrouter.ai/api/v1/chat/completions",
      model: "__dynamic__", // runtime'da doldurulacak
      apiKey: process.env.OPENROUTER_API_KEY,
      headers: {
        "HTTP-Referer": "https://www.samer.life",
        "X-OpenRouter-Title": "Samer Portfolio Blog Bot"
      },
      isDynamic: true
    });
  }

  // 5) Pollinations — API key gerektirmez, her zaman açık, son çare
  providers.push({
    name: "Pollinations (free, no key)",
    url: "https://text.pollinations.ai/openai",
    model: "openai",
    apiKey: null,
    headers: {},
    noJsonMode: true // json_object response_format desteklemiyor
  });

  return providers;
}

// OpenRouter'daki aktif free modelleri çek (404 sorununu çözer)
async function fetchOpenRouterFreeModels() {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models");
    if (!res.ok) return [];
    const json = await res.json();
    return json.data
      .filter(m => m.id.endsWith(':free'))
      .sort((a, b) => (b.context_length || 0) - (a.context_length || 0))
      .slice(0, 5)
      .map(m => m.id);
  } catch {
    return [];
  }
}

// Tek bir OpenAI-uyumlu provider'a istek at
async function callProvider(provider, prompt) {
  const headers = {
    "Content-Type": "application/json",
    ...provider.headers
  };
  if (provider.apiKey) {
    headers["Authorization"] = `Bearer ${provider.apiKey}`;
  }

  const body = {
    model: provider.model,
    messages: [
      { role: "system", content: "You must respond with valid JSON as requested by the user." },
      { role: "user", content: prompt }
    ]
  };

  // JSON mode desteği varsa ekle
  if (!provider.noJsonMode) {
    body.response_format = { type: "json_object" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const res = await fetch(provider.url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${errText.slice(0, 150)}`);
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response (no choices)");
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

// Ana router: tüm provider'ları sırayla dener, başarılı olanı döndürür
async function generateJSONWithFallback(prompt) {
  const providers = getProviders();
  let lastError;

  for (const provider of providers) {
    // OpenRouter dinamik model keşfi
    if (provider.isDynamic) {
      const freeModels = await fetchOpenRouterFreeModels();
      if (freeModels.length === 0) {
        console.warn(`[Router] ${provider.name}: No free models found, skipping.`);
        continue;
      }
      // Her free modeli dene
      for (const model of freeModels) {
        try {
          const dynamicProvider = { ...provider, model, name: `OpenRouter (${model})` };
          console.log(`[Router] Trying: ${dynamicProvider.name}`);
          const text = await callProvider(dynamicProvider, prompt);
          const parsed = safeParseJSON(text);
          if (parsed) {
            console.log(`[Router] ✓ Success: ${dynamicProvider.name}`);
            return parsed;
          }
          throw new Error("JSON verification failed");
        } catch (err) {
          console.warn(`[Router] ✗ ${provider.name} (${model}): ${err.message}`);
          lastError = err;
        }
      }
      continue;
    }

    // Normal provider
    try {
      console.log(`[Router] Trying: ${provider.name}`);
      const text = await callProvider(provider, prompt);
      const parsed = safeParseJSON(text);
      if (parsed) {
        console.log(`[Router] ✓ Success: ${provider.name}`);
        return parsed;
      }
      throw new Error("JSON verification failed");
    } catch (err) {
      console.warn(`[Router] ✗ ${provider.name}: ${err.message}`);
      lastError = err;
    }
  }

  throw new Error(`All providers failed. Last: ${lastError?.message || "unknown"}`);
}

// ─── JSON Auto-Repair ──────────────────────────────────────────────────────
// Markdown block tag'lerini temizle, eksik parantezleri kapat
// ────────────────────────────────────────────────────────────────────────────

function safeParseJSON(raw) {
  if (!raw) return null;
  let cleaned = raw.trim();
  
  // Strip Markdown code block delimiters if present
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/```$/, '');
  cleaned = cleaned.trim();
  
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON parse failed, attempting auto-repair. Raw snippet:", cleaned.slice(0, 300));
    
    try {
      let openBraces = (cleaned.match(/\{/g) || []).length;
      let closeBraces = (cleaned.match(/\}/g) || []).length;
      let openBrackets = (cleaned.match(/\[/g) || []).length;
      let closeBrackets = (cleaned.match(/\]/g) || []).length;
      
      let patched = cleaned;
      if (patched.endsWith(',')) patched = patched.slice(0, -1);
      
      // Close missing string quotes if cut off inside a text field
      if ((patched.match(/"/g) || []).length % 2 !== 0) {
        patched += '"';
      }
      
      while (closeBraces < openBraces) {
        patched += '}';
        closeBraces++;
      }
      while (closeBrackets < openBrackets) {
        patched += ']';
        closeBrackets++;
      }
      
      return JSON.parse(patched);
    } catch (err) {
      console.error("JSON auto-repair failed:", err.message);
      return null;
    }
  }
}

// Helper to generate slug from text if AI fails to return it
function slugify(text) {
  if (!text) return "";
  const trMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };
  let str = text.toString();
  for (const char in trMap) {
    str = str.replaceAll(char, trMap[char]);
  }
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')     // Remove non-alphanumeric chars
    .replace(/\s+/g, '-')            // Replace spaces with -
    .replace(/-+/g, '-');            // Replace multiple dashes with single
}

// Fallback drafts in case all AI generation engines fail completely (100% fail-safe)
const fallbackDrafts = [
  {
    slug: "eticaret-altyapi-secimi-ve-seo-ipuclari",
    title_tr: "E-Ticarette Doğru Altyapı Seçimi ve SEO Stratejileri",
    summary_tr: "E-ticaret mağazanız için doğru altyapıyı seçerken dikkat etmeniz gereken SEO, hız ve entegrasyon faktörleri.",
    content_tr: `<h3>E-Ticarette Doğru Altyapı Seçimi</h3><p>E-ticaret sitenizi kurarken Shopify veya İKAS gibi modern altyapıları seçmek, arama motorlarında üst sıralarda listelenmeniz için kritik bir öneme sahiptir. Bu yazımızda, teknik SEO ve dönüşüm oranı optimizasyonuna dair temel adımları özetledik.</p><h3>Hız ve Mobil Uyumluluk</h3><p>Google Core Web Vitals skorlarınızı yüksek tutarak sepeti terk etme oranlarınızı düşürebilir ve satışlarınızı artırabilirsiniz.</p><p>Detaylı bilgi için <a href="/eticaret-site-kurulumu">E-Ticaret Kurulumu</a> hizmet sayfamızı ziyaret edebilirsiniz.</p>`,
    seo_title_tr: "E-Ticaret Altyapı Seçimi ve SEO Rehberi",
    seo_description_tr: "E-ticaret siteleri için platform seçimi, SEO uyumluluğu ve dönüşüm oranı optimizasyonuna yönelik temel ipuçları.",
    
    title_en: "Choosing the Right E-Commerce Platform and SEO Tips",
    summary_en: "Crucial factors regarding SEO, page load speed, and integrations when choosing an e-commerce platform.",
    content_en: `<h3>Choosing the Right E-Commerce Platform</h3><p>Selecting modern platforms like Shopify or İKAS is vital for search engine rankings. We summarize key technical SEO steps here.</p><p>For details, check our <a href="/en/ecommerce-setup">E-Commerce Setup</a> service page.</p>`,
    seo_title_en: "E-Commerce Platform Selection and SEO Guide",
    seo_description_en: "Key guidelines for choosing e-commerce platforms, optimizing SEO, and improving checkout speed.",
    
    title_ar: "اختيار منصة التجارة الإلكترونية المناسبة ونصائح السيو",
    summary_ar: "عوامل حاسمة تتعلق بالسيو وسرعة تحميل الصفحات والربط عند اختيار منصة متجرك الإلكتروني.",
    content_ar: `<h3>اختيار منصة التجارة الإلكترونية</h3><p>يعد اختيار منصات حديثة مثل شوبيفاي أو إيكاس أمراً حيوياً لتصدر نتائج البحث. نلخص هنا أهم الخطوات التقنية للسيو.</p><p>للمزيد، يرجى مراجعة صفحة خدمة <a href="/ar/shopify-setup-turkey">إنشاء المتاجر الإلكترونية</a>.</p>`,
    seo_title_ar: "دليل اختيار منصة التجارة الإلكترونية والسيو",
    seo_description_ar: "نصائح وإرشادات حول اختيار منصة المتاجر، تحسين السيو، وزيادة سرعة التصفح والدفع."
  }
];

module.exports = async (req, res) => {
  // 1. Authorization Check (for secure cron job execution)
  const authHeader = req.headers.authorization;
  const secretParam = req.query?.secret;
  
  const isAuthorized = 
    (authHeader === `Bearer ${process.env.CRON_SECRET}`) ||
    (secretParam === process.env.CRON_SECRET) ||
    (process.env.NODE_ENV === 'development');

  if (!isAuthorized) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    // 2. Concurrency Lock: Check if a post was already generated within the last 10 minutes to prevent race conditions
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: recentPosts, error: recentError } = await supabase
      .from("blog_posts")
      .select("id, published_at")
      .gte("published_at", tenMinutesAgo);

    if (recentError) {
      console.warn("[Lock System] Database error checking locks, proceeding with caution:", recentError.message);
    } else if (recentPosts && recentPosts.length > 0) {
      console.log("[Lock System] A blog post was already generated in the last 10 minutes. Skipping this run to prevent duplicate posts.");
      return res.status(200).json({
        success: true,
        message: "Skipped to prevent duplicate execution (Lock active)."
      });
    }

    // 3. Fetch existing blogs from database for context (gap analysis & internal linking)
    const { data: existingPosts, error: dbError } = await supabase
      .from("blog_posts")
      .select("slug, title_tr, title_en, title_ar")
      .order("published_at", { ascending: false });

    if (dbError) {
      throw new Error(`Database error fetching posts: ${dbError.message}`);
    }

    const blogContextList = existingPosts.map(p => ({
      slug: p.slug,
      title_tr: p.title_tr,
      title_en: p.title_en,
      title_ar: p.title_ar
    }));

    // List of website service pages
    const servicePages = [
      { path: "/eticaret-site-kurulumu", name_tr: "E-Ticaret Site Kurulumu", name_en: "E-Commerce Site Setup", name_ar: "إنشاء موقع تجارة إلكترونية" },
      { path: "/eticaret-optimizasyon", name_tr: "E-Ticaret Optimizasyon", name_en: "E-Commerce Optimization", name_ar: "تحسين التجارة الإلكترونية" },
      { path: "/urun-gorsel-ve-icerik", name_tr: "Ürün Görsel ve İçerik", name_en: "Product Images and Content", name_ar: "صور ومحتوى المنتجات" },
      { path: "/stok-ve-depo-sistemi", name_tr: "Stok ve Depo Sistemleri", name_en: "Stock & Warehouse Systems", name_ar: "أنظمة المخزون والمستودعات" },
      { path: "/web-sitesi-gelistirme", name_tr: "Kurumsal & Kişisel Web Sitesi Geliştirme", name_en: "Corporate & Personal Website Development", name_ar: "تطوير المواقع المؤسسية والشخصية" },
      { path: "/ozel-yazilim-gelistirme", name_tr: "Özel Yazılım & API Geliştirme", name_en: "Custom Software & API Development", name_ar: "تطوير البرمجيات المخصصة وواجهات API" },
      { path: "/yapay-zeka-cozumleri", name_tr: "Yapay Zeka Entegrasyonu & Chatbot Çözümleri", name_en: "AI Integration & Chatbot Solutions", name_ar: "تكامل الذكاء الاصطناعي وحلول الشات بوت" }
    ];

    // 4. Step 1: Content Gap Analysis & Turkish Blog Generation
    const trPrompt = `
      You are an expert e-commerce, software development, and SEO strategist. Analyze the following list of existing blog posts and identify a major content gap.
      Then, write a brand new, premium, human-like Turkish blog post that covers this gap.
      Topics can be about e-commerce (Shopify, İKAS, conversion optimization, product photography, stock management), 
      OR about software development (React, Next.js, Node.js, API development, web applications, SaaS, database design),
      OR about AI & technology (chatbots, GPT integration, automation, AI tools for business).
      Alternate between these topic areas to ensure diverse, high-quality content coverage.
      
      Existing Blog Posts:
      ${JSON.stringify(blogContextList, null, 2)}
      
      Website Service Pages (You MUST link to EXACTLY ONE of these):
      ${JSON.stringify(servicePages, null, 2)}
      
      Rules for the Blog Post:
      1. Write in Turkish. Use a natural, local, and conversion-focused tone.
      2. It must be highly detailed, engaging, and professional.
      3. Identify a unique URL slug (language-agnostic, lowercase, hyphenated, e.g. "eticaret-envanter-yonetimi").
      4. Internal Linking requirements:
         - Select EXACTLY 2 related blog posts from the "Existing Blog Posts" list. Insert links to them inside the content using HTML tags: <a href="/blog?post=SLUG">ANCHOR_TEXT</a>. Anchor texts must be SEO-friendly and flow naturally.
         - Select EXACTLY 1 relevant service page from the "Website Service Pages" list. Insert a link to it using HTML tag: <a href="PATH">ANCHOR_TEXT</a>.
         - Links must be integrated naturally, not forced.
      5. Include standard SEO elements: title, summary, seo_title, and seo_description.
      
      Output the response in the following JSON format:
      {
        "slug": "url-slug",
        "title_tr": "Turkish Title",
        "summary_tr": "Short Turkish Summary (2-3 sentences)",
        "content_tr": "Detailed HTML Content with <h3>, <p>, <ul>, <li> tags and the 3 internal links",
        "seo_title_tr": "SEO Title (max 60 chars)",
        "seo_description_tr": "Meta Description (max 160 chars)"
      }
    `;

    let trData, enData, arData;
    try {
      trData = await generateJSONWithFallback(trPrompt);

      // 5. Step 2: Translation and Localization to English
      const enPrompt = `
        You are a professional multilingual translator and SEO strategist. 
        Translate and localize the following Turkish blog post into English.
        
        Turkish Post:
        ${JSON.stringify(trData, null, 2)}
        
        Existing Blog Posts Context:
        ${JSON.stringify(blogContextList, null, 2)}

        Website Service Pages Context:
        ${JSON.stringify(servicePages, null, 2)}
        
        Translation Rules:
        1. Use a clear, professional, and global English tone.
        2. Do not do a word-for-word translation. Keep the meaning consistent but make it sound natural to English readers.
        3. Adapt the internal links:
           - Keep the exact same link URLs (e.g. "/blog?post=SLUG" and "PATH").
           - Translate the anchor text of the links naturally into English so it fits the English sentence flow and remains SEO-friendly.
        4. Translate the title, summary, and generate English SEO metadata (seo_title, seo_description).
        
        Output the response in the following JSON format:
        {
          "title_en": "English Title",
          "summary_en": "English Summary",
          "content_en": "English HTML Content with the updated English links",
          "seo_title_en": "English SEO Title",
          "seo_description_en": "English Meta Description"
        }
      `;
      enData = await generateJSONWithFallback(enPrompt);

      // 6. Step 3: Translation and Localization to Arabic
      const arPrompt = `
        You are a professional multilingual translator and SEO strategist. 
        Translate and localize the following Turkish blog post into Arabic.
        
        Turkish Post:
        ${JSON.stringify(trData, null, 2)}
        
        Existing Blog Posts Context:
        ${JSON.stringify(blogContextList, null, 2)}

        Website Service Pages Context:
        ${JSON.stringify(servicePages, null, 2)}
        
        Translation Rules:
        1. Use a simple, modern Arabic (Fusha) tone that is easy to read.
        2. Do not do a word-for-word translation. Ensure proper flow and structure for Arabic readers.
        3. Adapt the internal links:
           - Keep the exact same link URLs (e.g. "/blog?post=SLUG" and "PATH").
           - Translate the anchor text of the links naturally into Arabic so it fits the Arabic sentence flow and remains SEO-friendly.
        4. Translate the title, summary, and generate Arabic SEO metadata (seo_title, seo_description).
        
        Output the response in the following JSON format:
        {
          "title_ar": "Arabic Title",
          "summary_ar": "Arabic Summary",
          "content_ar": "Arabic HTML Content with the updated Arabic links",
          "seo_title_ar": "Arabic SEO Title",
          "seo_description_ar": "Arabic Meta Description"
        }
      `;
      arData = await generateJSONWithFallback(arPrompt);
    } catch (generationError) {
      console.warn("[Cron Job] All LLM providers failed. Loading static backup draft fallback...", generationError.message);
      
      const draft = fallbackDrafts[Math.floor(Math.random() * fallbackDrafts.length)];
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      
      trData = {
        slug: `${draft.slug}-${randomSuffix}`,
        title_tr: draft.title_tr,
        summary_tr: draft.summary_tr,
        content_tr: draft.content_tr,
        seo_title_tr: draft.seo_title_tr,
        seo_description_tr: draft.seo_description_tr
      };
      
      enData = {
        title_en: draft.title_en,
        summary_en: draft.summary_en,
        content_en: draft.content_en,
        seo_title_en: draft.seo_title_en,
        seo_description_en: draft.seo_description_en
      };
      
      arData = {
        title_ar: draft.title_ar,
        summary_ar: draft.summary_ar,
        content_ar: draft.content_ar,
        seo_title_ar: draft.seo_title_ar,
        seo_description_ar: draft.seo_description_ar
      };
    }

    // Ensure title and slug exist and are strictly unique to prevent DB constraint crashes
    const titleTr = trData.title_tr || "Otomatik E-Ticaret Blogu";
    let baseSlug = trData.slug || slugify(titleTr);
    if (!baseSlug) {
      baseSlug = `blog-post-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Check against existing blog slugs fetched in Step 3
    let postSlug = baseSlug;
    const existingSlugs = new Set((existingPosts || []).map(p => p.slug));
    if (existingSlugs.has(postSlug)) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      postSlug = `${baseSlug}-${randomSuffix}`;
      console.log(`[Slug System] Existing slug collision detected. Resolved "${baseSlug}" -> "${postSlug}"`);
    }

    // 7. Step 4: Save the fully localized blog post to Supabase (Single multilingual row)
    const newPost = {
      slug: postSlug,
      published_at: new Date().toISOString(),
      
      // Turkish
      title_tr: titleTr,
      summary_tr: trData.summary_tr || "E-ticaret ve dijital büyüme süreçlerine dair ipuçları.",
      content_tr: trData.content_tr || "<p>Yazı içeriği yüklenemedi.</p>",
      seo_title_tr: trData.seo_title_tr || titleTr,
      seo_description_tr: trData.seo_description_tr || (trData.summary_tr || "Açıklama bulunmuyor."),
      
      // English
      title_en: enData.title_en || titleTr,
      summary_en: enData.summary_en || (trData.summary_tr || "E-commerce updates."),
      content_en: enData.content_en || (trData.content_tr || "<p>Content unavailable.</p>"),
      seo_title_en: enData.seo_title_en || (enData.title_en || titleTr),
      seo_description_en: enData.seo_description_en || (enData.summary_en || "No description."),
      
      // Arabic
      title_ar: arData.title_ar || titleTr,
      summary_ar: arData.summary_ar || (trData.summary_tr || "أحدث المقالات حول التجارة الإلكترونية."),
      content_ar: arData.content_ar || (trData.content_tr || "<p>المحتوى غير متوفر حالياً.</p>"),
      seo_title_ar: arData.seo_title_ar || (arData.title_ar || titleTr),
      seo_description_ar: arData.seo_description_ar || (arData.summary_ar || "لا يوجد وصف.")
    };

    let insertedData, insertError;
    ({ data: insertedData, error: insertError } = await supabase
      .from("blog_posts")
      .insert([newPost])
      .select());

    // Fail-safe: If Postgres throws duplicate slug error (23505 constraint), append unique suffix and retry once
    if (insertError && (insertError.code === '23505' || insertError.message?.includes("unique constraint") || insertError.message?.includes("slug"))) {
      console.warn(`[DB Insert Conflict] Duplicate slug "${newPost.slug}" encountered. Retrying with unique suffix...`);
      newPost.slug = `${postSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
      ({ data: insertedData, error: insertError } = await supabase
        .from("blog_posts")
        .insert([newPost])
        .select());
    }

    if (insertError) {
      throw new Error(`Database error saving post: ${insertError.message}`);
    }

    // Return Success Response
    return res.status(200).json({
      success: true,
      message: "Blog post generated, translated, linked, and saved successfully.",
      post: insertedData[0]
    });

  } catch (error) {
    console.error("Cron Job Error:", error);
    
    // Trigger automated EmailJS failure notification
    try {
      const serviceId = process.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = process.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.VITE_EMAILJS_PUBLIC_KEY;
      
      if (serviceId && templateId && publicKey) {
        console.log("[Alert System] Sending automated failure notification email via EmailJS...");
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              from_name: "Automated Blog Bot Alert",
              from_email: "bot@samer.life",
              phone: "N/A",
              website: "https://www.samer.life",
              platform: "Vercel Cron Job (6 Hours)",
              budget: "N/A",
              message: `HATA ALARMI: Otomatik blog yazısı üretme ve paylaşma botu hata verdi!\n\nHata Mesajı: ${error.message}\n\nTarih: ${new Date().toLocaleString('tr-TR')}`
            },
          }),
        });
        console.log("[Alert System] Email notification sent successfully.");
      } else {
        console.warn("[Alert System] EmailJS credentials missing on environment, skipping failure notification.");
      }
    } catch (mailError) {
      console.error("[Alert System] Failed to send error notification email:", mailError.message);
    }

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
