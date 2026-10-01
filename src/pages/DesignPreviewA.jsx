import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowUpRight, 
  MessageSquare, 
  Check, 
  Quote, 
  Star, 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  ShoppingBag, 
  Zap, 
  Boxes,
  Menu,
  X
} from 'lucide-react';
import SEO from '../components/SEO';

export default function DesignPreviewA() {
  const { i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const lang = i18n.language || 'tr';
  const isRtl = lang === 'ar';

  const handleLangChange = (newLang) => {
    i18n.changeLanguage(newLang);
  };

  // Content dictionaries
  const content = {
    tr: {
      version_badge: 'ÖNİZLEME A — TEAL & TANGERINE',
      switch_version: 'Versiyon B\'ye Geç (Mercan & Krem) →',
      nav: {
        home: 'Anasayfa',
        about: 'Hakkımda',
        services: 'Hizmetler',
        experience: 'Deneyim',
        reviews: 'Yorumlar',
        contact: 'İletişime Geç'
      },
      hero: {
        kicker: 'E-TİCARET & FULL-STACK GELİŞTİRİCİ',
        headline: 'E-ticaret sitenizi satış getiren bir sisteme dönüştürüyorum.',
        desc: 'Shopify ve İKAS altyapılarıyla dönüşüm odaklı, yüksek hızlı ve tam otomatik e-ticaret sistemleri inşa ediyorum.',
        cta: 'Projenizi Konuşalım',
        stack_label: 'UZMANLIK ALANLARI'
      },
      about: {
        tag: 'HAKKIMDA',
        title: 'Teknik mimari ile satış odaklı kullanıcı deneyimini birleştiriyorum.',
        p1: 'İstanbul merkezli yazılım ve e-ticaret geliştiricisiyim. Son 5 yıldır girişimlerin ve markaların dijital mağazalarını kuruyor, mevcut e-ticaret altyapılarının hız ve dönüşüm oranlarını optimize ediyorum.',
        p2: 'Sadece kod yazan veya sadece tasarım giydiren geleneksel yapılardan farklı olarak; işin hem backend API entegrasyonlarını, hem SEO & Core Web Vitals performansını hem de satış getiren checkout akışını tek elden yönetiyorum.',
        points: [
          'Birebir teknik uzmanla doğrudan, hızlı ve şeffaf iletişim',
          '1.1s sayfa açılış hızı ve Google Core Web Vitals 90+ optimizasyonu',
          'Shopify, İKAS ve Trendyol arası kesintisiz çift yönlü stok/sipariş API senkronu'
        ],
        cta: 'Hizmetleri Keşfet'
      },
      services: {
        tag: 'HİZMETLER',
        title: 'İşletmenizi büyüten yalın çözümler',
        subtitle: 'Karmaşık süreçleri ortadan kaldıran, doğrudan ciro ve operasyonel verimliliğe odaklanan 3 ana uzmanlık alanı.',
        items: [
          {
            icon: ShoppingBag,
            title: 'E-Ticaret Mağaza Kurulumu',
            desc: 'Shopify veya İKAS üzerinde sıfırdan satışa hazır, mobil uyumlu, yerel ödeme ve kargo entegrasyonlu anahtar teslim mağaza.'
          },
          {
            icon: Zap,
            title: 'Hız & Dönüşüm Optimizasyonu',
            desc: 'Sepet terkini azaltan tek sayfa checkout tasarımı, 1.1s yükleme hızı ve Google PageSpeed 90+ performans geliştirmesi.'
          },
          {
            icon: Boxes,
            title: 'Stok & Depo API Entegrasyonu',
            desc: 'Pazaryerleri (Trendyol, Hepsiburada), Shopify ve ERP sistemleri arasında anlık çift yönlü otomatik stok senkronizasyonu.'
          }
        ]
      },
      experience: {
        tag: 'DENEYİM & YOLCULUK',
        title: '5 yılı aşkın e-ticaret ve yazılım uzmanlığı',
        subtitle: 'Farklı ölçeklerdeki markalar için hayata geçirdiğim teknik aşamalar ve kariyer adımları.',
        items: [
          {
            period: '2022 — Günümüz',
            role: 'Bağımsız E-Ticaret Mühendisi & Danışman',
            place: 'İstanbul / Remote',
            desc: 'Shopify ve İKAS altyapılarında 50+ mağaza teslimatı, özel React/Next.js web uygulamaları ve çok kanallı stok otomasyonları.'
          },
          {
            period: '2020 — 2022',
            role: 'Full-Stack Web & Entegrasyon Geliştirici',
            place: 'Dijital E-Ticaret Ajansları',
            desc: 'Pazaryeri API entegrasyonları, ödeme geçitleri (PayTR, iyzico) ve dönüşüm oranı optimizasyonu (CRO) projeleri.'
          },
          {
            period: '2018 — 2020',
            role: 'Frontend Geliştirici & UI Tasarımcısı',
            place: 'Yazılım Çözüm Ortaklığı',
            desc: 'Modern kullanıcı arayüzleri, responsive mobil uyumluluk ve arama motoru optimizasyonu (SEO) altyapı kodlaması.'
          }
        ]
      },
      reviews: {
        tag: 'MÜŞTERİ YORUMLARI',
        title: 'Birlikte büyüttüğümüz markalar',
        subtitle: 'Gerçek proje sahiplerinin doğrudan Google Haritalar üzerinden paylaştığı doğrulanmış deneyimleri.',
        items: [
          {
            quote: 'Samer ile checkout ve hız optimizasyonu üzerinde çalıştık. Dönüşüm oranımız %35 arttı. İş disiplini ve teknik bilgisi harika.',
            name: 'Ahmet Y.',
            role: 'AIO Coffee CEO'
          },
          {
            quote: 'Wordpress sitemizi İKAS altyapısına sorunsuz taşıdı. Sayfa hızımız 1.1 saniyeye düştü. Destek ve yönlendirmeleri için çok teşekkürler.',
            name: 'Elif K.',
            role: 'Moda Butiği Kurucusu'
          },
          {
            quote: 'Shopify ve Trendyol arasındaki stok senkronizasyon yazılımını geliştirdi. Manuel hatalardan kaynaklanan cezalarımız tamamen bitti.',
            name: 'Omar B.',
            role: 'Global E-Ticaret Müdürü'
          }
        ]
      },
      cta_box: {
        title: 'Yeni bir mağaza mı kuruyorsunuz, yoksa satışları mı artıracaksınız?',
        desc: 'Projenizin ihtiyaçlarını ve hedeflerini 15 dakikada konuşalım. 24 saat içinde ücretsiz analiz ve net bir yol haritasıyla dönüş yapayım.',
        btn_whatsapp: 'WhatsApp ile Hızlıca Yazın',
        btn_mail: 'E-Posta ile Ulaşın'
      },
      footer: {
        desc: 'Shopify, İKAS ve modern web altyapılarıyla yüksek performanslı satış sistemleri inşa eden bağımsız yazılım uzmanı.',
        rights: 'Tüm hakları saklıdır.'
      }
    },
    en: {
      version_badge: 'PREVIEW A — TEAL & TANGERINE',
      switch_version: 'Switch to Version B (Coral & Cream) →',
      nav: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        experience: 'Experience',
        reviews: 'Reviews',
        contact: 'Contact'
      },
      hero: {
        kicker: 'E-COMMERCE & FULL-STACK ENGINEER',
        headline: 'I transform your e-commerce website into a system that drives sales.',
        desc: 'Building high-converting, high-speed, and fully automated e-commerce engines on Shopify & İKAS platforms.',
        cta: "Let's Talk About Your Project",
        stack_label: 'CORE EXPERTISE'
      },
      about: {
        tag: 'ABOUT ME',
        title: 'Combining engineering precision with conversion-focused design.',
        p1: 'Based in Istanbul, Turkey. Over the past 5 years, I have launched digital storefronts for growing brands and optimized speed, checkout UX, and inventory automation.',
        p2: 'Unlike traditional agencies that only apply basic templates or write isolated code, I oversee the complete growth engine: backend API syncs, Core Web Vitals, and high-converting checkout flows.',
        points: [
          'Direct, fast, and transparent communication with the lead developer',
          '1.1s page load speed & Google Core Web Vitals 90+ score guarantee',
          'Real-time bidirectional inventory API sync between Shopify, İKAS & marketplaces'
        ],
        cta: 'Explore Services'
      },
      services: {
        tag: 'SERVICES',
        title: 'Clean solutions that scale your revenue',
        subtitle: 'Three focused core engineering services designed to eliminate friction and maximize conversion rates.',
        items: [
          {
            icon: ShoppingBag,
            title: 'E-Commerce Store Setup',
            desc: 'End-to-end turnkey store launch on Shopify or İKAS with custom responsive design, payment gateways, and shipping setup.'
          },
          {
            icon: Zap,
            title: 'Speed & CRO Optimization',
            desc: 'Cart abandonment reduction, 1.1s page load optimization, and green Google Core Web Vitals 90+ scores.'
          },
          {
            icon: Boxes,
            title: 'Stock & Inventory API Sync',
            desc: 'Instant 2-way real-time stock and order automation between marketplaces (Trendyol, Amazon), Shopify, and ERPs.'
          }
        ]
      },
      experience: {
        tag: 'EXPERIENCE & TIMELINE',
        title: 'Over 5 years of specialized engineering',
        subtitle: 'Milestones and technical achievements across different growth stages.',
        items: [
          {
            period: '2022 — Present',
            role: 'Independent E-Commerce Engineer & Consultant',
            place: 'Istanbul / Remote',
            desc: '50+ completed Shopify/İKAS stores, custom React/Next.js web applications, and multi-channel API integrations.'
          },
          {
            period: '2020 — 2022',
            role: 'Full-Stack Web & Integration Developer',
            place: 'Digital E-Commerce Agencies',
            desc: 'Marketplace API integrations, payment gateways (PayTR, Stripe), and conversion rate optimization (CRO).'
          },
          {
            period: '2018 — 2020',
            role: 'Frontend Developer & UI Specialist',
            place: 'Software Agency Partnership',
            desc: 'Modern responsive web interfaces, cross-browser compatibility, and technical SEO infrastructure.'
          }
        ]
      },
      reviews: {
        tag: 'CLIENT REVIEWS',
        title: 'Brands we scaled together',
        subtitle: 'Verified testimonials from founders and e-commerce leaders on Google Maps.',
        items: [
          {
            quote: 'We worked with Samer on checkout and speed optimization. Our conversion rate increased by 35%. His work discipline is exceptional.',
            name: 'Ahmet Y.',
            role: 'AIO Coffee CEO'
          },
          {
            quote: 'He migrated our WordPress site to İKAS seamlessly. Our page load speed dropped to 1.1s. Highly recommended for any serious store.',
            name: 'Elif K.',
            role: 'Moda Butiği Founder'
          },
          {
            quote: 'He developed the inventory sync software between Shopify and Trendyol. All stock penalty issues are completely solved.',
            name: 'Omar B.',
            role: 'Global E-Commerce Manager'
          }
        ]
      },
      cta_box: {
        title: 'Launching a new store or scaling an existing one?',
        desc: "Let's discuss your project goals. I will get back to you within 24 hours with a free audit and clear actionable roadmap.",
        btn_whatsapp: 'Chat on WhatsApp',
        btn_mail: 'Send an Email'
      },
      footer: {
        desc: 'Independent software and e-commerce engineer building high-performance sales platforms on Shopify, İKAS, and React.',
        rights: 'All rights reserved.'
      }
    },
    ar: {
      version_badge: 'المعاينة أ — تيل وبرتقالي',
      switch_version: 'الانتقال إلى المعاينة ب (المرجاني والكريمي) ←',
      nav: {
        home: 'الرئيسية',
        about: 'من أنا',
        services: 'الخدمات',
        experience: 'الخبرات',
        reviews: 'التقييمات',
        contact: 'تواصل معي'
      },
      hero: {
        kicker: 'مطور متاجر إلكترونية وبرمجيات متكاملة',
        headline: 'أحوّل متجرك الإلكتروني إلى نظام مبيعات متكامل يحقق الأرباح.',
        desc: 'أقوم ببناء حلول تجارة إلكترونية سريعة ومؤتمتة على منصات شوبيفاي و إيكاس مع التركيز على مضاعفة نسب التحويل.',
        cta: 'فلنتحدث عن مشروعك',
        stack_label: 'الخبرات الأساسية'
      },
      about: {
        tag: 'من أنا',
        title: 'أجمع بين الدقة البرمجية وتصميم تجربة مستخدم تزيد المبيعات.',
        p1: 'مطور برمجيات وتجارة إلكترونية مقيم في إسطنبول. على مدار أكثر من 5 سنوات قمت بإطلاق المتاجر الرقمية للعلامات التجارية وتحسين سرعة وأداء الأنظمة.',
        p2: 'على عكس الوكالات التقليدية؛ أتولى كافة الجوانب من ربط الواجهات البرمجية (API)، وتحسين سرعة الصفحة ومؤشرات الويب الأساسية (Core Web Vitals 90+)، وتصميم صفحة دفع سريعة تمنع التخلي عن السلة.',
        points: [
          'تواصل مباشر وسريع وشفاف مع المهندس البرمجي مباشرة',
          'سرعة تحميل 1.1 ثانية ومؤشرات أداء جوجل خضراء 90+',
          'مزامنة فورية للمخزون والطلبات بين شوبيفاي وإيكاس وترينديول'
        ],
        cta: 'استكشف الخدمات'
      },
      services: {
        tag: 'الخدمات',
        title: 'حلول واضحة تنمي نشاطك التجاري',
        subtitle: '3 مجالات خبرة رئيسية تركز على رفع المبيعات والكفاءة التشغيلية دون تعقيدات.',
        items: [
          {
            icon: ShoppingBag,
            title: 'إعداد وتصميم المتجر الإلكتروني',
            desc: 'متجر متكامل جاهز للمبيعات على شوبيفاي أو إيكاس بتصميم متجاوب وربط كامل لبوابات الدفع والشحن.'
          },
          {
            icon: Zap,
            title: 'تحسين السرعة ومعدل التحويل (CRO)',
            desc: 'تقليل التخلي عن السلة، وسرعة فتح 1.1 ثانية، ورفع تقييم Google PageSpeed إلى أكثر من 90.'
          },
          {
            icon: Boxes,
            title: 'ربط وأتمتة المخزون والـ API',
            desc: 'مزامنة لحظية ثنائية الاتجاه للمخزون والطلبات بين المنصات (Trendyol, Amazon) وشوبيفاي وأنظمة الـ ERP.'
          }
        ]
      },
      experience: {
        tag: 'الخبرة والمسار',
        title: 'أكثر من 5 سنوات في هندسة التجارة الإلكترونية',
        subtitle: 'محطات تقنية وإنجازات مع مختلف العلامات التجارية والمتاجر.',
        items: [
          {
            period: '2022 — الآن',
            role: 'مهندس ومستشار تجارة إلكترونية مستقل',
            place: 'إسطنبول / عن بُعد',
            desc: 'أكثر من 50 متجراً مكتملاً على Shopify و İKAS وتطبيقات ويب مخصصة برياكت ونكست.'
          },
          {
            period: '2020 — 2022',
            role: 'مطور واجهات وخلفيات برمجية',
            place: 'وكالات تجارة رقمية',
            desc: 'ربط بوابات الدفع وواجهات المتاجر وتحسين معدلات الشراء والتحويل.'
          },
          {
            period: '2018 — 2020',
            role: 'مطور واجهات أمامية وتجربة مستخدم',
            place: 'شراكات برمجية',
            desc: 'بناء واجهات متجاوبة ومتوافقة مع مختلف الشاشات وتهيئة البنية التحتية للسيو (SEO).'
          }
        ]
      },
      reviews: {
        tag: 'آراء العملاء',
        title: 'متاجر وعلامات تجارية كبرت معنا',
        subtitle: 'تقييمات موثقة من أصحاب المشاريع الحقيقيين عبر خرائط جوجل.',
        items: [
          {
            quote: 'عملنا مع سامر على تحسين سرعة الدفع وصفحة الدفع. ارتفع معدل التحويل بنسبة 35٪. انضباطه في العمل ومعرفته التقنية رائعة.',
            name: 'أحمد ي.',
            role: 'الرئيس التنفيذي لـ AIO Coffee'
          },
          {
            quote: 'نقل موقعنا من ووردبريس إلى إيكاس بسلاسة تامة. انخفضت سرعة الصفحة إلى 1.1 ثانية. شكراً جزيلاً لدعمه وتوجيهه.',
            name: 'إليف ك.',
            role: 'مؤسسة Moda Butiği'
          },
          {
            quote: 'قام بتطوير برنامج مزامنة المخزون بين شوبيفاي وترينديول. انتهت الغرامات الناتجة عن الأخطاء اليدوية تماماً.',
            name: 'عمر ب.',
            role: 'مدير العمليات التجارية'
          }
        ]
      },
      cta_box: {
        title: 'هل تؤسس متجراً جديداً أم ترغب في مضاعفة مبيعاتك الحالية؟',
        desc: 'فلنتحدث عن أهداف مشروعك خلال 15 دقيقة. سأعود إليك خلال 24 ساعة بتحليل مجاني وخطة عمل واضحة.',
        btn_whatsapp: 'محادثة سريعة عبر واتساب',
        btn_mail: 'مراسلة عبر البريد الإلكتروني'
      },
      footer: {
        desc: 'مهندس برمجيات وتجارة إلكترونية مستقل يبني منصات بيع عالية الأداء على Shopify و İKAS و React.',
        rights: 'جميع الحقوق محفوظة.'
      }
    }
  };

  const tData = content[lang] || content.tr;
  const currentYear = new Date().getFullYear();

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-teal-100 selection:text-teal-900 ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO 
        title={`${tData.hero.headline} — Samer Allaham`}
        description={tData.hero.desc}
      />

      {/* TOP COMPARISON SWITCHER BAR */}
      <div className="bg-[#0F172A] text-white text-xs py-2 px-4 sticky top-0 z-[3000] border-b border-slate-800 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse" />
          <span className="font-bold tracking-wider uppercase text-teal-400">{tData.version_badge}</span>
          <span className="text-slate-400 hidden sm:inline">• Teal & Tangerine Palette</span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/design-preview-b" 
            className="text-amber-300 hover:text-white font-bold underline transition-colors flex items-center gap-1"
          >
            {tData.switch_version}
          </Link>
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            {['tr', 'en', 'ar'].map((l) => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                  lang === l ? 'bg-[#0D9488] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. MINIMALIST NAVBAR
          ───────────────────────────────────────────────────────────── */}
      <header className="border-b border-[#E2E8F0] bg-[#F8FAFC]/90 backdrop-blur-md sticky top-8 z-[2000]">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#0F172A] group-hover:text-[#0D9488] transition-colors">
              Samer Allaham
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#475569]">
            <a href="#hero" className="hover:text-[#0D9488] transition-colors">{tData.nav.home}</a>
            <a href="#about" className="hover:text-[#0D9488] transition-colors">{tData.nav.about}</a>
            <a href="#services" className="hover:text-[#0D9488] transition-colors">{tData.nav.services}</a>
            <a href="#experience" className="hover:text-[#0D9488] transition-colors">{tData.nav.experience}</a>
            <a href="#reviews" className="hover:text-[#0D9488] transition-colors">{tData.nav.reviews}</a>
          </nav>

          {/* Single Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://wa.me/905394611684?text=Merhaba%20Samer,%20e-ticaret%20projem%20için%20görüşmek%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-[#0D9488] hover:bg-[#0F766E] text-white font-medium text-sm rounded-full transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              {tData.nav.contact}
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#0F172A] hover:text-[#0D9488] transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E2E8F0] px-6 py-6 flex flex-col gap-4">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-[#0F172A] hover:text-[#0D9488]">{tData.nav.home}</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-[#0F172A] hover:text-[#0D9488]">{tData.nav.about}</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-[#0F172A] hover:text-[#0D9488]">{tData.nav.services}</a>
            <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-[#0F172A] hover:text-[#0D9488]">{tData.nav.experience}</a>
            <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-[#0F172A] hover:text-[#0D9488]">{tData.nav.reviews}</a>
            <div className="pt-3 border-t border-slate-100">
              <a
                href="https://wa.me/905394611684?text=Merhaba%20Samer,%20e-ticaret%20projem%20için%20görüşmek%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center py-3 bg-[#0D9488] text-white font-medium rounded-full text-sm"
              >
                {tData.nav.contact}
              </a>
            </div>
          </div>
        )}
      </header>


      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION (Clean, Generous Whitespace, Single Portrait)
          ───────────────────────────────────────────────────────────── */}
      <section id="hero" className="pt-20 pb-24 md:pt-28 md:pb-36 max-w-[1240px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0D9488]">
                {tData.hero.kicker}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.14] text-[#0F172A] tracking-tight">
              {tData.hero.headline}
            </h1>

            <p className="text-base sm:text-lg text-[#475569] leading-relaxed font-normal max-w-xl">
              {tData.hero.desc}
            </p>

            {/* Single Clear CTA Button */}
            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <a
                href="https://wa.me/905394611684?text=Merhaba%20Samer,%20e-ticaret%20sitem%20için%20görüşmek%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold rounded-full text-sm sm:text-base tracking-wide transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>{tData.hero.cta}</span>
                <ArrowRight size={18} />
              </a>
            </div>

            {/* Minimal Stack Under Hero */}
            <div className="pt-6 border-t border-[#E2E8F0] mt-2">
              <span className="text-[11px] font-bold tracking-wider text-[#94A3B8] uppercase block mb-2">
                {tData.hero.stack_label}
              </span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-[#475569]">
                <span>Shopify</span>
                <span>•</span>
                <span>İKAS</span>
                <span>•</span>
                <span>React & Next.js</span>
                <span>•</span>
                <span>REST & GraphQL API</span>
                <span>•</span>
                <span>CRO & Hız</span>
              </div>
            </div>

          </div>

          {/* Right Clean Portrait */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              
              {/* Soft decorative offset frame in Teal */}
              <div className="absolute inset-0 bg-[#CCFBF1] rounded-3xl transform translate-x-3 translate-y-3 -z-10" />

              {/* Portrait Container */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-3 shadow-lg overflow-hidden">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src="/avatar.webp"
                    alt="Samer Allaham - Full-Stack E-Commerce Engineer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="pt-4 pb-2 px-3 text-center">
                  <span className="font-serif font-bold text-lg text-[#0F172A] block">Samer Allaham</span>
                  <span className="text-xs text-[#0D9488] font-medium block mt-0.5">İstanbul, TR • Remote Worldwide</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          3. ABOUT (HAKKIMDA) — Story + Single Image with Offset Block
          ───────────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 md:py-32 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Story Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0D9488]">
                {tData.about.tag}
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] leading-tight">
                {tData.about.title}
              </h2>

              <p className="text-base text-[#475569] leading-relaxed font-normal">
                {tData.about.p1}
              </p>
              <p className="text-base text-[#475569] leading-relaxed font-normal">
                {tData.about.p2}
              </p>

              {/* 3 Simple highlights */}
              <div className="flex flex-col gap-3 pt-2">
                {tData.about.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-[#0D9488] flex-shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-[#1E293B]">{pt}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <a 
                  href="#services"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#0D9488] hover:text-[#0F766E] transition-colors"
                >
                  <span>{tData.about.cta}</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Right Image with Offset Teal Block */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                
                {/* Offset colored background block */}
                <div className="absolute inset-0 bg-[#0D9488]/10 rounded-3xl transform -translate-x-3 translate-y-3 -z-10" />

                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-3 shadow-md">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src="/avatar.jpeg"
                      alt="Samer Allaham"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-xs font-serif italic text-[#64748B]">"Satış getiren e-ticaret altyapıları, titiz mühendislikle başlar."</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          4. SERVICES (HİZMETLER) — 3 Equal Minimalist Cards
          ───────────────────────────────────────────────────────────── */}
      <section id="services" className="py-24 md:py-32 max-w-[1240px] mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0D9488]">
            {tData.services.tag}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight">
            {tData.services.title}
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            {tData.services.subtitle}
          </p>
        </div>

        {/* 3 Equal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tData.services.items.map((srv, idx) => {
            const IconComp = srv.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white border border-[#E2E8F0] rounded-3xl p-8 sm:p-9 flex flex-col justify-between hover:border-[#0D9488] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 min-h-[340px]"
              >
                <div>
                  {/* Top Bar: Soft Circular Icon Container + Top-Right Arrow */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0D9488] group-hover:bg-[#0D9488] group-hover:text-white transition-all duration-300">
                      <IconComp size={24} />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#94A3B8] group-hover:text-[#0D9488] group-hover:bg-teal-50 transition-colors">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif text-2xl font-bold text-[#0F172A] mb-3 group-hover:text-[#0D9488] transition-colors leading-snug">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed font-normal">
                    {srv.desc}
                  </p>
                </div>

                {/* Bottom subtle link */}
                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-bold text-[#0D9488]">
                  <span>Detayları İncele</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </section>


      {/* ─────────────────────────────────────────────────────────────
          5. EXPERIENCE (DENEYİM & ZAMAN ÇİZELGESİ)
          ───────────────────────────────────────────────────────────── */}
      <section id="experience" className="py-24 md:py-32 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-[1000px] mx-auto px-6 sm:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0D9488]">
              {tData.experience.tag}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight">
              {tData.experience.title}
            </h2>
            <p className="text-sm text-[#64748B]">
              {tData.experience.subtitle}
            </p>
          </div>

          {/* Clean Timeline List */}
          <div className="flex flex-col divide-y divide-[#E2E8F0]">
            {tData.experience.items.map((exp, idx) => (
              <div key={idx} className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start group hover:bg-slate-50/50 p-4 rounded-2xl transition-colors">
                
                {/* Period */}
                <div className="md:col-span-3">
                  <span className="font-serif font-bold text-base text-[#0D9488]">
                    {exp.period}
                  </span>
                </div>

                {/* Role & Company */}
                <div className="md:col-span-4">
                  <h3 className="font-bold text-base sm:text-lg text-[#0F172A] leading-snug">
                    {exp.role}
                  </h3>
                  <span className="text-xs text-[#64748B] font-medium block mt-0.5">
                    {exp.place}
                  </span>
                </div>

                {/* Description */}
                <div className="md:col-span-5">
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {exp.desc}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          6. CLIENT REVIEWS (MÜŞTERİ YORUMLARI) — 3 Equal Cards
          ───────────────────────────────────────────────────────────── */}
      <section id="reviews" className="py-24 md:py-32 max-w-[1240px] mx-auto px-6 sm:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0D9488]">
            {tData.reviews.tag}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight">
            {tData.reviews.title}
          </h2>
          <p className="text-sm sm:text-base text-[#64748B]">
            {tData.reviews.subtitle}
          </p>
        </div>

        {/* 3 Equal Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tData.reviews.items.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E2E8F0] rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-300 min-h-[280px]"
            >
              <div>
                {/* Quote Icon & 5 Stars */}
                <div className="flex justify-between items-center mb-6">
                  <div className="text-[#0D9488]">
                    <Quote size={24} />
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-sm sm:text-base font-normal text-[#334155] leading-relaxed italic mb-6">
                  "{rev.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 text-[#0D9488] font-serif font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <span className="font-serif font-bold text-sm text-[#0F172A] block">{rev.name}</span>
                  <span className="text-xs text-[#64748B] block">{rev.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>


      {/* ─────────────────────────────────────────────────────────────
          7. CTA BANNER / CONTACT SECTION (Centered Minimalist)
          ───────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 md:py-32 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-[850px] mx-auto px-6 sm:px-8 text-center flex flex-col items-center gap-6">
          
          <span className="text-xs font-bold uppercase tracking-widest text-[#0D9488]">
            İLETİŞİM & BAŞLANGIÇ
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
            {tData.cta_box.title}
          </h2>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl font-normal">
            {tData.cta_box.desc}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/905394611684?text=Merhaba%20Samer,%20e-ticaret%20projem%20için%20görüşmek%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold rounded-full text-base shadow-lg shadow-teal-700/20 hover:shadow-xl transition-all duration-200"
            >
              <MessageSquare size={18} />
              <span>{tData.cta_box.btn_whatsapp}</span>
            </a>
            
            <a
              href="mailto:samerallaham3@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-semibold rounded-full text-base transition-colors"
            >
              <Mail size={18} />
              <span>{tData.cta_box.btn_mail}</span>
            </a>
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          8. FOOTER (Dark Minimalist Foundation)
          ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0F172A] text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-start">
            <span className="font-serif text-2xl font-bold text-white tracking-tight">Samer Allaham</span>
            <p className="text-xs text-slate-400 max-w-sm">
              {tData.footer.desc}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a href="https://share.google/IrAWdrTQOMekMNmwh" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#0D9488] text-white flex items-center justify-center transition-colors" aria-label="Google Maps">
              <MapPin size={18} />
            </a>
            <a href="https://github.com/mhdsamerallaham" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#0D9488] text-white flex items-center justify-center transition-colors" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="https://www.linkedin.com/in/samer-allaham-18a784162/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#0D9488] text-white flex items-center justify-center transition-colors" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="mailto:samerallaham3@gmail.com" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#0D9488] text-white flex items-center justify-center transition-colors" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>

          <div className="text-xs text-slate-500 text-center md:text-end">
            <span>© {currentYear} Samer Allaham. {tData.footer.rights}</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
