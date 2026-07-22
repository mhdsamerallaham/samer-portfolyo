import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { getLanguageUrl } from '../utils/navigation';

// ─────────────────────────────────────────────────
// Per-route SEO configuration map
// ─────────────────────────────────────────────────
const routeSEOMap = {
  '/': {
    title: 'samer | e-ticaret & web tasarım & yazılım',
    description:
      'Shopify ve İKAS ile profesyonel e-ticaret sitesi kuruyorum. Dönüşüm odaklı optimizasyon, stok otomasyonu ve ürün içerik servisleri. Türkiye\'nin e-ticaret büyüme uzmanı Samer Allaham.',
    keywords:
      'shopify kurulumu türkiye, ikas e-ticaret sitesi, e-ticaret sitesi kurulumu, e-ticaret optimizasyon, shopify danışmanlık, samer allaham',
  },
  '/hizmetler': {
    title: 'E-Ticaret Hizmetleri',
    description:
      'Shopify kurulumu, İKAS e-ticaret sitesi, dönüşüm optimizasyonu, ürün görseli hazırlama ve stok otomasyon hizmetleri. Samer Allaham ile e-ticarette büyüyün.',
    keywords:
      'shopify hizmetleri, ikas kurulum, e-ticaret optimizasyon hizmetleri, stok entegrasyon, ürün içerik servisi',
  },
  '/eticaret-site-kurulumu': {
    title: 'E-Ticaret Site Kurulumu İstanbul | Shopify & İKAS Uzmanı — Samer',
    description:
      'İstanbul\'da profesyonel e-ticaret sitesi kurulumu. Shopify, İKAS ve WooCommerce ile 3-7 günde yayına al. Fiyat için iletişime geç.',
    keywords:
      'shopify kurulumu istanbul, ikas e-ticaret kurulumu, e-ticaret sitesi kurma, shopify tasarım, ikas uzmanı',
  },
  '/eticaret-optimizasyon': {
    title: 'E-Ticaret Optimizasyon | Dönüşüm ve Satış Artışı — Samer',
    description:
      'E-ticaret mağazanızın dönüşüm oranını artırın. A/B test, hız optimizasyonu ve UX iyileştirmeleriyle satışlarınızı büyütün.',
    keywords:
      'e-ticaret optimizasyon, dönüşüm oranı artırma, shopify hız optimizasyon, core web vitals, e-ticaret seo',
  },
  '/urun-gorsel-ve-icerik': {
    title: 'Ürün Görseli ve İçerik Üretimi | E-Ticaret — Samer',
    description:
      'Profesyonel ürün fotoğrafı ve SEO uyumlu içerik üretimi. E-ticaret mağazanız için dönüştüren görseller ve açıklamalar.',
    keywords:
      'ürün fotoğrafı düzenleme, yapay zeka ürün görseli, ürün açıklaması yazma, e-ticaret içerik, seo ürün açıklaması',
  },
  '/stok-ve-depo-sistemi': {
    title: 'Stok ve Depo Yönetim Sistemi | Otomasyon — Samer',
    description:
      'Stok takibi ve depo yönetimini otomatikleştirin. Özel yazılım çözümleriyle manuel hatalardan kurtulun.',
    keywords:
      'stok yönetim sistemi, shopify ikas entegrasyon, trendyol stok senkronizasyon, depo otomasyon, erp entegrasyon',
  },
  '/ozel-yazilim-gelistirme': {
    title: 'Özel Yazılım Geliştirme İstanbul | Full-Stack — Samer',
    description:
      'React, Next.js ve Node.js ile özel web uygulamaları. İstanbul merkezli freelance full-stack geliştirici.',
    keywords:
      'özel yazılım geliştirme istanbul, full stack geliştirici istanbul, react next.js freelance, api geliştirme',
  },
  '/aylik-yonetim': {
    title: 'Aylık E-Ticaret Yönetimi',
    description:
      'E-ticaret sitenizin aylık yönetimi: ürün güncellemeleri, kampanya yönetimi, teknik bakım ve SEO raporlamaları.',
    keywords:
      'aylık e-ticaret yönetimi, shopify bakım, ikas yönetim, e-ticaret danışmanlık aylık',
  },
  '/basari-hikayeleri': {
    title: 'Başarı Hikayeleri & Müşteri Vaka Analizleri',
    description:
      'Gerçek müşteri başarı hikayeleri: AIO Coffee %35 CR artışı, moda butiği hız skoru 45\'ten 98\'e. E-ticaret dönüşüm başarı örnekleri.',
    keywords:
      'e-ticaret başarı hikayesi, shopify case study, dönüşüm oranı artırma örnek, e-ticaret referans',
  },
  '/blog': {
    title: 'E-Ticaret Blog & Rehberler',
    description:
      'E-ticaret, Shopify, İKAS, dönüşüm optimizasyonu ve satış artırma üzerine pratik rehberler. Samer Allaham\'ın e-ticaret blogu.',
    keywords:
      'e-ticaret blog, shopify rehber, ikas rehber, e-ticaret satış artırma, sepet terk, dönüşüm oranı',
  },
  '/hakkimda': {
    title: 'Hakkımda — Samer Allaham',
    description:
      'Türkiye merkezli e-ticaret büyüme uzmanı Samer Allaham hakkında. Shopify ve İKAS konusunda uzman yazılım geliştirici.',
    keywords:
      'samer allaham kim, e-ticaret uzmanı türkiye, shopify geliştirici türkiye, ikas uzmanı',
  },
  '/iletisim': {
    title: 'İletişim — Ücretsiz E-Ticaret Analizi',
    description:
      'Shopify veya İKAS e-ticaret projeniz için ücretsiz analiz alın. WhatsApp veya form üzerinden Samer Allaham ile iletişime geçin.',
    keywords:
      'e-ticaret danışmanlık iletişim, shopify kurulum fiyat, ikas e-ticaret teklif, ücretsiz analiz',
  },
};

