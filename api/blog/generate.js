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

// Blog generation sistem promptu
const BLOG_SYSTEM_PROMPT =
  "You must respond with valid JSON as requested by the user. " +
  "Ensure all HTML tags and JSON fields are fully closed and never truncated.";

// ─── Yardımcı Fonksiyonlar ───────────────────────────────────────────────────

// Kesilmiş HTML etiketlerini otomatik kapat
function sanitizeHTMLContent(html) {
  if (!html) return "<p>İçerik yüklenemedi.</p>";
  let str = html.trim();

  if (
    !str.endsWith(">") &&
    !str.endsWith(".") &&
    !str.endsWith("!") &&
    !str.endsWith("?")
  ) {
    const lastPunct = Math.max(
      str.lastIndexOf("."),
      str.lastIndexOf("!"),
      str.lastIndexOf("?"),
      str.lastIndexOf("</p>")
    );
    if (lastPunct > 100) {
      str = str.slice(0, lastPunct + 1);
    }
  }

  const openP = (str.match(/<p>/gi) || []).length;
  const closeP = (str.match(/<\/p>/gi) || []).length;
  for (let i = 0; i < openP - closeP; i++) str += "</p>";

  const openH3 = (str.match(/<h3>/gi) || []).length;
  const closeH3 = (str.match(/<\/h3>/gi) || []).length;
  for (let i = 0; i < openH3 - closeH3; i++) str += "</h3>";

  const openUl = (str.match(/<ul>/gi) || []).length;
  const closeUl = (str.match(/<\/ul>/gi) || []).length;
  for (let i = 0; i < openUl - closeUl; i++) str += "</ul>";

  return str;
}

