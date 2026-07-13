const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper for API calls with Exponential Backoff retry logic
async function generateContentWithRetry(model, prompt, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await model.generateContent(prompt);
    } catch (error) {
      const isTransient = error.status === 503 || error.status === 429 || 
                          (error.message && (error.message.includes("503") || error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("fetch failed")));
      if (isTransient && i < retries - 1) {
        console.warn(`Gemini API transient error (${error.status || error.message}). Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }
}

module.exports = async (req, res) => {
  // 1. Authorization Check (for secure cron job execution)
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    // 2. Fetch existing blogs from database for context (gap analysis & internal linking)
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
      { path: "/stok-ve-depo-sistemi", name_tr: "Stok ve Depo Sistemleri", name_en: "Stock & Warehouse Systems", name_ar: "أنظمة المخزون والمستودعات" }
    ];

    // 3. Step 1: Content Gap Analysis & Turkish Blog Generation
    // We use gemini-flash-latest as a powerful, cost-effective model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" }
    });

    const trPrompt = `
      You are an expert e-commerce and SEO strategist. Analyze the following list of existing blog posts and identify a major content gap.
      Then, write a brand new, premium, human-like Turkish blog post that covers this gap.
      
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

    const trResult = await generateContentWithRetry(model, trPrompt);
    const trData = JSON.parse(trResult.response.text());

    // 4. Step 2: Translation and Localization to English
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

    const enResult = await generateContentWithRetry(model, enPrompt);
    const enData = JSON.parse(enResult.response.text());

    // 5. Step 3: Translation and Localization to Arabic
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

    const arResult = await generateContentWithRetry(model, arPrompt);
    const arData = JSON.parse(arResult.response.text());

    // 6. Step 4: Save the fully localized blog post to Supabase
    const newPost = {
      slug: trData.slug,
      published_at: new Date().toISOString(),
      
      // Turkish
      title_tr: trData.title_tr,
      summary_tr: trData.summary_tr,
      content_tr: trData.content_tr,
      seo_title_tr: trData.seo_title_tr,
      seo_description_tr: trData.seo_description_tr,
      
      // English
      title_en: enData.title_en,
      summary_en: enData.summary_en,
      content_en: enData.content_en,
      seo_title_en: enData.seo_title_en,
      seo_description_en: enData.seo_description_en,
      
      // Arabic
      title_ar: arData.title_ar,
      summary_ar: arData.summary_ar,
      content_ar: arData.content_ar,
      seo_title_ar: arData.seo_title_ar,
      seo_description_ar: arData.seo_description_ar
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
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