// ─────────────────────────────────────────────────
// Service page FAQ schema data
// ─────────────────────────────────────────────────
const serviceFAQs = {
  '/eticaret-site-kurulumu': [
    {
      q: 'Shopify mi İKAS mı daha iyi?',
      a: 'Türkiye pazarında satış yapacak ve yerel ödeme/kargo sistemlerini kullanacak işletmeler için İKAS düşük komisyon ve hızlı yerel altyapısıyla daha avantajlıdır. Global pazarda satış hedefleyen markalar için ise geniş eklenti ve çoklu para birimi desteğiyle Shopify öne çıkar.',
    },
    {
      q: 'E-ticaret sitesi kurulumu ne kadar sürer?',
      a: 'Profesyonel bir e-ticaret sitesi kurulumu projenin kapsamına, tasarım taleplerine ve entegrasyonlara göre genellikle 3–7 iş günü içinde tamamlanarak anahtar teslim yayına alınır.',
    },
    {
      q: 'En ucuz e-ticaret sitesi hangi platformda kurulur?',
      a: 'Başlangıç maliyeti açısından WooCommerce en esnek seçeneği sunarken, ek sunucu ve bakım masrafları olmaksızın en hızlı ve maliyet-etkin kurulum İKAS ve Shopify paketleriyle sağlanmaktadır.',
    },
    {
      q: 'Site kurulumu sonrası bakım desteği veriyor musunuz?',
      a: 'Evet, site kurulumu sonrasında 30 gün boyunca ücretsiz teknik destek veriyoruz. İsteğe bağlı olarak aylık teknik bakım ve yönetim hizmeti sunuyoruz.',
    },
    {
      q: 'Türkiye\'de en çok hangi ödeme sistemi kullanılır?',
      a: 'Türkiye e-ticaret pazarında en yaygın kullanılan yerel sanal POS ve ödeme altyapıları PayTR ve iyzico\'dur. Tüm kurulum paketlerimize bu ödeme geçitlerinin entegrasyonu dahildir.',
    },
  ],
  '/eticaret-optimizasyon': [
    {
      q: 'E-ticaret dönüşüm oranı (CR) nedir ve nasıl artırılır?',
      a: 'Dönüşüm oranı, sitenizi ziyaret eden kişilerin kaçının satın alma işlemi gerçekleştirdiğini gösteren yüzdeliktir. Hız optimizasyonu, kullanıcı deneyimi iyileştirmeleri ve şeffaf fiyatlandırma ile artırılır.',
    },
    {
      q: 'Sayfa hızı optimizasyonu neden önemlidir?',
      a: 'Sayfa 3 saniyeden geç açılırsa ziyaretçilerin %53\'ü siteyi terk eder. Hız optimizasyonu hem satışları artırır hem de Google sıralamasını yükseltir.',
    },
    {
      q: 'Core Web Vitals nedir?',
      a: 'Google\'ın kullanıcı deneyimini ölçmek için kullandığı temel web metrikleridir: Largest Contentful Paint (LCP), Interaction to Next Paint (INP) ve Cumulative Layout Shift (CLS). Bu skoru 90\'ın üzerine çıkarmak SEO avantajı sağlar.',
    },
    {
      q: 'Optimizasyon süreci ne kadar sürer?',
      a: 'Temel optimizasyon çalışmaları genellikle 5–10 iş günü içinde tamamlanır. Kapsamlı SEO ve UX iyileştirmeleri 2–4 hafta sürebilir.',
    },
    {
      q: 'Sepet terki (cart abandonment) nasıl azaltılır?',
      a: 'Şeffaf kargo ücretleri, misafir ödeme seçeneği (guest checkout), tek sayfalık ödeme akışı ve terk edilmiş sepet e-posta otomasyonları ile sepet terki oranı ortalama %30–40 azaltılabilir.',
    },
  ],
  '/urun-gorsel-ve-icerik': [
    {
      q: 'Yapay zeka ile ürün fotoğrafı nasıl hazırlanır?',
      a: 'Ürünün farklı açılardan çekilen ham fotoğrafları yapay zeka ile işlenerek stüdyo kalitesinde arka planlar oluşturulur, ışık ve gölge düzenlenir. Sonuç: profesyonel stüdyo çekimi kalitesinde görsel.',
    },
    {
      q: 'SEO uyumlu ürün açıklaması neden önemlidir?',
      a: 'SEO uyumlu ürün açıklamaları Google\'da üst sıralarda yer almanızı sağlar. Aynı zamanda ChatGPT ve Gemini gibi AI asistanları ürünü tanıyarak kullanıcılara önerebilir.',
    },
    {
      q: 'Ürün başına ücret nedir?',
      a: 'Ürün görseli ve içerik servisi ürün başına 50 – 150 TL arasında değişmektedir. Toplu siparişlerde indirimli paketler mevcuttur.',
    },
    {
      q: 'Google Merchant Center için ürün beslemesi hazırlıyor musunuz?',
      a: 'Evet, Google Shopping reklamlarınız için optimize edilmiş ürün beslemeleri (feed) hazırlayarak Merchant Center\'a entegre ediyoruz.',
    },
    {
      q: 'Kaç adet ürünü aynı anda işleyebilirsiniz?',
      a: 'Otomasyon sistemlerimiz sayesinde günde 100–500 ürüne kadar toplu işlem yapılabilmektedir.',
    },
  ],
  '/stok-ve-depo-sistemi': [
    {
      q: 'Shopify ve İKAS stok senkronizasyonu nasıl çalışır?',
      a: 'API entegrasyonları ile Shopify, İKAS, Trendyol ve Hepsiburada gibi platformlar arasında anlık (real-time) stok eşitlemesi sağlanır. Bir kanaldan satış yapıldığında diğer tüm kanallar otomatik güncellenir.',
    },
    {
      q: 'ERP sistemimle entegrasyon mümkün mü?',
      a: 'Evet, Paraşüt, Logo ve benzeri ERP sistemleriyle entegrasyon sağlanabilmektedir. Excel tabanlı stok takip sistemleriyle de bağlantı kurulabilir.',
    },
    {
      q: 'Stok otomasyon sistemi kurulum süresi nedir?',
      a: 'Entegrasyon kapsamına göre 2–6 hafta arasında değişmektedir. Basit 2-kanal entegrasyonlar 2 haftada, çok kanallı karmaşık sistemler 4–6 haftada tamamlanır.',
    },
    {
      q: 'Trendyol ve Hepsiburada entegrasyonu yapıyor musunuz?',
      a: 'Evet, Trendyol, Hepsiburada, Çiçeksepeti ve diğer Türk pazaryerleri için API entegrasyonu hizmeti sunuyoruz.',
    },
    {
      q: 'Sistem çöktüğünde veya hata olduğunda ne yapılır?',
      a: 'Tüm sistemlere hata izleme (monitoring) ve otomatik uyarı mekanizmaları kurulmaktadır. Kritik hatalarda anlık bildirim gönderilir ve müdahale edilir.',
    },
  ],
  '/ozel-yazilim-gelistirme': [
    {
      q: 'React ve Next.js ile özel yazılım geliştirme ne kadar sürer?',
      a: 'Özel web uygulaması ve yazılım projeleri kapsamına göre 2–8 hafta arasında geliştirilerek test ortamında ve canlı sunucuda yayına alınır.',
    },
    {
      q: 'Mobil uygulama entegrasyonu ve API geliştiriyor musunuz?',
      a: 'Evet, Node.js ve REST/GraphQL API mimarileri ile yüksek performanslı, güvenli backend servisleri ve mobil entegrasyonlar geliştiriyoruz.',
    },
    {
      q: 'Proje sonrası kaynak kodları ve mülkiyet teslim ediliyor mu?',
      a: 'Evet, tüm kaynak kodları (source code) ve fikri mülkiyet hakları tam teslimat kapsamında müşteriye aktarılır.',
    },
    {
      q: 'Freelance yazılım geliştirici ile çalışmanın avantajı nedir?',
      a: 'Ajans bürokrasisi olmaksızın doğrudan geliştirici ile birebir iletişim, daha hızlı karar alma ve esnek maliyet avantajı sağlarsınız.',
    },
    {
      q: 'Var olan mevcut projeler için bakım ve geliştirme yapıyor musunuz?',
      a: 'Evet, mevcut React, Next.js, Node.js veya Vue codebase projelerinizde performans iyileştirmesi, hata giderimi ve yeni modül ekleme hizmeti sunuyoruz.',
    },
  ],
  '/aylik-yonetim': [
    {
      q: 'Aylık e-ticaret yönetimi hizmeti neyi kapsar?',
      a: 'Ürün güncellemeleri, kampanya yönetimi, teknik bakım, güvenlik güncellemeleri, yedekleme ve aylık SEO & dönüşüm oranı raporlaması kapsamdadır.',
    },
    {
      q: 'Aylık yönetim paketi kaç ürün güncellemesi içeriyor?',
      a: 'Pakete göre değişmekle birlikte, temel pakette aylık 50–100 ürün güncellemesi, premium pakette sınırsız güncelleme sunulmaktadır.',
    },
    {
      q: 'Aylık yönetim için sözleşme şartları nedir?',
      a: 'Minimum 3 aylık taahhüt ile başlanmaktadır. Sonrasında aylık olarak devam edilebilir veya sonlandırılabilir.',
    },
    {
      q: 'Aylık raporlama içeriğinde neler var?',
      a: 'Ziyaretçi istatistikleri, dönüşüm oranı, en çok satan ürünler, anahtar kelime performansı ve önerilen iyileştirmeler aylık raporda yer alır.',
    },
    {
      q: 'Kampanya ve indirim kuponlarını siz mi oluşturuyorsunuz?',
      a: 'Evet, sezonsal kampanyalar, indirim kuponları ve fiyat güncellemeleri aylık yönetim paketi kapsamında sizin onayınızla uygulanmaktadır.',
    },
  ],
};

