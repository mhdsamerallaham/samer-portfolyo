// Localized route mapping for all pages in Turkish, English, and Arabic
export const pageLanguageMap = {
  '/': { tr: '/', en: '/en', ar: '/ar' },
  '/en': { tr: '/', en: '/en', ar: '/ar' },
  '/ar': { tr: '/', en: '/en', ar: '/ar' },

  '/hizmetler': { tr: '/hizmetler', en: '/en/services', ar: '/ar/services' },
  '/en/services': { tr: '/hizmetler', en: '/en/services', ar: '/ar/services' },
  '/ar/services': { tr: '/hizmetler', en: '/en/services', ar: '/ar/services' },

  '/web-tasarim': { tr: '/web-tasarim', en: '/en/web-design', ar: '/ar/web-design' },
  '/en/web-design': { tr: '/web-tasarim', en: '/en/web-design', ar: '/ar/web-design' },
  '/ar/web-design': { tr: '/web-tasarim', en: '/en/web-design', ar: '/ar/web-design' },

  '/e-ticaret-web-tasarim': { tr: '/e-ticaret-web-tasarim', en: '/en/ecommerce-web-design', ar: '/ar/ecommerce-web-design' },
  '/en/ecommerce-web-design': { tr: '/e-ticaret-web-tasarim', en: '/en/ecommerce-web-design', ar: '/ar/ecommerce-web-design' },
  '/ar/ecommerce-web-design': { tr: '/e-ticaret-web-tasarim', en: '/en/ecommerce-web-design', ar: '/ar/ecommerce-web-design' },

  '/eticaret-site-kurulumu': { tr: '/eticaret-site-kurulumu', en: '/en/ecommerce-setup', ar: '/ar/shopify-setup-turkey' },
  '/en/ecommerce-setup': { tr: '/eticaret-site-kurulumu', en: '/en/ecommerce-setup', ar: '/ar/shopify-setup-turkey' },
  '/ar/shopify-setup-turkey': { tr: '/eticaret-site-kurulumu', en: '/en/ecommerce-setup', ar: '/ar/shopify-setup-turkey' },

  '/eticaret-optimizasyon': { tr: '/eticaret-optimizasyon', en: '/en/ecommerce-optimization', ar: '/ar/ecommerce-optimization' },
  '/en/ecommerce-optimization': { tr: '/eticaret-optimizasyon', en: '/en/ecommerce-optimization', ar: '/ar/ecommerce-optimization' },
  '/ar/ecommerce-optimization': { tr: '/eticaret-optimizasyon', en: '/en/ecommerce-optimization', ar: '/ar/ecommerce-optimization' },

  '/urun-gorsel-ve-icerik': { tr: '/urun-gorsel-ve-icerik', en: '/en/product-visuals-content', ar: '/ar/product-content-ai' },
  '/en/product-visuals-content': { tr: '/urun-gorsel-ve-icerik', en: '/en/product-visuals-content', ar: '/ar/product-content-ai' },
  '/ar/product-content-ai': { tr: '/urun-gorsel-ve-icerik', en: '/en/product-visuals-content', ar: '/ar/product-content-ai' },

  '/stok-ve-depo-sistemi': { tr: '/stok-ve-depo-sistemi', en: '/en/inventory-stock-automation', ar: '/ar/stock-inventory-system' },
  '/en/inventory-stock-automation': { tr: '/stok-ve-depo-sistemi', en: '/en/inventory-stock-automation', ar: '/ar/stock-inventory-system' },
  '/ar/stock-inventory-system': { tr: '/stok-ve-depo-sistemi', en: '/en/inventory-stock-automation', ar: '/ar/stock-inventory-system' },

  '/aylik-yonetim': { tr: '/aylik-yonetim', en: '/en/monthly-management', ar: '/ar/monthly-ecommerce-management' },
  '/en/monthly-management': { tr: '/aylik-yonetim', en: '/en/monthly-management', ar: '/ar/monthly-ecommerce-management' },
  '/ar/monthly-ecommerce-management': { tr: '/aylik-yonetim', en: '/en/monthly-management', ar: '/ar/monthly-ecommerce-management' },

  '/basari-hikayeleri': { tr: '/basari-hikayeleri', en: '/en/case-studies', ar: '/ar/case-studies' },
  '/en/case-studies': { tr: '/basari-hikayeleri', en: '/en/case-studies', ar: '/ar/case-studies' },
  '/ar/case-studies': { tr: '/basari-hikayeleri', en: '/en/case-studies', ar: '/ar/case-studies' },

  '/blog': { tr: '/blog', en: '/en/blog', ar: '/ar/blog' },
  '/en/blog': { tr: '/blog', en: '/en/blog', ar: '/ar/blog' },
  '/ar/blog': { tr: '/blog', en: '/en/blog', ar: '/ar/blog' },

  '/hakkimda': { tr: '/hakkimda', en: '/en/about', ar: '/ar/about' },
  '/en/about': { tr: '/hakkimda', en: '/en/about', ar: '/ar/about' },
  '/ar/about': { tr: '/hakkimda', en: '/en/about', ar: '/ar/about' },

  '/iletisim': { tr: '/iletisim', en: '/en/contact', ar: '/ar/contact' },
  '/en/contact': { tr: '/iletisim', en: '/en/contact', ar: '/ar/contact' },
  '/ar/contact': { tr: '/iletisim', en: '/en/contact', ar: '/ar/contact' }
};

/**
 * Returns the localized URL for a target language given any current pathname.
 * If the path is not found in the map, falls back to appending or stripping lang prefix.
 */
export function getLanguageUrl(pathname, targetLang) {
  // Normalize pathname: remove trailing slash if any (except for root '/')
  const cleanPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  
  if (pageLanguageMap[cleanPath]) {
    return pageLanguageMap[cleanPath][targetLang] || '/';
  }
  
  // Handling dynamic blog detail slugs: /blog/:slug, /en/blog/:slug, /ar/blog/:slug
  if (cleanPath.includes('/blog/')) {
    const segments = cleanPath.split('/');
    const blogIndex = segments.indexOf('blog');
    if (blogIndex !== -1 && segments[blogIndex + 1]) {
      const slug = segments[blogIndex + 1];
      const prefix = targetLang === 'tr' ? '' : `/${targetLang}`;
      return `${prefix}/blog/${slug}`;
    }
  }

  // General fallback
  if (targetLang === 'tr') {
    if (cleanPath.startsWith('/en/')) return cleanPath.replace('/en/', '/');
    if (cleanPath.startsWith('/ar/')) return cleanPath.replace('/ar/', '/');
    if (cleanPath === '/en' || cleanPath === '/ar') return '/';
    return cleanPath;
  } else {
    // en or ar
    let basePath = cleanPath;
    if (basePath.startsWith('/en/')) basePath = basePath.replace('/en/', '/');
    else if (basePath.startsWith('/ar/')) basePath = basePath.replace('/ar/', '/');
    else if (basePath === '/en' || basePath === '/ar') basePath = '/';
    
    return basePath === '/' ? `/${targetLang}` : `/${targetLang}${basePath}`;
  }
}

/**
 * Resolves the localized path for standard routes from Turkish key
 */
export function getLocalizedPath(trPath, lang) {
  if (pageLanguageMap[trPath]) {
    return pageLanguageMap[trPath][lang] || trPath;
  }
  return trPath;
}
