import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { getLanguageUrl } from '../utils/navigation';

// ─────────────────────────────────────────────────
// Per-route SEO configuration map
// ─────────────────────────────────────────────────
const routeSEOMap = {
  // ── TURKISH ROUTES ──────────────────────────────────
  '/': {
    title: 'Shopify & İKAS E-Ticaret Uzmanı | Web Tasarım & Online Mağaza Kurulumu — Samer',
    description:
      'Shopify ve İKAS ile profesyonel e-ticaret web sitesi kurulumu, dönüşüm optimizasyonu ve online mağaza yönetimi. İstanbul merkezli, Türkiye geneline hizmet. Ücretsiz analiz için iletişime geçin.',
    keywords:
      'e ticaret web tasarım, shopify site kurulumu, ikas e-ticaret sitesi, web tasarım istanbul, e-ticaret sitesi kurulumu, shopify kurulumu türkiye, ikas uzmanı, profesyonel web tasarım, online mağaza kurulumu',
  },
  '/hizmetler': {
    title: 'Web Tasarım & E-Ticaret Websitesi Hizmetleri',
    description:
      'Profesyonel web tasarım, e-ticaret websitesi kurulumu, dönüşüm optimizasyonu ve stok otomasyon hizmetleri. Shopify & İKAS uzmanı Samer Allaham.',
    keywords:
      'web tasarım hizmetleri, e ticaret web tasarım, websitesi kurulumu, shopify hizmetleri, ikas kurulum, e-ticaret optimizasyon',
  },
  '/web-tasarim': {
    title: 'Web Tasarım & Kurumsal Web Sitesi Yaptırma | Samer Allaham',
    description:
      'Profesyonel web tasarım ve modern web sitesi geliştirme hizmetleri. React & Next.js ile hızlı, SEO uyumlu, mobil odaklı kurumsal web sitesi tasarımı.',
    keywords:
      'web tasarım, web tasarım istanbul, profesyonel web tasarım, web sitesi yaptırma, kurumsal web tasarım, modern web tasarım, fatih web tasarım',
  },
  '/istanbul-web-tasarim': {
    title: 'İstanbul Web Tasarım Ajansı & Uzmanı | Samer Allaham',
    description:
      'İstanbul profesyonel web tasarım ve e-ticaret çözümleri. Hızlı, mobil uyumlu ve SEO odaklı özel web sitesi tasarımı ve geliştirme hizmeti.',
    keywords:
      'istanbul web tasarım, istanbul web tasarım ajansı, istanbul web sitesi yapan şirketler, profesyonel web tasarım istanbul, freelance web tasarımcı istanbul',
  },
  '/fatih-web-tasarim': {
    title: 'Fatih Web Tasarım & E-Ticaret Kurulumu | Samer Allaham',
    description:
      'İstanbul Fatih bölgesinde profesyonel web tasarım, e-ticaret ve yazılım çözümleri. İşletmenizi dijitale taşıyan modern web sitesi projeleri.',
    keywords:
      'fatih web tasarım, fatih web tasarım ajansı, istanbul fatih web tasarımcı, fatih e-ticaret kurulumu, fatih web sitesi yapanlar',
  },
  '/e-ticaret-web-tasarim': {
    title: 'E-Ticaret Web Tasarım | Profesyonel Online Mağaza Kurulumu — Samer',
    description:
      'E-ticaret web tasarım hizmetleri. Shopify & İKAS ile satış yapan, mobil uyumlu ve SEO dostu online mağaza websitesi tasarımı. Samer Allaham.',
    keywords:
      'e ticaret web tasarım, e-ticaret web tasarım, online mağaza tasarımı, e-ticaret websitesi, shopify web tasarım, ikas web tasarım',
  },
  '/web-sitesi-gelistirme': {
    title: 'Web Sitesi Geliştirme | React & Next.js — Samer',
    description:
      'React ve Next.js ile modern, hızlı ve SEO uyumlu kurumsal web sitesi geliştirme. Portfolyo, tanıtım ve e-ticaret websitesi tasarımı.',
    keywords:
      'web sitesi geliştirme, react web sitesi, next.js web sitesi, kurumsal websitesi, web tasarım',
  },
  '/yapay-zeka-cozumleri': {
    title: 'Yapay Zeka Çözümleri | AI Destekli E-Ticaret — Samer',
    description:
      'E-ticaret mağazanız için yapay zeka destekli ürün görseli, otomatik içerik üretimi ve akıllı chatbot çözümleri.',
    keywords:
      'yapay zeka çözümleri, ai e-ticaret, yapay zeka ürün fotoğrafı, chatbot, otomatik içerik',
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

  // ── ENGLISH ROUTES ──────────────────────────────────
  '/en': {
    title: 'Shopify & İKAS E-Commerce Expert | Web Design & Store Setup Turkey — Samer',
    description:
      'Professional Shopify & İKAS e-commerce store setup, conversion optimization, and web design in Turkey. Istanbul-based specialist serving global brands. Get a free analysis.',
    keywords:
      'shopify expert turkey, ikas ecommerce setup, ecommerce web design istanbul, shopify store setup turkey, web design expert istanbul',
  },
  '/en/services': {
    title: 'E-Commerce & Web Design Services Turkey | Shopify & İKAS — Samer',
    description:
      'Professional e-commerce setup, conversion rate optimization, inventory automation, and web design services. Shopify & İKAS specialist in Istanbul.',
    keywords:
      'shopify services turkey, ecommerce web design services, ikas setup, conversion optimization, web design services istanbul',
  },
  '/en/web-design': {
    title: 'Web Design & Corporate Website Development Turkey | Samer Allaham',
    description:
      'Professional web design and modern website development services. Fast, SEO-friendly, mobile-first corporate and e-commerce websites with React & Next.js.',
    keywords:
      'web design turkey, web design istanbul, professional web design, corporate website development, react web design',
  },
  '/en/istanbul-web-design': {
    title: 'Istanbul Web Design Agency & Expert | Samer Allaham',
    description:
      'Professional web design and e-commerce solutions in Istanbul. Fast, mobile-friendly, and SEO-focused custom website design and development.',
    keywords:
      'istanbul web design, istanbul web design agency, professional web design istanbul, freelance web designer istanbul',
  },
  '/en/fatih-web-design': {
    title: 'Fatih Istanbul Web Design & E-Commerce Setup | Samer Allaham',
    description:
      'Professional web design and e-commerce software solutions in the Fatih district of Istanbul. Modern websites for wholesalers, exporters, and local businesses.',
    keywords:
      'fatih istanbul web design, istanbul web design fatih, ecommerce setup fatih istanbul',
  },
  '/en/ecommerce-web-design': {
    title: 'E-Commerce Web Design | Shopify & İKAS Online Store — Samer',
    description:
      'E-commerce web design services on Shopify & İKAS. Sales-driven, mobile-optimized, and SEO-friendly online store design and setup.',
    keywords:
      'ecommerce web design, shopify web design, ikas web design, online store design turkey',
  },
  '/en/ecommerce-setup': {
    title: 'E-Commerce Store Setup Istanbul | Shopify & İKAS Expert — Samer',
    description:
      'Professional e-commerce store setup in Istanbul. Launch on Shopify or İKAS in 3-7 days. Contact for pricing.',
    keywords:
      'shopify setup istanbul, ikas ecommerce setup, ecommerce store launch, shopify design turkey',
  },
  '/en/ecommerce-optimization': {
    title: 'E-Commerce Optimization | Conversion Rate & Sales Growth — Samer',
    description:
      'Boost your e-commerce store conversion rate. A/B testing, speed optimization, and UX improvements to grow your sales.',
    keywords:
      'ecommerce optimization, conversion rate optimization, shopify speed optimization, core web vitals, ecommerce seo',
  },
  '/en/product-visuals-content': {
    title: 'Product Visuals & AI Content Generation | E-Commerce — Samer',
    description:
      'Professional product photography and SEO-optimized content creation. Converting visuals and descriptions for your e-commerce store.',
    keywords:
      'product photo editing, ai product visuals, product description writing, ecommerce content, seo product description',
  },
  '/en/inventory-stock-automation': {
    title: 'Inventory & Stock Management System | Automation — Samer',
    description:
      'Automate stock tracking and warehouse management. Custom software solutions to eliminate manual errors across all your channels.',
    keywords:
      'inventory management system, shopify ikas integration, trendyol stock sync, warehouse automation, erp integration',
  },
  '/en/monthly-management': {
    title: 'Monthly E-Commerce Management | Store Retainer — Samer',
    description:
      'Monthly e-commerce store management: product updates, campaign management, technical maintenance, and SEO reporting.',
    keywords:
      'monthly ecommerce management, shopify maintenance, ikas management, ecommerce consulting monthly',
  },
  '/en/web-development': {
    title: 'Shopify & E-Commerce Web Development | React Expert Turkey — Samer',
    description:
      'Custom e-commerce web development with React & Next.js. Fast, SEO-optimized, and conversion-focused online store and corporate website development in Turkey.',
    keywords:
      'ecommerce web development turkey, react developer turkey, next.js ecommerce, custom web development istanbul, shopify developer react',
  },
  '/en/custom-software': {
    title: 'Custom E-Commerce Software Development Istanbul | Full-Stack — Samer',
    description:
      'Custom web applications and API integrations for e-commerce. Istanbul-based freelance full-stack developer specializing in Shopify, İKAS, and marketplace automation.',
    keywords:
      'custom software development istanbul, full stack developer istanbul, ecommerce api development, shopify custom development',
  },
  '/en/ai-solutions': {
    title: 'AI Solutions for E-Commerce | Chatbot & Automation — Samer',
    description:
      'AI-powered e-commerce solutions: GPT chatbot integration, automated product content generation, and smart inventory workflows.',
    keywords:
      'ai ecommerce solutions, chatbot integration, gpt chatbot ecommerce, ai product content, ecommerce automation',
  },
  '/en/case-studies': {
    title: 'E-Commerce Success Stories & Case Studies | Samer Allaham',
    description:
      'Real client success: AIO Coffee 35% conversion rate increase, fashion boutique speed score from 45 to 98. E-commerce conversion case studies.',
    keywords:
      'ecommerce case studies, shopify case study, conversion rate improvement example, ecommerce results',
  },
  '/en/blog': {
    title: 'E-Commerce Blog & Guides | Shopify, İKAS & CRO — Samer',
    description:
      'Practical guides on e-commerce, Shopify, İKAS, conversion optimization, and sales growth. Samer Allaham\'s e-commerce blog.',
    keywords:
      'ecommerce blog, shopify guide, ikas guide, ecommerce sales growth, cart abandonment, conversion rate',
  },
  '/en/about': {
    title: 'About — Samer Allaham | E-Commerce Expert',
    description:
      'Istanbul-based e-commerce growth specialist Samer Allaham. Expert software developer in Shopify and İKAS platforms.',
    keywords:
      'samer allaham about, ecommerce expert turkey, shopify developer turkey, ikas specialist',
  },
  '/en/contact': {
    title: 'Contact — Free E-Commerce Analysis | Samer Allaham',
    description:
      'Get a free analysis for your Shopify or İKAS e-commerce project. Contact Samer Allaham via WhatsApp or form.',
    keywords:
      'ecommerce consulting contact, shopify setup pricing, ikas ecommerce quote, free analysis',
  },
  '/en/faq': {
    title: 'E-Commerce FAQ | Shopify, İKAS & Web Design Questions — Samer',
    description:
      'Frequently asked questions about Shopify and İKAS e-commerce setup, web design pricing, and conversion optimization. Expert answers.',
    keywords:
      'ecommerce faq, shopify faq, ikas questions, web design faq, ecommerce knowledge base',
  },

  // ── ARABIC ROUTES ──────────────────────────────────
  '/ar': {
    title: 'خبير متاجر شوبيفاي وإيكاس في تركيا | تصميم متاجر احترافية — سامر',
    description:
      'إنشاء متاجر شوبيفاي وإيكاس الاحترافية في تركيا. تحسين معدل التحويل وتصميم المتاجر الإلكترونية. متخصص في إسطنبول يخدم الشركات العربية.',
    keywords:
      'تصميم متجر شوبيفاي تركيا, خبير إيكاس, برمجة متجر الكتروني, تصميم مواقع تجارة إلكترونية, سامر اللحام',
  },
  '/ar/services': {
    title: 'خدمات التجارة الإلكترونية وتصميم المواقع | سامر اللحام',
    description:
      'خدمات احترافية لإنشاء المتاجر الإلكترونية وتحسين معدل التحويل وأتمتة المخزون وتصميم المواقع.',
    keywords:
      'خدمات شوبيفاي, تصميم متجر الكتروني, إيكاس, تحسين التحويل, تصميم مواقع إسطنبول',
  },
  '/ar/web-design': {
    title: 'تصميم مواقع ويب احترافية في تركيا | سامر اللحام',
    description:
      'خدمات تصميم مواقع ويب احترافية وتطوير مواقع شركات. مواقع سريعة ومتوافقة مع SEO وملائمة للهاتف.',
    keywords:
      'تصميم مواقع تركيا, تصميم مواقع إسطنبول, تصميم مواقع احترافي, تطوير مواقع',
  },
  '/ar/ecommerce-web-design': {
    title: 'تصميم مواقع التجارة الإلكترونية | شوبيفاي وإيكاس — سامر',
    description:
      'خدمات تصميم مواقع التجارة الإلكترونية على شوبيفاي وإيكاس. متاجر إلكترونية مُحسَّنة لزيادة المبيعات.',
    keywords:
      'تصميم موقع تجارة إلكترونية, تصميم متجر شوبيفاي, تصميم متجر إيكاس, إنشاء متجر إلكتروني',
  },
  '/ar/shopify-setup-turkey': {
    title: 'إنشاء متجر شوبيفاي في تركيا | خبير إيكاس — سامر اللحام',
    description:
      'إنشاء متجر شوبيفاي أو إيكاس احترافي في تركيا خلال 3-7 أيام. تواصل معنا للحصول على السعر.',
    keywords:
      'إنشاء متجر شوبيفاي تركيا, خبير إيكاس تركيا, إنشاء متجر الكتروني, تصميم شوبيفاي',
  },
  '/ar/ecommerce-optimization': {
    title: 'تحسين التجارة الإلكترونية | معدل التحويل والمبيعات — سامر',
    description:
      'زيادة معدل تحويل متجرك الإلكتروني. اختبار A/B وتحسين السرعة وتحسين تجربة المستخدم لتنمية مبيعاتك.',
    keywords:
      'تحسين التجارة الإلكترونية, تحسين معدل التحويل, تحسين سرعة شوبيفاي, Core Web Vitals',
  },
  '/ar/product-content-ai': {
    title: 'صور المنتجات والمحتوى بالذكاء الاصطناعي | التجارة الإلكترونية — سامر',
    description:
      'تصوير منتجات احترافي وإنشاء محتوى متوافق مع SEO. صور وأوصاف تحويلية لمتجرك الإلكتروني.',
    keywords:
      'تحرير صور المنتجات, صور المنتجات بالذكاء الاصطناعي, كتابة أوصاف المنتجات, محتوى التجارة الإلكترونية',
  },
  '/ar/stock-inventory-system': {
    title: 'نظام إدارة المخزون والمستودعات | الأتمتة — سامر',
    description:
      'أتمتة تتبع المخزون وإدارة المستودع. حلول برمجية مخصصة للتخلص من الأخطاء اليدوية.',
    keywords:
      'نظام إدارة المخزون, ربط شوبيفاي إيكاس, مزامنة المخزون, أتمتة المستودع',
  },
  '/ar/monthly-ecommerce-management': {
    title: 'إدارة التجارة الإلكترونية الشهرية — سامر اللحام',
    description:
      'إدارة متجرك الإلكتروني شهرياً: تحديثات المنتجات وإدارة الحملات والصيانة التقنية وتقارير SEO.',
    keywords:
      'إدارة التجارة الإلكترونية الشهرية, صيانة شوبيفاي, إدارة إيكاس, استشارات التجارة الإلكترونية',
  },
  '/ar/web-development': {
    title: 'تطوير مواقع ويب للتجارة الإلكترونية | React و Next.js — سامر',
    description:
      'تطوير مواقع تجارة إلكترونية مخصصة بـ React و Next.js. مواقع سريعة ومُحسَّنة لمحركات البحث ومتوافقة مع الهاتف.',
    keywords:
      'تطوير مواقع تجارة إلكترونية, مطور React تركيا, تطوير Next.js, تطوير مواقع مخصصة إسطنبول',
  },
  '/ar/custom-software': {
    title: 'تطوير برمجيات مخصصة لإسطنبول | Full-Stack — سامر',
    description:
      'تطبيقات ويب مخصصة وتكاملات API للتجارة الإلكترونية. مطور Full-Stack مستقل متخصص في شوبيفاي وإيكاس.',
    keywords:
      'تطوير برمجيات مخصصة إسطنبول, مطور Full-Stack إسطنبول, تطوير API تجارة إلكترونية',
  },
  '/ar/ai-solutions': {
    title: 'حلول الذكاء الاصطناعي للتجارة الإلكترونية | تكامل الشات بوت — سامر',
    description:
      'حلول ذكاء اصطناعي للتجارة الإلكترونية. تكامل شات بوت GPT وإنشاء محتوى المنتجات تلقائياً.',
    keywords:
      'حلول الذكاء الاصطناعي, تكامل شات بوت, شات بوت GPT, محتوى المنتجات بالذكاء الاصطناعي',
  },
  '/ar/case-studies': {
    title: 'قصص نجاح التجارة الإلكترونية | سامر اللحام',
    description:
      'قصص نجاح حقيقية: زيادة معدل التحويل بنسبة 35% لـ AIO Coffee. أمثلة على نتائج تحسين التجارة الإلكترونية.',
    keywords:
      'قصص نجاح التجارة الإلكترونية, دراسة حالة شوبيفاي, تحسين معدل التحويل',
  },
  '/ar/blog': {
    title: 'مدونة التجارة الإلكترونية والأدلة الإرشادية | سامر اللحام',
    description:
      'أدلة عملية حول التجارة الإلكترونية وشوبيفاي وإيكاس وتحسين التحويل وزيادة المبيعات.',
    keywords:
      'مدونة التجارة الإلكترونية, دليل شوبيفاي, دليل إيكاس, زيادة مبيعات التجارة الإلكترونية',
  },
  '/ar/about': {
    title: 'حول سامر اللحام | خبير التجارة الإلكترونية',
    description:
      'سامر اللحام خبير نمو التجارة الإلكترونية مقيم في تركيا. متخصص في شوبيفاي وإيكاس.',
    keywords:
      'سامر اللحام, خبير تجارة إلكترونية تركيا, مطور شوبيفاي تركيا, متخصص إيكاس',
  },
  '/ar/contact': {
    title: 'تواصل معنا — تحليل مجاني للتجارة الإلكترونية | سامر اللحام',
    description:
      'احصل على تحليل مجاني لمشروع شوبيفاي أو إيكاس. تواصل مع سامر اللحام عبر واتساب أو النموذج.',
    keywords:
      'تواصل استشارات تجارة إلكترونية, سعر إنشاء متجر شوبيفاي, عرض إيكاس, تحليل مجاني',
  },
  '/ar/faq': {
    title: 'أسئلة شائعة | شوبيفاي وإيكاس وتصميم المواقع — سامر',
    description:
      'أسئلة وأجوبة حول إنشاء متاجر شوبيفاي وإيكاس وأسعار تصميم المواقع وتحسين التحويل.',
    keywords:
      'أسئلة شائعة تجارة إلكترونية, أسئلة شوبيفاي, أسئلة إيكاس, قاعدة معرفة التجارة الإلكترونية',
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
      q: 'E-Ticaret API entegrasyonu ve özel web uygulaması geliştiriyor musunuz?',
      a: 'Evet, Node.js ve REST/GraphQL API mimarileri ile Shopify, İKAS ve pazaryeri platformları için yüksek performanslı, güvenli e-ticaret backend servisleri ve web uygulamaları geliştiriyoruz.',
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
  '/web-tasarim': [
    {
      q: 'Web tasarım ve web geliştirme arasındaki fark nedir?',
      a: 'Web tasarım sitenin görsel tasarımı ve kullanıcı deneyimini kapsar; web geliştirme ise kodlama ve altyapı kurulumunu içerir. Tüm projelerimizde tasarım ve geliştirmeyi bir arada sunuyoruz.',
    },
    {
      q: 'Web tasarım süreci ne kadar sürer?',
      a: 'Standart bir kurumsal web tasarım projesi 2-3 haftada tamamlanır. Özel yazılım gerektiren karmaşık projeler ise 4-6 hafta sürebilir.',
    },
    {
      q: 'Mobil uyumlu (responsive) web tasarım yapıyor musunuz?',
      a: 'Evet, geliştirdiğimiz tüm web tasarımları Mobile-First (önce mobil) anlayışıyla üretilir ve tüm ekran boyutlarına kusursuz uyum sağlar.',
    },
  ],
  '/e-ticaret-web-tasarim': [
    {
      q: 'E-ticaret web tasarım ile standart web tasarım arasındaki fark nedir?',
      a: 'E-ticaret web tasarım, ödeme geçitleri, sepet akışı, stok takibi ve dönüşüm optimizasyonu (CRO) gibi doğrudan satış odaklı teknik bileşenler içerir.',
    },
    {
      q: 'Hangi e-ticaret altyapılarında tasarım yapıyorsunuz?',
      a: 'Shopify ve İKAS altyapılarında yüksek performanslı, modern ve dönüşüm odaklı e-ticaret web tasarım hizmetleri sunuyoruz.',
    },
    {
      q: 'E-ticaret web tasarım paketlerinize SEO dahil mi?',
      a: 'Evet, hazırladığımız tüm e-ticaret web tasarımları arama motorlarına tam uyumlu (Technical SEO & Schema markup) olarak teslim edilir.',
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
  '/web-tasarim': {
    name: 'Profesyonel Web Tasarım Hizmeti',
    description: 'React & Next.js ile modern, hızlı, SEO uyumlu web tasarım ve websitesi geliştirme hizmetleri.',
    offers: { price: '30000', priceCurrency: 'TRY', priceSpecification: '30.000 – 65.000 TL' },
  },
  '/e-ticaret-web-tasarim': {
    name: 'E-Ticaret Web Tasarım Hizmeti',
    description: 'Shopify ve İKAS ile profesyonel e-ticaret web tasarım ve online mağaza kurulumu.',
    offers: { price: '20000', priceCurrency: 'TRY', priceSpecification: '20.000 – 60.000 TL' },
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
  jobTitle: 'E-Ticaret Web Tasarım & Websitesi Geliştirme Uzmanı',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'İstanbul',
    addressCountry: 'TR',
  },
  sameAs: [
    'https://github.com/mhdsamerallaham',
    'https://www.linkedin.com/in/samer-allaham-18a784162/',
    'https://contra.com/samer_allaham_s51lxcvv',
    'https://www.fiverr.com/s/akQab8g',
    'https://www.upwork.com/freelancers/~010348fd03fde0f41b',
    'https://www.quora.com/profile/Samer-Allaham-4',
    'https://hashnode.com/@samerallaham'
  ],
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
    serviceType: svc.name,
    description: svc.description,
    provider: {
      '@type': 'Person',
      name: 'Samer Allaham',
      url: 'https://www.samer.life/hakkimda'
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'İstanbul, Türkiye'
    },
    url: `https://www.samer.life${url}`,
  };
}

// ─────────────────────────────────────────────────
// Build BlogPosting JSON-LD (blog posts)
// ─────────────────────────────────────────────────
function buildArticleSchema({ title, description, slug, date }) {
  const pubDate = date || '2026-07-10';
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `https://www.samer.life/blog/${slug}#article`,
    headline: title,
    description: description,
    url: `https://www.samer.life/blog/${slug}`,
    datePublished: pubDate,
    dateModified: pubDate,
    author: {
      '@type': 'Person',
      '@id': 'https://www.samer.life/#person',
      name: 'Samer Allaham',
      url: 'https://www.samer.life/hakkimda',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Samer Allaham | E-Ticaret Uzmanı',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.samer.life/avatar.jpeg',
        width: 200,
        height: 200,
      },
    },
    image: {
      '@type': 'ImageObject',
      url: 'https://www.samer.life/avatar.jpeg',
      width: 1200,
      height: 630,
    },
    inLanguage: 'tr',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.samer.life/blog/${slug}`,
    },
  };
}

// ─────────────────────────────────────────────────
// Build WebSite JSON-LD (homepage only)
// ─────────────────────────────────────────────────
function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.samer.life/#website',
    url: 'https://www.samer.life/',
    name: 'Samer Allaham | E-Ticaret & Web Geliştirme Uzmanı',
    description: 'Shopify ve İKAS ile e-ticaret web tasarım, site kurulumu, dönüşüm optimizasyonu ve stok otomasyon hizmetleri.',
    inLanguage: ['tr', 'en', 'ar'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.samer.life/blog?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ─────────────────────────────────────────────────
// Build LocalBusiness JSON-LD
// ─────────────────────────────────────────────────
function buildLocalBusinessSchema(pathname) {
  const isLocal = ['/fatih-web-tasarim', '/istanbul-web-tasarim', '/en/fatih-web-design', '/en/istanbul-web-design', '/ar/istanbul-web-design', '/ar/fatih-web-design'].includes(pathname);
  const streetAddress = pathname.includes('fatih') ? 'Fatih' : 'İstanbul';
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': 'https://www.samer.life/#local-business',
    name: 'Samer Allaham | E-Ticaret & Web Tasarım',
    url: 'https://www.samer.life/',
    telephone: '+905394611684',
    email: 'SAMERALLAHAM3@GMAIL.COM',
    logo: 'https://www.samer.life/avatar.jpeg',
    image: 'https://www.samer.life/avatar.jpeg',
    priceRange: '₺₺₺',
    address: {
      '@type': 'PostalAddress',
      streetAddress: streetAddress,
      addressLocality: 'İstanbul',
      addressRegion: 'İstanbul',
      postalCode: '34000',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.0186,
      longitude: 28.9404,
    },
    areaServed: isLocal
      ? [{ '@type': 'City', name: 'İstanbul' }, { '@type': 'Country', name: 'Turkey' }]
      : [{ '@type': 'Country', name: 'Turkey' }],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    hasMap: 'https://share.google/IrAWdrTQOMekMNmwh',
    sameAs: [
      'https://github.com/mhdsamerallaham',
      'https://www.linkedin.com/in/samer-allaham-18a784162/',
      'https://share.google/IrAWdrTQOMekMNmwh',
    ],
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
    hizmetler: 'E-Ticaret & Web Tasarım Hizmetleri',
    'web-tasarim': 'Web Tasarım',
    'e-ticaret-web-tasarim': 'E-Ticaret Web Tasarım',
    'web-sitesi-gelistirme': 'Web Sitesi Geliştirme',
    'yapay-zeka-cozumleri': 'Yapay Zeka Çözümleri',
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
  const pageTitle = finalTitle.includes('Samer') ? finalTitle : `${finalTitle} | Samer`;

  // Alternate Multilingual URLs (hreflang)
  const trUrl = `https://www.samer.life${getLanguageUrl(pathname, 'tr')}`;
  const enUrl = `https://www.samer.life${getLanguageUrl(pathname, 'en')}`;
  const arUrl = `https://www.samer.life${getLanguageUrl(pathname, 'ar')}`;

  // Collect all schemas for this page
  const schemas = [];

  // 1. Global Person + ProfessionalService Schema
  schemas.push(personProfessionalServiceSchema);

  // 2. WebSite + LocalBusiness Schema on homepage & local pages
  const isHomepage = pathname === '/' || pathname === '/en' || pathname === '/ar';
  const isLocalPage = ['/fatih-web-tasarim', '/istanbul-web-tasarim', '/en/fatih-web-design', '/en/istanbul-web-design'].includes(pathname);
  if (isHomepage) schemas.push(buildWebSiteSchema());
  if (isHomepage || isLocalPage) schemas.push(buildLocalBusinessSchema(pathname));

  // 3. FAQ schema for service pages
  const faqs = faqItems || serviceFAQs[pathname];
  if (faqs) schemas.push(buildFAQSchema(faqs));

  // 4. Service schema for service pages
  const svc = serviceSchemas[pathname];
  if (svc) schemas.push(buildServiceSchema(svc, pathname));

  // 5. Article schema for blog posts
  if (article) schemas.push(buildArticleSchema(article));

  // 6. Breadcrumb for all pages except homepage
  if (pathname !== '/' && pathname !== '/en' && pathname !== '/ar') schemas.push(buildBreadcrumbSchema(pathname));

  // 7. Custom schema override/addition
  if (schema) schemas.push(schema);

  return (
    <Helmet>
      {/* Language & direction */}
      <html lang={lang} dir={dir} />

      {/* Titles & Meta */}
      <title>{pageTitle}</title>
      <meta name="description" content={finalDesc} />
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