// ─────────────────────────────────────────────────
// Service page Service schema data
// ─────────────────────────────────────────────────
const serviceSchemas = {
  '/eticaret-site-kurulumu': {
    name: 'E-Ticaret Web Sitesi Kurulumu İstanbul',
    description: 'İstanbul\'da Shopify veya İKAS üzerinde profesyonel e-ticaret sitesi kurulumu. Tema tasarımı, ödeme ve kargo entegrasyonu dahil.',
    offers: { price: '20000', priceCurrency: 'TRY', priceSpecification: '20.000 – 60.000 TL' },
  },
  '/eticaret-optimizasyon': {
    name: 'E-Ticaret Hız & Dönüşüm Optimizasyonu',
    description: 'Sayfa hızı, Core Web Vitals ve dönüşüm oranı optimizasyonu. SEO iyileştirmeleri ve A/B test analizi.',
    offers: { price: '10000', priceCurrency: 'TRY', priceSpecification: '10.000 – 20.000 TL' },
  },
  '/urun-gorsel-ve-icerik': {
    name: 'Ürün Görseli ve İçerik Üretimi',
    description: 'Profesyonel ürün fotoğrafı ve SEO uyumlu içerik üretimi. E-ticaret mağazanız için dönüştüren görseller ve açıklamalar.',
    offers: { price: '50', priceCurrency: 'TRY', priceSpecification: 'Ürün başına 50 – 150 TL' },
  },
  '/stok-ve-depo-sistemi': {
    name: 'Stok ve Depo Yönetim Sistemi',
    description: 'Stok takibi ve depo yönetimini otomatikleştirin. Özel yazılım çözümleriyle manuel hatalardan kurtulun.',
    offers: { price: '25000', priceCurrency: 'TRY', priceSpecification: '25.000 – 50.000 TL' },
  },
  '/ozel-yazilim-gelistirme': {
    name: 'Özel Yazılım Geliştirme İstanbul',
    description: 'React, Next.js ve Node.js ile özel web uygulamaları. İstanbul merkezli freelance full-stack geliştirici.',
    offers: { price: '30000', priceCurrency: 'TRY', priceSpecification: '30.000 – 80.000 TL' },
  },
  '/aylik-yonetim': {
    name: 'Aylık E-Ticaret Yönetimi',
    description: 'Aylık ürün güncellemeleri, kampanya yönetimi, teknik bakım ve SEO raporlaması.',
    offers: { price: '8000', priceCurrency: 'TRY', priceSpecification: '8.000 – 20.000 TL/ay' },
  },
};

