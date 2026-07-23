const fs = require('fs');
const path = require('path');

const HOST = 'www.samer.life';
const KEY = 'd94e2b81a7054f1c91823c4a5e6b7c8d';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;

// List of core routes to ping (mirroring prerender.cjs)
const coreRoutes = [
  '',
  'web-tasarim',
  'e-ticaret-web-tasarim',
  'eticaret-site-kurulumu',
  'eticaret-optimizasyon',
  'urun-gorsel-ve-icerik',
  'stok-ve-depo-sistemi',
  'ozel-yazilim-gelistirme',
  'web-sitesi-gelistirme',
  'yapay-zeka-cozumleri',
  'aylik-yonetim',
  'hizmetler',
  'iletisim',
  'hakkimda',
  'basari-hikayeleri',
  'blog',
  
  // English
  'en',
  'en/services',
  'en/web-design',
  'en/ecommerce-web-design',
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
  'ar/web-design',
  'ar/ecommerce-web-design',
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
  'sepete-ekleniyor-ama-satilmiyor-sorunun-kaynagi-ne',
  'e-ticaret-web-tasarim-rehberi-2026',
  'profesyonel-web-tasarim-ve-websitesi-yaptirma-rehberi'
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

async function verifyKeyFile() {
  try {
    const res = await fetch(KEY_LOCATION, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return false;
    const text = (await res.text()).trim();
    return text === KEY;
  } catch {
    return false;
  }
}

async function pingSearchEngines() {
  console.log(`\n[Search Engine Auto-Ping] Initializing pings for ${urls.length} URLs...`);

  // IndexNow API — Bing, Yandex, Seznam ve diğer destekleyen motorları tek seferde bilgilendirir.
  // Not: bing.com/ping endpoint'i 2023'te kalıcı olarak kapatıldı (410 Gone).
  // IndexNow zaten Bing'i de kapsıyor, ayrıca ping gerekmiyor.

  // Önce key dosyasının canlı sitede doğru şekilde erişilebilir olduğunu doğrula.
  // Bu adım, deploy geçiş sürecinde boş yere 403 almayı önler.
  console.log(`[Search Engine Auto-Ping] Verifying key file at ${KEY_LOCATION} ...`);
  const keyOk = await verifyKeyFile();

  if (!keyOk) {
    console.warn(
      `⚠ IndexNow skipped: key file not yet accessible at ${KEY_LOCATION}\n` +
      `  → Bu uyarı yeni bir deploy'un ilk build'inde normaldir.\n` +
      `  → Bir sonraki build'de key doğrulanacak ve IndexNow çalışacak.`
    );
    console.log('[Search Engine Auto-Ping] Completed.\n');
    return;
  }

  console.log(`✓ Key file verified. Proceeding with IndexNow submission...`);

  try {
    const indexNowPayload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls
    };

    console.log(`Submitting ${urls.length} URLs to IndexNow API (Bing, Yandex, Seznam)...`);
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(indexNowPayload)
    });

    if (res.ok) {
      console.log(`✓ IndexNow submission successful — ${urls.length} URLs queued for indexing. (Status: ${res.status})`);
    } else {
      const body = await res.text().catch(() => '');
      console.warn(`⚠ IndexNow API returned non-200 status: ${res.status}`, body.slice(0, 200));
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

