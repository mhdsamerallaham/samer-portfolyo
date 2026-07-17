const fs = require('fs');
const path = require('path');

const HOST = 'www.samer.life';
const KEY = '850b5523ab0e43d1a84f3c051a66bfb1';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;

// List of core routes to ping (mirroring prerender.cjs)
const coreRoutes = [
  '',
  'eticaret-site-kurulumu',
  'eticaret-optimizasyon',
  'urun-gorsel-ve-icerik',
  'stok-ve-depo-sistemi',
  'aylik-yonetim',
  'hizmetler',
  'iletisim',
  'hakkimda',
  'basari-hikayeleri',
  'blog',
  
  // English
  'en',
  'en/services',
  'en/ecommerce-setup',
  'en/ecommerce-optimization',
  'en/product-visuals-content',
  'en/inventory-stock-automation',
  'en/monthly-management',
  'en/case-studies',
  'en/blog',
  'en/about',
  'en/contact',

  // Arabic
  'ar',
  'ar/services',
  'ar/shopify-setup-turkey',
  'ar/ecommerce-optimization',
  'ar/product-content-ai',
  'ar/stock-inventory-system',
  'ar/monthly-ecommerce-management',
  'ar/case-studies',
  'ar/blog',
  'ar/about',
  'ar/contact'
];

const blogSlugs = [
  'eticaret-sitem-var-ama-satis-yok-sorun-nerede',
  'urunlerim-goruntuleniyor-ama-satilmiyor-ne-yapmaliyim',
  'eticarette-ilk-5-saniye-musteri-neden-terk-ediyor',
  'sepete-ekleniyor-ama-satilmiyor-sorunun-kaynagi-ne'
];

// Combine all URLs
const urls = [];
coreRoutes.forEach(r => {
  urls.push(`https://${HOST}${r === '' ? '/' : `/${r}`}`);
});

blogSlugs.forEach(slug => {
  urls.push(`https://${HOST}/blog/${slug}`);
  urls.push(`https://${HOST}/en/blog/${slug}`);
  urls.push(`https://${HOST}/ar/blog/${slug}`);
});

async function pingSearchEngines() {
  console.log(`\n[Search Engine Auto-Ping] Initializing pings for ${urls.length} URLs...`);

  // 1. Ping Bing Sitemap Endpoint
  try {
    const bingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    console.log(`Sending sitemap update notification to Bing...`);
    const res = await fetch(bingUrl);
    if (res.ok) {
      console.log(`✓ Bing sitemap ping successful! (Status: ${res.status})`);
    } else {
      console.warn(`⚠ Bing sitemap ping returned non-200 status: ${res.status}`);
    }
  } catch (err) {
    console.warn(`⚠ Failed to ping Bing sitemap (possibly offline or firewall):`, err.message);
  }

  // 2. IndexNow API Submission (Bing, Yandex, Seznam, etc.)
  try {
    const indexNowPayload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls
    };

    console.log(`Submitting URLs to IndexNow API (Bing, Yandex, Seznam)...`);
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(indexNowPayload)
    });

    if (res.ok) {
      console.log(`✓ IndexNow URL submission successful! (Status: ${res.status})`);
    } else {
      console.warn(`⚠ IndexNow API returned non-200 status: ${res.status}`);
    }
  } catch (err) {
    console.warn(`⚠ Failed to submit to IndexNow API:`, err.message);
  }

  console.log('[Search Engine Auto-Ping] Completed.\n');
}

// Run the pings async and handle rejection to prevent build blockage
pingSearchEngines().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error('Unhandled ping error:', err);
  process.exit(0); // Always exit with 0 to ensure the Vercel build succeeds
});
