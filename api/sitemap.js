const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/xml; charset=utf-8");

  const domain = "https://www.samer.life";
  const today = new Date().toISOString().split("T")[0];

  // Static routes map
  const staticRoutes = [
    "",
    "hizmetler",
    "web-tasarim",
    "e-ticaret-web-tasarim",
    "eticaret-site-kurulumu",
    "eticaret-optimizasyon",
    "urun-gorsel-ve-icerik",
    "stok-ve-depo-sistemi",
    "aylik-yonetim",
    "web-sitesi-gelistirme",
    "ozel-yazilim-gelistirme",
    "yapay-zeka-cozumleri",
    "basari-hikayeleri",
    "blog",
    "faq",
    "sss",
    "hakkimda",
    "iletisim",
    "en",
    "en/services",
    "en/web-design",
    "en/ecommerce-web-design",
    "en/ecommerce-setup",
    "en/ecommerce-optimization",
    "en/product-visuals-content",
    "en/inventory-stock-automation",
    "en/monthly-management",
    "en/web-development",
    "en/custom-software",
    "en/ai-solutions",
    "en/case-studies",
    "en/blog",
    "en/faq",
    "en/about",
    "en/contact",
    "ar",
    "ar/services",
    "ar/web-design",
    "ar/ecommerce-web-design",
    "ar/shopify-setup-turkey",
    "ar/ecommerce-optimization",
    "ar/product-content-ai",
    "ar/stock-inventory-system",
    "ar/monthly-ecommerce-management",
    "ar/web-development",
    "ar/custom-software",
    "ar/ai-solutions",
    "ar/case-studies",
    "ar/blog",
    "ar/faq",
    "ar/about",
    "ar/contact"
  ];

  let blogSlugs = [
    "eticaret-sitem-var-ama-satis-yok-sorun-nerede",
    "urunlerim-goruntuleniyor-ama-satilmiyor-ne-yapmaliyim",
    "eticarette-ilk-5-saniye-musteri-neden-terk-ediyor",
    "sepete-ekleniyor-ama-satilmiyor-sorunun-kaynagi-ne",
    "e-ticaret-web-tasarim-rehberi-2026",
    "profesyonel-web-tasarim-ve-websitesi-yaptirma-rehberi"
  ];

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: posts } = await supabase.from("blog_posts").select("slug");
      if (posts && posts.length > 0) {
        blogSlugs = posts.map(p => p.slug).filter(Boolean);
      }
    } catch (e) {
      console.warn("Supabase fetch error for sitemap:", e.message);
    }
  }

  const sitemapUrls = [];

  // 1. Add static routes
  staticRoutes.forEach(route => {
    const loc = route === "" ? domain : `${domain}/${route}`;
    const priority = route === "" ? "1.0" : "0.85";
    sitemapUrls.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`);
  });

  // 2. Add blog routes in TR, EN, AR
  blogSlugs.forEach(slug => {
    ["blog", "en/blog", "ar/blog"].forEach(prefix => {
      const loc = `${domain}/${prefix}/${slug}`;
      sitemapUrls.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls.join("\n")}
</urlset>`;

  return res.status(200).send(xml);
};
