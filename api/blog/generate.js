const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper for HTTP fetch requests with Exponential Backoff retry logic
async function fetchWithRetry(url, options, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      // Fallback straight to next model/provider on 429 to prevent wasteful rate-limiting retry delay blocks
      if (res.status === 429) {
        console.warn(`[HTTP Fetch] Rate limit (429) encountered. Fast-falling back to next configuration...`);
        return res; 
      }
      if (res.status === 503) {
        if (i < retries - 1) {
          console.warn(`[HTTP Retry] Status 503. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
      }
      return res;
    } catch (err) {
      if (i < retries - 1) {
        console.warn(`[HTTP Retry] Fetch failed: ${err.message}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw err;
      }
    }
  }
  return await fetch(url, options); // Final fallback attempt
}

// Helper for Gemini SDK content generation with retry logic
async function generateContentWithRetry(model, prompt, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await model.generateContent(prompt);
    } catch (error) {
      if (error.status === 429) {
        console.warn(`[Gemini SDK] Rate limit (429) encountered. Fast-falling back...`);
        throw error;
      }
      const isTransient = error.status === 503 || 
                          (error.message && (error.message.includes("503") || error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("fetch failed")));
      if (isTransient && i < retries - 1) {
        console.warn(`Gemini API transient error. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }
}

// Helper to dynamically fetch and return the active list of OpenRouter free models
async function getOpenRouterFreeModels() {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models");
    if (res.ok) {
      const json = await res.json();
      const freeModels = json.data
        .filter(m => m.id.endsWith(':free'))
        .map(m => m.id);
      if (freeModels.length > 0) {
        console.log(`[OpenRouter] Dynamically found ${freeModels.length} free models.`);
        return freeModels;
      }
    }
  } catch (err) {
    console.warn("[OpenRouter] Failed to fetch free models list dynamically:", err.message);
  }
  // Hardcoded fallback list if the API request fails
  return [
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen-2.5-72b-instruct:free"
  ];
}

// Helper to safely clean up Markdown block tags and repair incomplete JSON responses (unterminated strings)
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

// Sequence of LLM providers for fallback behavior
const providers = [
  {
    name: "Gemini API (Direct Key - Model Rotator)",
    async run(prompt) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not defined in environment.");
      }
      const modelsToTry = [
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-2.0-flash"
      ];
      
      let lastError;
      for (const modelName of modelsToTry) {
        try {
          console.log(`[Gemini SDK] Attempting model: ${modelName}`);
          const model = genAI.getGenerativeModel({ 
            model: modelName,
            generationConfig: { responseMimeType: "application/json" }
          });
          const result = await generateContentWithRetry(model, prompt);
          return result.response.text();
        } catch (err) {
          console.warn(`[Gemini SDK] Model ${modelName} failed:`, err.message);
          lastError = err;
        }
      }
      throw new Error(`All Gemini models failed. Last error: ${lastError.message}`);
    }
  },
  {
    name: "Groq API (Direct Key)",
    async run(prompt) {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("GROQ_API_KEY is not defined in environment.");
      }
      
      const modelsToTry = [
        "llama-3.3-70b-versatile",
        "mixtral-8x7b-32768",
        "llama-3.1-8b-instant"
      ];

      let lastError;
      for (const modelName of modelsToTry) {
        try {
          console.log(`[Groq] Attempting model: ${modelName}`);
          const res = await fetchWithRetry("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                { role: "system", content: "You must respond with valid JSON as requested by the user." },
                { role: "user", content: prompt }
              ],
              response_format: { type: "json_object" }
            })
          });

          if (!res.ok) {
            throw new Error(`Groq returned status ${res.status}`);
          }
          const json = await res.json();
          return json.choices[0].message.content;
        } catch (err) {
          console.warn(`[Groq] Model ${modelName} failed:`, err.message);
          lastError = err;
        }
      }
      throw new Error(`All Groq models failed. Last error: ${lastError.message}`);
    }
  },
  {
    name: "Mistral API (Direct Key)",
    async run(prompt) {
      const apiKey = process.env.MISTRAL_API_KEY;
      if (!apiKey) {
        throw new Error("MISTRAL_API_KEY is not defined in environment.");
      }

      const modelsToTry = [
        "mistral-small-latest",
        "open-mistral-7b"
      ];

      let lastError;
      for (const modelName of modelsToTry) {
        try {
          console.log(`[Mistral] Attempting model: ${modelName}`);
          const res = await fetchWithRetry("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                { role: "system", content: "You must respond with valid JSON as requested by the user." },
                { role: "user", content: prompt }
              ],
              response_format: { type: "json_object" }
            })
          });

          if (!res.ok) {
            throw new Error(`Mistral returned status ${res.status}`);
          }
          const json = await res.json();
          return json.choices[0].message.content;
        } catch (err) {
          console.warn(`[Mistral] Model ${modelName} failed:`, err.message);
          lastError = err;
        }
      }
      throw new Error(`All Mistral models failed. Last error: ${lastError.message}`);
    }
  },
  {
    name: "Pollinations Text API (Qwen Model)",
    async run(prompt) {
      const res = await fetchWithRetry("https://text.pollinations.ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You must respond with valid JSON as requested by the user. Keep your responses concise (limit to 500 words maximum) to prevent truncation errors." },
            { role: "user", content: prompt }
          ],
          model: "openai",
          jsonMode: true
        })
      });
      if (!res.ok) {
        throw new Error(`Pollinations API error: Status ${res.status} - ${res.statusText}`);
      }
      return await res.text();
    }
  },
  {
    name: "OpenRouter API (Rotated Free Models - Dynamic List)",
    async run(prompt) {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY is not defined in environment.");
      }

      // Fetch dynamic active free models list to prevent 404s
      const modelsToTry = await getOpenRouterFreeModels();

      let lastError;
      for (const modelName of modelsToTry) {
        try {
          console.log(`[OpenRouter] Attempting model: ${modelName}`);
          const res = await fetchWithRetry("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "HTTP-Referer": "https://www.samer.life",
              "X-OpenRouter-Title": "Samer Portfolio Blog Bot",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                { role: "system", content: "You must respond with valid JSON as requested by the user." },
                { role: "user", content: prompt }
              ],
              response_format: { type: "json_object" }
            })
          });

          if (!res.ok) {
            throw new Error(`OpenRouter model ${modelName} returned status ${res.status}`);
          }
          
          const json = await res.json();
          if (!json.choices || json.choices.length === 0 || !json.choices[0].message) {
            throw new Error(`OpenRouter empty response for model ${modelName}`);
          }
          return json.choices[0].message.content;
        } catch (err) {
          console.warn(`[OpenRouter] Model ${modelName} failed:`, err.message);
          lastError = err;
        }
      }
      throw new Error(`All OpenRouter models failed. Last error: ${lastError.message}`);
    }
  }
];

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

async function generateJSONWithFallback(prompt) {
  let lastError;
  for (const provider of providers) {
    try {
      console.log(`[Fallback API] Attempting generation with provider: ${provider.name}`);
      const text = await provider.run(prompt);
      const parsed = safeParseJSON(text);
      if (parsed) {
        console.log(`[Fallback API] Success using provider: ${provider.name}`);
        return parsed;
      } else {
        throw new Error("Response failed JSON verification");
      }
    } catch (error) {
      console.error(`[Fallback API] Provider ${provider.name} failed:`, error.message);
      lastError = error;
    }
  }
  throw new Error(`All LLM generation providers failed. Last error: ${lastError ? lastError.message : "unknown"}`);
}

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
      console.warn("[Cron Job] All LLM providers failed or returned invalid responses. Loading static backup draft fallback...", generationError.message);
      
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

    // Ensure title and slug exist to satisfy database constraints
    const titleTr = trData.title_tr || "Otomatik E-Ticaret Blogu";
    const postSlug = trData.slug || slugify(titleTr);
    
    if (!postSlug) {
      throw new Error("Could not generate a valid slug for the blog post.");
    }

    // 7. Step 4: Save the fully localized blog post to Supabase
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

    const { data: insertedData, error: insertError } = await supabase
      .from("blog_posts")
      .insert([newPost])
      .select();

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
