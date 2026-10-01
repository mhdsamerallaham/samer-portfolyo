const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/xml; charset=utf-8");

  const domain = "https://www.samer.life";
  const today = new Date().toISOString().split("T")[0];

  // Route language mapping for alternate hreflang tags
  const routeMap = {
    "": { tr: "", en: "en", ar: "ar" },
    "hizmetler": { tr: "hizmetler", en: "en/services", ar: "ar/services" },
    "web-tasarim": { tr: "web-tasarim", en: "en/web-design", ar: "ar/web-design" },
    "istanbul-web-tasarim": { tr: "istanbul-web-tasarim", en: "en/istanbul-web-design", ar: "ar/istanbul-web-design" },
    "fatih-web-tasarim": { tr: "fatih-web-tasarim", en: "en/fatih-web-design", ar: "ar/fatih-web-design" },
    "e-ticaret-web-tasarim": { tr: "e-ticaret-web-tasarim", en: "en/ecommerce-web-design", ar: "ar/ecommerce-web-design" },
    "eticaret-site-kurulumu": { tr: "eticaret-site-kurulumu", en: "en/ecommerce-setup", ar: "ar/shopify-setup-turkey" },
    "eticaret-optimizasyon": { tr: "eticaret-optimizasyon", en: "en/ecommerce-optimization", ar: "ar/ecommerce-optimization" },
    "urun-gorsel-ve-icerik": { tr: "urun-gorsel-ve-icerik", en: "en/product-visuals-content", ar: "ar/product-content-ai" },
    "stok-ve-depo-sistemi": { tr: "stok-ve-depo-sistemi", en: "en/inventory-stock-automation", ar: "ar/stock-inventory-system" },
    "aylik-yonetim": { tr: "aylik-yonetim", en: "en/monthly-management", ar: "ar/monthly-ecommerce-management" },
    "web-sitesi-gelistirme": { tr: "web-sitesi-gelistirme", en: "en/web-development", ar: "ar/web-development" },
    "ozel-yazilim-gelistirme": { tr: "ozel-yazilim-gelistirme", en: "en/custom-software", ar: "ar/custom-software" },
    "yapay-zeka-cozumleri": { tr: "yapay-zeka-cozumleri", en: "en/ai-solutions", ar: "ar/ai-solutions" },
    "hizmetler/geo-yapay-zeka-optimizasyonu": { tr: "hizmetler/geo-yapay-zeka-optimizasyonu", en: "en/services/generative-engine-optimization", ar: "ar/services/generative-engine-optimization" },
    "geo-yapay-zeka-optimizasyonu": { tr: "hizmetler/geo-yapay-zeka-optimizasyonu", en: "en/services/generative-engine-optimization", ar: "ar/services/generative-engine-optimization" },
    "basari-hikayeleri": { tr: "basari-hikayeleri", en: "en/case-studies", ar: "ar/case-studies" },
    "blog": { tr: "blog", en: "en/blog", ar: "ar/blog" },
    "faq": { tr: "faq", en: "en/faq", ar: "ar/faq" },
    "sss": { tr: "sss", en: "en/faq", ar: "ar/faq" },
    "hakkimda": { tr: "hakkimda", en: "en/about", ar: "ar/about" },
    "iletisim": { tr: "iletisim", en: "en/contact", ar: "ar/contact" }
  };

  const staticRoutes = [
    "", "hizmetler", "web-tasarim", "istanbul-web-tasarim", "fatih-web-tasarim",
    "e-ticaret-web-tasarim", "eticaret-site-kurulumu", "eticaret-optimizasyon",
    "urun-gorsel-ve-icerik", "stok-ve-depo-sistemi", "aylik-yonetim",
    "web-sitesi-gelistirme", "ozel-yazilim-gelistirme", "yapay-zeka-cozumleri",
    "hizmetler/geo-yapay-zeka-optimizasyonu", "geo-yapay-zeka-optimizasyonu",
    "basari-hikayeleri", "blog", "faq", "sss", "hakkimda", "iletisim",
    "en", "en/services", "en/web-design", "en/istanbul-web-design", "en/fatih-web-design",
    "en/ecommerce-web-design", "en/ecommerce-setup", "en/ecommerce-optimization",
    "en/product-visuals-content", "en/inventory-stock-automation", "en/monthly-management",
    "en/web-development", "en/custom-software", "en/ai-solutions",
    "en/services/generative-engine-optimization", "en/generative-engine-optimization", "en/case-studies",
    "en/blog", "en/faq", "en/about", "en/contact",
    "ar", "ar/services", "ar/web-design", "ar/istanbul-web-design", "ar/fatih-web-design",
    "ar/ecommerce-web-design", "ar/shopify-setup-turkey", "ar/ecommerce-optimization",
    "ar/product-content-ai", "ar/stock-inventory-system", "ar/monthly-ecommerce-management",
    "ar/web-development", "ar/custom-software", "ar/ai-solutions",
    "ar/services/generative-engine-optimization", "ar/generative-engine-optimization", "ar/case-studies",
    "ar/blog", "ar/faq", "ar/about", "ar/contact"
  ];

  let blogSlugs = [
    "geo-nedir-yapay-zeka-arama-motorlarinda-nasil-one-cikilir",
    "what-is-geo-how-to-rank-in-ai-search-engines",
    "eticaret-sitem-var-ama-satis-yok-sorun-nerede",
    "urunlerim-goruntuleniyor-ama-satilmiyor-ne-yapmaliyim",
    "eticarette-ilk-5-saniye-musteri-neden-terk-ediyor",
    "sepete-ekleniyor-ama-satilmiyor-sorunun-kaynagi-ne",
    "e-ticaret-web-tasarim-rehberi-2026",
    "profesyonel-web-tasarim-ve-websitesi-yaptirma-rehberi"
  ];

  let faqSlugs = [
    "shopify-donusum-orani-nasil-artirilir",
    "ikas-mi-shopify-mi-seo-icin-hangisi-daha-iyi",
    "urun-detay-sayfasi-ux-ve-otomasyon-rehberi",
    "eticarette-yapay-zeka-chatbot-entegrasyonu-nasil-yapilir"
  ];

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: posts } = await supabase.from("blog_posts").select("slug");
      if (posts && posts.length > 0) {
        blogSlugs = posts.map(p => p.slug).filter(Boolean);
      }
      const { data: faqs } = await supabase.from("faq_posts").select("slug");
      if (faqs && faqs.length > 0) {
        faqSlugs = faqs.map(f => f.slug).filter(Boolean);
      }
    } catch (e) {
      console.warn("Supabase fetch error for sitemap:", e.message);
    }
  }

  const sitemapUrls = [];

  // Helper to build URL with xhtml:link hreflang tags
  const buildUrlXml = (loc, trPath, enPath, arPath, priority = "0.7", changefreq = "monthly") => {
    const trUrl = trPath === "" ? domain : `${domain}/${trPath}`;
    const enUrl = enPath === "" ? domain : `${domain}/${enPath}`;
    const arUrl = arPath === "" ? domain : `${domain}/${arPath}`;

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="tr" href="${trUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${trUrl}" />
  </url>`;
  };

  // 1. Add static routes with hreflang tags
  staticRoutes.forEach(route => {
    const loc = route === "" ? domain : `${domain}/${route}`;
    const priority = route === "" ? "1.0" : "0.85";
    let lookupKey = route;
    if (lookupKey.startsWith("en/")) lookupKey = lookupKey.replace("en/", "");
    else if (lookupKey.startsWith("ar/")) lookupKey = lookupKey.replace("ar/", "");
    else if (lookupKey === "en" || lookupKey === "ar") lookupKey = "";

    const mapping = routeMap[lookupKey] || { tr: route, en: `en/${route}`, ar: `ar/${route}` };
    sitemapUrls.push(buildUrlXml(loc, mapping.tr, mapping.en, mapping.ar, priority, "weekly"));
  });

  // 2. Add blog routes in TR, EN, AR with hreflang tags
  const processedBlogKeys = new Set();
  blogSlugs.forEach(slug => {
    let trPath = `blog/${slug}`;
    let enPath = `en/blog/${slug}`;
    let arPath = `ar/blog/${slug}`;

    if (slug === "geo-nedir-yapay-zeka-arama-motorlarinda-nasil-one-cikilir" || slug === "what-is-geo-how-to-rank-in-ai-search-engines") {
      if (processedBlogKeys.has("geo-blog")) return;
      processedBlogKeys.add("geo-blog");
      trPath = "blog/geo-nedir-yapay-zeka-arama-motorlarinda-nasil-one-cikilir";
      enPath = "en/blog/what-is-geo-how-to-rank-in-ai-search-engines";
      arPath = "ar/blog/what-is-geo-how-to-rank-in-ai-search-engines";
    }

    [trPath, enPath, arPath].forEach(path => {
      const loc = `${domain}/${path}`;
      sitemapUrls.push(buildUrlXml(loc, trPath, enPath, arPath, "0.7", "monthly"));
    });
  });

  // 3. Add FAQ routes in TR, EN, AR with hreflang tags
  faqSlugs.forEach(slug => {
    const trPath = `faq/${slug}`;
    const enPath = `en/faq/${slug}`;
    const arPath = `ar/faq/${slug}`;

    [`faq/${slug}`, `sss/${slug}`, `en/faq/${slug}`, `ar/faq/${slug}`].forEach(path => {
      const loc = `${domain}/${path}`;
      sitemapUrls.push(buildUrlXml(loc, trPath, enPath, arPath, "0.7", "monthly"));
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls.join("\n")}
</urlset>`;

  return res.status(200).send(xml);
};