// ─────────────────────────────────────────────────
// Person + ProfessionalService Schema
// ─────────────────────────────────────────────────
const personProfessionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': ['Person', 'ProfessionalService'],
  name: 'Samer',
  url: 'https://www.samer.life',
  jobTitle: 'Full-Stack Web Developer & E-Ticaret Uzmanı',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'İstanbul',
    addressCountry: 'TR',
  },
  sameAs: ['https://github.com/mhdsamerallaham'],
  knowsLanguage: ['tr', 'ar', 'en'],
  areaServed: ['TR', 'SY', 'EG'],
};

// ─────────────────────────────────────────────────
// Build FAQ JSON-LD
// ─────────────────────────────────────────────────
function buildFAQSchema(faqs) {
  if (!faqs || !faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };
}

// ─────────────────────────────────────────────────
// Build Service JSON-LD
// ─────────────────────────────────────────────────
function buildServiceSchema(svc, url) {
  if (!svc) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `https://www.samer.life${url}#service`,
    name: svc.name,
    description: svc.description,
    provider: { '@type': 'Person', name: 'Samer' },
    areaServed: 'İstanbul, Türkiye',
    url: `https://www.samer.life${url}`,
  };
}

// ─────────────────────────────────────────────────
// Build Article JSON-LD (blog posts)
// ─────────────────────────────────────────────────
function buildArticleSchema({ title, description, slug, date }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `https://www.samer.life/blog/${slug}#article`,
    headline: title,
    description: description,
    url: `https://www.samer.life/blog/${slug}`,
    datePublished: date || '2026-07-10',
    dateModified: date || '2026-07-10',
    author: {
      '@type': 'Person',
      '@id': 'https://www.samer.life/#person',
      name: 'Samer Allaham',
      url: 'https://www.samer.life/hakkimda',
    },
    publisher: {
      '@type': 'Person',
      name: 'Samer Allaham',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.samer.life/avatar.jpeg',
      },
    },
    image: 'https://www.samer.life/avatar.jpeg',
    inLanguage: 'tr',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.samer.life/blog/${slug}`,
    },
  };
}

// ─────────────────────────────────────────────────
// Build BreadcrumbList JSON-LD
// ─────────────────────────────────────────────────
function buildBreadcrumbSchema(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://www.samer.life/' },
  ];

  const labelMap = {
    hizmetler: 'E-Ticaret Hizmetleri',
    'eticaret-site-kurulumu': 'E-Ticaret Sitesi Kurulumu',
    'eticaret-optimizasyon': 'E-Ticaret Optimizasyon',
    'urun-gorsel-ve-icerik': 'Ürün Görsel ve İçerik',
    'stok-ve-depo-sistemi': 'Stok ve Depo Sistemi',
    'ozel-yazilim-gelistirme': 'Özel Yazılım Geliştirme',
    'aylik-yonetim': 'Aylık Yönetim',
    'basari-hikayeleri': 'Başarı Hikayeleri',
    blog: 'Blog',
    hakkimda: 'Hakkımda',
    iletisim: 'İletişim',
  };

  segments.forEach((seg, i) => {
    items.push({
      '@type': 'ListItem',
      position: i + 2,
      name: labelMap[seg] || seg,
      item: `https://www.samer.life/${segments.slice(0, i + 1).join('/')}`,
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