// Türkçe karakterleri de destekleyen slug üretici
function slugify(text) {
  if (!text) return "";
  const trMap = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "c",
    Ğ: "g",
    İ: "i",
    Ö: "o",
    Ş: "s",
    Ü: "u",
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

// ─── Fallback Taslaklar ───────────────────────────────────────────────────────
// Tüm AI sağlayıcıları başarısız olursa kullanılır (%100 güvenli yedek)
const fallbackDrafts = [
  {
    slug: "eticaret-altyapi-secimi-ve-seo-ipuclari",
    title_tr: "E-Ticarette Doğru Altyapı Seçimi ve SEO Stratejileri",
    summary_tr:
      "E-ticaret mağazanız için doğru altyapıyı seçerken dikkat etmeniz gereken SEO, hız ve entegrasyon faktörleri.",
    content_tr: `<h3>E-Ticarette Doğru Altyapı Seçimi</h3><p>E-ticaret sitenizi kurarken Shopify veya İKAS gibi modern altyapıları seçmek, arama motorlarında üst sıralarda listelenmeniz için kritik bir öneme sahiptir.</p><h3>Hız ve Mobil Uyumluluk</h3><p>Google Core Web Vitals skorlarınızı yüksek tutarak sepeti terk etme oranlarınızı düşürebilir ve satışlarınızı artırabilirsiniz.</p><p>Detaylı bilgi için <a href="/eticaret-site-kurulumu">E-Ticaret Kurulumu</a> hizmet sayfamızı ziyaret edebilirsiniz.</p>`,
    seo_title_tr: "E-Ticaret Altyapı Seçimi ve SEO Rehberi",
    seo_description_tr:
      "E-ticaret siteleri için platform seçimi, SEO uyumluluğu ve dönüşüm oranı optimizasyonuna yönelik temel ipuçları.",
    title_en: "Choosing the Right E-Commerce Platform and SEO Tips",
    summary_en:
      "Crucial factors regarding SEO, page load speed, and integrations when choosing an e-commerce platform.",
    content_en: `<h3>Choosing the Right E-Commerce Platform</h3><p>Selecting modern platforms like Shopify or İKAS is vital for search engine rankings.</p><p>For details, check our <a href="/en/ecommerce-setup">E-Commerce Setup</a> service page.</p>`,
    seo_title_en: "E-Commerce Platform Selection and SEO Guide",
    seo_description_en:
      "Key guidelines for choosing e-commerce platforms, optimizing SEO, and improving checkout speed.",
    title_ar: "اختيار منصة التجارة الإلكترونية المناسبة ونصائح السيو",
    summary_ar:
      "عوامل حاسمة تتعلق بالسيو وسرعة تحميل الصفحات والربط عند اختيار منصة متجرك الإلكتروني.",
    content_ar: `<h3>اختيار منصة التجارة الإلكترونية</h3><p>يعد اختيار منصات حديثة مثل شوبيفاي أو إيكاس أمراً حيوياً لتصدر نتائج البحث.</p><p>للمزيد، يرجى مراجعة صفحة خدمة <a href="/ar/shopify-setup-turkey">إنشاء المتاجر الإلكترونية</a>.</p>`,
    seo_title_ar: "دليل اختيار منصة التجارة الإلكترونية والسيو",
    seo_description_ar:
      "نصائح وإرشادات حول اختيار منصة المتاجر، تحسين السيو، وزيادة سرعة التصفح والدفع.",
  },
];

// ─── Atomic Concurrency Lock ──────────────────────────────────────────────────
const STALE_LOCK_MINUTES = 2;

async function acquireAtomicLock(forceBypass = false) {
  if (forceBypass) {
    console.log("[Atomic Lock] Bypassed via force parameter.");
    return true;
  }
  try {
    const { data: locks, error: selectErr } = await supabase
      .from("cron_locks")
      .select("*")
      .eq("job_name", "blog_generate");

    if (selectErr || !locks || locks.length === 0) {
      await supabase
        .from("cron_locks")
        .upsert({ job_name: "blog_generate", is_processing: true, started_at: new Date().toISOString() });
      return true;
    }

    const currentLock = locks[0];
    const startedAt = currentLock.started_at ? new Date(currentLock.started_at).getTime() : 0;
    const isStale = Date.now() - startedAt > STALE_LOCK_MINUTES * 60 * 1000;

    if (!currentLock.is_processing || isStale) {
      await supabase
        .from("cron_locks")
        .update({ is_processing: true, started_at: new Date().toISOString() })
        .eq("job_name", "blog_generate");
      return true;
    }

    return false;
  } catch (err) {
    console.warn("[Atomic Lock] Exception (proceeding with execution):", err.message);
    return true;
  }
}

async function releaseAtomicLock() {
  try {
    await supabase
      .from("cron_locks")
      .update({ is_processing: false })
      .eq("job_name", "blog_generate");
  } catch (err) {
    console.warn("[Atomic Lock] Lock release warning:", err.message);
  }
}

// ─── Ana Handler ──────────────────────────────────────────────────────────────
module.exports = async (req, res) => {
  // 1. Authorization Check
  // Vercel Cron, CRON_SECRET ortam değişkeni tanımlanmışsa otomatik olarak
  // "Authorization: Bearer <CRON_SECRET>" header'ı gönderir.
  // ⚠️ CRON_SECRET Vercel Dashboard → Settings → Environment Variables'a eklenmeli!
  const authHeader = req.headers.authorization;
  const secretParam = req.query?.secret;
  const forceParam = req.query?.force === "true";
  const hasCronSecret = Boolean(process.env.CRON_SECRET);

  const isAuthorized =
    (hasCronSecret && authHeader === `Bearer ${process.env.CRON_SECRET}`) ||
    (hasCronSecret && secretParam === process.env.CRON_SECRET) ||
    req.headers["x-vercel-cron"] === "1" ||
    process.env.NODE_ENV === "development";

  if (!isAuthorized) {
    // Debug: hangi koşulun neden başarısız olduğunu logla
    console.error("[Blog Generator] 401 Unauthorized. Debug:", {
      hasCronSecret,
      receivedHeader: authHeader ? authHeader.slice(0, 20) + "..." : "(boş)",
      hasSecretParam: Boolean(secretParam),
      isVercelCron: req.headers["x-vercel-cron"],
      nodeEnv: process.env.NODE_ENV,
    });
    return res.status(401).json({
      error: "Unauthorized access",
      hint: "CRON_SECRET Vercel Dashboard'a eklenmiş mi? Settings → Environment Variables",
    });
  }

  // 2. Atomic Lock Check (paralel çalışmayı önler)
  const gotLock = await acquireAtomicLock(forceParam);
  if (!gotLock) {
    console.log("[Atomic Lock] Another blog generation process is currently running. Skipping.");
    return res.status(200).json({
      success: true,
      skipped: true,
      reason: "already_running",
      message: "Skipped: Another generation process is currently running.",
    });
  }

  try {
    // 3. Son 10 dakika içinde yazı oluşturuldu mu? (race condition koruması)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: recentPosts, error: recentError } = await supabase
      .from("blog_posts")
      .select("id, published_at")
      .gte("published_at", tenMinutesAgo);

    if (recentError) {
      console.warn("[Lock System] Database error checking locks, proceeding:", recentError.message);
    } else if (recentPosts && recentPosts.length > 0) {
      console.log("[Lock System] A blog post was already generated in the last 10 minutes. Skipping.");
      return res.status(200).json({
        success: true,
        message: "Skipped to prevent duplicate execution (Lock active).",
      });
    }

    // 4. Mevcut blog yazılarını çek (gap analizi + iç linkleme için)
    const { data: existingPosts, error: dbError } = await supabase
      .from("blog_posts")
      .select("slug, title_tr, title_en, title_ar")
      .order("published_at", { ascending: false });

    if (dbError) {
      throw new Error(`Database error fetching posts: ${dbError.message}`);
    }

    const blogContextList = existingPosts.map((p) => ({
      slug: p.slug,
      title_tr: p.title_tr,
      title_en: p.title_en,
      title_ar: p.title_ar,
    }));

    // Hizmet sayfaları listesi
    const servicePages = [
      { path: "/eticaret-site-kurulumu", name_tr: "E-Ticaret Site Kurulumu", name_en: "E-Commerce Site Setup", name_ar: "إنشاء موقع تجارة إلكترونية" },
      { path: "/eticaret-optimizasyon", name_tr: "E-Ticaret Optimizasyon", name_en: "E-Commerce Optimization", name_ar: "تحسين التجارة الإلكترونية" },
      { path: "/urun-gorsel-ve-icerik", name_tr: "Ürün Görsel ve İçerik", name_en: "Product Images and Content", name_ar: "صور ومحتوى المنتجات" },
      { path: "/stok-ve-depo-sistemi", name_tr: "Stok ve Depo Sistemleri", name_en: "Stock & Warehouse Systems", name_ar: "أنظمة المخزون والمستودعات" },
      { path: "/web-sitesi-gelistirme", name_tr: "Kurumsal & Kişisel Web Sitesi Geliştirme", name_en: "Corporate & Personal Website Development", name_ar: "تطوير المواقع المؤسسية والشخصية" },
      { path: "/ozel-yazilim-gelistirme", name_tr: "Özel Yazılım & API Geliştirme", name_en: "Custom Software & API Development", name_ar: "تطوير البرمجيات المخصصة وواجهات API" },
      { path: "/yapay-zeka-cozumleri", name_tr: "Yapay Zeka Entegrasyonu & Chatbot Çözümleri", name_en: "AI Integration & Chatbot Solutions", name_ar: "تكامل الذكاء الاصطناعي وحلول الشات بوت" },
    ];

    // 5. Adım 1: Türkçe blog içeriği üret
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
      3. AI RETRIEVAL & GEO CITATION REQUIREMENTS (CRITICAL FOR ChatGPT / PERPLEXITY / GOOGLE):
         - Include at least ONE HTML Comparison Table (<table>) comparing 2-3 options or benchmarks.
         - Include at least ONE practical code snippet or step-by-step formula using <code> or <pre> tags (e.g. Liquid snippet, Node.js API call, or Core Web Vitals formula).
         - Include a bold key takeaway line (e.g. <strong>Özet Çıkarım:</strong> ...) in the introduction.
      4. Identify a unique URL slug (language-agnostic, lowercase, hyphenated, e.g. "eticaret-envanter-yonetimi").
      5. Internal Linking requirements:
         - Select EXACTLY 2 related blog posts from the "Existing Blog Posts" list. Insert links to them inside the content using HTML tags: <a href="/blog?post=SLUG">ANCHOR_TEXT</a>. Anchor texts must be SEO-friendly and flow naturally.
         - Select EXACTLY 1 relevant service page from the "Website Service Pages" list. Insert a link to it using HTML tag: <a href="PATH">ANCHOR_TEXT</a>.
         - Links must be integrated naturally, not forced.
      6. Include standard SEO elements: title, summary, seo_title, and seo_description.
      
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

    // ── AI Üretim Bloğu ──────────────────────────────────────────────────────
    try {
      // Adım 1: Türkçe içerik
      trData = await manager.generateJSON(trPrompt, BLOG_SYSTEM_PROMPT);

      // Adım 2: Arapça çeviri (önce Arapça)
      const arPrompt = `
        You are a professional multilingual translator and SEO strategist. 
        Translate and localize the following Turkish blog post into modern Arabic (Fusha).
        
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
      arData = await manager.generateJSON(arPrompt, BLOG_SYSTEM_PROMPT);

      // Adım 3: İngilizce çeviri (sonra İngilizce)
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
      enData = await manager.generateJSON(enPrompt, BLOG_SYSTEM_PROMPT);

    } catch (generationError) {
      console.warn(
        "[Blog Generator] All LLM providers failed. Loading static backup draft fallback...",
        generationError.message
      );

      const draft = fallbackDrafts[Math.floor(Math.random() * fallbackDrafts.length)];
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);

      trData = {
        slug: `${draft.slug}-${randomSuffix}`,
        title_tr: draft.title_tr,
        summary_tr: draft.summary_tr,
        content_tr: draft.content_tr,
        seo_title_tr: draft.seo_title_tr,
        seo_description_tr: draft.seo_description_tr,
      };
      enData = {
        title_en: draft.title_en,
        summary_en: draft.summary_en,
        content_en: draft.content_en,
        seo_title_en: draft.seo_title_en,
        seo_description_en: draft.seo_description_en,
      };
      arData = {
        title_ar: draft.title_ar,
        summary_ar: draft.summary_ar,
        content_ar: draft.content_ar,
        seo_title_ar: draft.seo_title_ar,
        seo_description_ar: draft.seo_description_ar,
      };
    }

    // 6. Slug oluştur ve benzersizliği garanti et
    const titleTr = trData.title_tr || "Otomatik E-Ticaret Blogu";
    let baseSlug = trData.slug || slugify(titleTr);
    if (!baseSlug) baseSlug = `blog-post-${Math.floor(1000 + Math.random() * 9000)}`;

    let postSlug = baseSlug;
    const existingSlugs = new Set((existingPosts || []).map((p) => p.slug));
    if (existingSlugs.has(postSlug)) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      postSlug = `${baseSlug}-${randomSuffix}`;
      console.log(`[Slug System] Collision resolved: "${baseSlug}" → "${postSlug}"`);
    }

    // 7. Supabase'e kaydet
    const newPost = {
      slug: postSlug,
      published_at: new Date().toISOString(),
      // Türkçe
      title_tr: titleTr,
      summary_tr: trData.summary_tr || "E-ticaret ve dijital büyüme süreçlerine dair ipuçları.",
      content_tr: sanitizeHTMLContent(trData.content_tr),
      seo_title_tr: trData.seo_title_tr || titleTr,
      seo_description_tr: trData.seo_description_tr || trData.summary_tr || "Açıklama bulunmuyor.",
      // İngilizce
      title_en: enData.title_en || titleTr,
      summary_en: enData.summary_en || trData.summary_tr || "E-commerce updates.",
      content_en: sanitizeHTMLContent(enData.content_en),
      seo_title_en: enData.seo_title_en || enData.title_en || titleTr,
      seo_description_en: enData.seo_description_en || enData.summary_en || "No description.",
      // Arapça
      title_ar: arData.title_ar || titleTr,
      summary_ar: arData.summary_ar || trData.summary_tr || "أحدث المقالات حول التجارة الإلكترونية.",
      content_ar: sanitizeHTMLContent(arData.content_ar),
      seo_title_ar: arData.seo_title_ar || arData.title_ar || titleTr,
      seo_description_ar: arData.seo_description_ar || arData.summary_ar || "لا يوجد وصف.",
    };

    let insertedData, insertError;
    ({ data: insertedData, error: insertError } = await supabase
      .from("blog_posts")
      .insert([newPost])
      .select());

    // Slug çakışması için tek deneme yeniden dene
    if (
      insertError &&
      (insertError.code === "23505" ||
        insertError.message?.includes("unique constraint") ||
        insertError.message?.includes("slug"))
    ) {
      console.warn(`[DB Insert Conflict] Duplicate slug "${newPost.slug}". Retrying with unique suffix...`);
      newPost.slug = `${postSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
      ({ data: insertedData, error: insertError } = await supabase
        .from("blog_posts")
        .insert([newPost])
        .select());
    }

    if (insertError) {
      throw new Error(`Database error saving post: ${insertError.message}`);
    }

    return res.status(200).json({
      success: true,
      message: "Blog post generated, translated, linked, and saved successfully.",
      post: insertedData[0],
    });

  } catch (error) {
    console.error("Cron Job Error:", error);

    // E-posta ile hata bildirimi gönder
    try {
      const serviceId = process.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = process.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        console.log("[Alert System] Sending automated failure notification email via EmailJS...");
        await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              from_name: "Automated Blog Bot Alert",
              from_email: "bot@samer.life",
              phone: "N/A",
              website: "https://www.samer.life",
              platform: "Vercel Cron Job (3 Hours)",
              budget: "N/A",
              message: `HATA ALARMI: Otomatik blog yazısı üretme botu hata verdi!\n\nHata Mesajı: ${error.message}\n\nTarih: ${new Date().toLocaleString("tr-TR")}`,
            },
          }),
        });
        console.log("[Alert System] Email notification sent successfully.");
      } else {
        console.warn("[Alert System] EmailJS credentials missing, skipping failure notification.");
      }
    } catch (mailError) {
      console.error("[Alert System] Failed to send error notification email:", mailError.message);
    }

    return res.status(500).json({ success: false, error: error.message });
  } finally {
    await releaseAtomicLock();
  }
};