// ─────────────────────────────────────────────────
// MAIN SEO COMPONENT
// ─────────────────────────────────────────────────
export default function SEO({
  title,
  description,
  keywords = '',
  schema = null,
  article = null,
  faqItems = null,
}) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const lang = i18n.language || 'tr';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const pathname = location.pathname;

  // Resolve final SEO values: prop-level overrides route map which overrides fallback
  const routeData = routeSEOMap[pathname] || {};
  const finalTitle = title || routeData.title || 'E-Ticaret Uzmanı';
  const finalDesc = description || routeData.description || '';
  const finalKeywords = keywords || routeData.keywords || '';

  // Canonical URL always points strictly to pathname (stripping query parameters)
  const canonicalUrl = `https://www.samer.life${pathname}`;
  const pageTitle = `${finalTitle} | Samer`;

  // Alternate Multilingual URLs (hreflang)
  const trUrl = `https://www.samer.life${getLanguageUrl(pathname, 'tr')}`;
  const enUrl = `https://www.samer.life${getLanguageUrl(pathname, 'en')}`;
  const arUrl = `https://www.samer.life${getLanguageUrl(pathname, 'ar')}`;

  // Collect all schemas for this page
  const schemas = [];

  // 1. Global Person + ProfessionalService Schema
  schemas.push(personProfessionalServiceSchema);

  // 2. FAQ schema for service pages
  const faqs = faqItems || serviceFAQs[pathname];
  if (faqs) schemas.push(buildFAQSchema(faqs));

  // 3. Service schema for service pages
  const svc = serviceSchemas[pathname];
  if (svc) schemas.push(buildServiceSchema(svc, pathname));

  // 4. Article schema for blog posts
  if (article) schemas.push(buildArticleSchema(article));

  // 5. Breadcrumb for all pages
  if (pathname !== '/') schemas.push(buildBreadcrumbSchema(pathname));

  // 6. Custom schema override/addition
  if (schema) schemas.push(schema);

  return (
    <Helmet>
      {/* Language & direction */}
      <html lang={lang} dir={dir} />

      {/* Titles & Meta */}
      <title>{pageTitle}</title>
      <meta name="description" content={finalDesc} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}
      <meta name="author" content="Samer Allaham" />

      {/* Canonical Link (Parametresiz Temiz URL) */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Alternate Language Links (hreflang) */}
      <link rel="alternate" hreflang="tr" href={trUrl} />
      <link rel="alternate" hreflang="en" href={enUrl} />
      <link rel="alternate" hreflang="ar" href={arUrl} />
      <link rel="alternate" hreflang="x-default" href={trUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:site_name" content="Samer | E-Ticaret & Web Geliştirme Uzmanı" />
      <meta property="og:locale" content={lang === 'tr' ? 'tr_TR' : lang === 'ar' ? 'ar_SA' : 'en_US'} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content="https://www.samer.life/avatar.jpeg" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content="https://www.samer.life/avatar.jpeg" />

      {/* JSON-LD schemas */}
      {schemas.map((s, i) =>
        s ? (
          <script key={i} type="application/ld+json">
            {JSON.stringify(s)}
          </script>
        ) : null
      )}
    </Helmet>
  );
}
