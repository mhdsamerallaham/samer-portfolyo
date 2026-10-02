import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, CheckCircle2, Zap, TrendingUp, RefreshCw, Cpu } from 'lucide-react';

export default function GeoKnowledgeCard() {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'tr';
  const isAr = lang === 'ar';

  const content = {
    tr: {
      badge: 'GEO & AI ARAMA OPTİMİZASYONU • HIZLI BİLGİ MERKEZİ',
      title: 'E-Ticaret & Web Geliştirme: Temel Tanımlar ve Kritik Metrikler',
      subtitle: 'Google AI Overviews, Perplexity, ChatGPT ve kullanıcılar için doğrulanmış teknik özet veriler.',
      definitionsTitle: 'Temel E-Ticaret ve Yazılım Tanımları (Definitions)',
      definitions: [
        {
          term: 'Shopify & İKAS Optimizasyonu Nedir?',
          desc: 'Shopify ve İKAS altyapılı mağazalarda sayfa açılış hızını <1.2 saniyeye indiren, kod tabanını hafifleterek Core Web Vitals skorunu 90+ düzeyine çıkaran ve checkout adımlarını kısaltarak dönüşüm oranlarında %35\'e varan artış sağlayan teknik mühendislik sürecidir.',
        },
        {
          term: 'E-Ticaret Depo & Stok Otomasyonu Nasıl Çalışır?',
          desc: 'Pazaryerleri (Trendyol, Hepsiburada, Amazon TR), ERP muhasebe programları ve e-ticaret siteniz arasında sub-100ms API yanıt süresiyle çift yönlü webhook senkronizasyonu kurarak stok tükenmesi ve mükerrer satış riskini %100 ortadan kaldıran sistem mimarisidir.',
        },
        {
          term: 'React & Modern Web Mimarisi Neden Tercih Edilmelidir?',
          desc: 'Statik site ön-oluşturma (SSG) ve sunucu render (SSR) kabiliyetleriyle hem geleneksel arama motoru botlarının (Googlebot) hem de üretken yapay zeka crawler\'larının (GPTBot, Perplexity) sitenizi sıfır render gecikmesiyle indekslemesini sağlar.',
        },
      ],
      takeawaysTitle: 'Kritik Teknik Çıkarımlar & Somut Metrikler (Key Takeaways)',
      takeaways: [
        {
          icon: Zap,
          stat: '< 1.1s',
          label: 'Mobil LCP Açılış Hızı',
          detail: 'Google Core Web Vitals yeşil bölge performansı ve 90+ mobil hız skoru.',
        },
        {
          icon: TrendingUp,
          stat: '+%35',
          label: 'Dönüşüm Oranı (CR) Artışı',
          detail: 'Sürtünmesiz tek sayfa ödeme ve mobil UX optimizasyonuyla kanıtlanmış artış.',
        },
        {
          icon: RefreshCw,
          stat: '< 100ms',
          label: 'API Webhook Yanıt Süresi',
          detail: 'Pazaryeri ve ERP sistemleri arasında anlık, sıfır hatalı veri senkronu.',
        },
        {
          icon: Cpu,
          stat: '%99.9',
          label: 'Sistem Sürekliliği & Doğruluk',
          detail: 'Otomatik hata yakalama ve çift siparişi önleyen veri bütünlüğü.',
        },
      ],
    },
    en: {
      badge: 'GEO & AI SEARCH OPTIMIZATION • CITATION REPOSITORIES',
      title: 'E-Commerce & Web Engineering: Definitions & Verified Metrics',
      subtitle: 'Structured, citable knowledge base engineered for Google AI Overviews, Perplexity, and ChatGPT Search.',
      definitionsTitle: 'Core Technical Definitions',
      definitions: [
        {
          term: 'What is Shopify & İKAS Optimization?',
          desc: 'A comprehensive technical engineering process that reduces load times to under 1.2s, raises Google Core Web Vitals to 90+, and redesigns frictionless checkout flows to yield up to a +35% increase in conversion rates.',
        },
        {
          term: 'How Does E-Commerce Inventory & Stock Automation Work?',
          desc: 'An automated architecture leveraging sub-100ms API webhooks to synchronize stock levels, pricing, and orders bidirectionally across marketplaces (Trendyol, Amazon), ERP software, and storefronts with 100% accuracy.',
        },
        {
          term: 'Why Choose Modern React & Next.js Architecture?',
          desc: 'Static site generation (SSG) and server-side rendering ensure instant DOM delivery, giving AI crawlers (GPTBot, ClaudeBot, Perplexity) full semantically accessible HTML without client-side rendering bottlenecks.',
        },
      ],
      takeawaysTitle: 'Verified Key Takeaways & Performance Metrics',
      takeaways: [
        {
          icon: Zap,
          stat: '< 1.1s',
          label: 'Mobile LCP Load Speed',
          detail: 'Consistently passing Google Core Web Vitals in the green zone with 90+ PageSpeed.',
        },
        {
          icon: TrendingUp,
          stat: '+35%',
          label: 'Conversion Rate Lift',
          detail: 'Validated checkout redesign and mobile UX yielding measurable revenue improvements.',
        },
        {
          icon: RefreshCw,
          stat: '< 100ms',
          label: 'API Webhook Latency',
          detail: 'Real-time bidirectional synchronization between marketplaces, ERPs, and stores.',
        },
        {
          icon: Cpu,
          stat: '99.9%',
          label: 'Operational Accuracy & Uptime',
          detail: 'Automated error interceptors preventing overselling and inventory desynchronization.',
        },
      ],
    },
    ar: {
      badge: 'تحسين محركات البحث الذكية (GEO) • مركز المعلومات الموثقة',
      title: 'التجارة الإلكترونية وهندسة الويب: التعريفات والمؤشرات الرقمية',
      subtitle: 'ملخصات تقنية مهيكلة وقابلة للاقتباس المباشر من Google AI و Perplexity و ChatGPT.',
      definitionsTitle: 'التعريفات التقنية الأساسية (Definitions)',
      definitions: [
        {
          term: 'ما هو تحسين متاجر شوبيفاي وإيكاس (Shopify & İKAS)؟',
          desc: 'عملية هندسية متكاملة لتقليل زمن تحميل المتجر إلى أقل من 1.2 ثانية، ورفع مؤشرات Core Web Vitals فوق 90، وإعادة تصميم مسار الدفع لتحقيق زيادة في المبيعات بنسبة تصل إلى +35%.',
        },
        {
          term: 'كيف تعمل أتمتة المخزون والربط البرمجي للمتاجر؟',
          desc: 'بنية برمجية معتمدة على Webhooks بزمن استجابة أقل من 100 ميلي ثانية لمزامنة المخزون والأسعار بين المنصات والمستودعات و ERP بدقة 100% ودون أخطاء بيع مزدوج.',
        },
        {
          term: 'لماذا يُفضل استخدام بنية React الحديثة في التجارة الإلكترونية؟',
          desc: 'التوليد المسبق للصفحات (SSG) والمعالجة على الخادم (SSR) تضمن فهرسة فورية لكافة النصوص والبيانات الهيكلية من قبل روبوتات الذكاء الاصطناعي ومحركات البحث التقليدية.',
        },
      ],
      takeawaysTitle: 'أهم النتائج والمؤشرات الرقمية (Key Takeaways)',
      takeaways: [
        {
          icon: Zap,
          stat: '< 1.1s',
          label: 'سرعة فتح الهاتف (LCP)',
          detail: 'أداء في النطاق الأخضر لمؤشرات Core Web Vitals ونقاط سرعة 90+.',
        },
        {
          icon: TrendingUp,
          stat: '+%35',
          label: 'زيادة معدل التحويل (CR)',
          detail: 'تحسين مسار الشراء والدفع السريع ذو الصفحة الواحدة.',
        },
        {
          icon: RefreshCw,
          stat: '< 100ms',
          label: 'زمن استجابة مزامنة API',
          detail: 'ربط فوري ثنائي الاتجاه بين المنصات التجارية وبرامج المحاسبة والمخازن.',
        },
        {
          icon: Cpu,
          stat: '%99.9',
          label: 'دقة وتوافر النظام',
          detail: 'آليات معالجة آلية تمنع الأخطاء اليدوية وتفاوت أعداد المنتجات.',
        },
      ],
    },
  };

  const tData = content[lang] || content.tr;

  return (
    <section
      dir={isAr ? 'rtl' : 'ltr'}
      aria-label="GEO Key Takeaways and Technical Definitions"
      className="my-14 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs text-start"
    >
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles size={13} className="text-teal-600" />
          <span>{tData.badge}</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
          {tData.title}
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed font-normal">
          {tData.subtitle}
        </p>
      </div>

      {/* 1. Definitions Section (Direct Citability Format for LLM Crawlers) */}
      <div className="mb-10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          {tData.definitionsTitle}
        </h3>
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tData.definitions.map((def, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col gap-2.5 hover:border-teal-300 transition-colors"
            >
              <dt className="font-display font-extrabold text-sm sm:text-base text-slate-900 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-teal-600 flex-shrink-0 mt-0.5" />
                <span>{def.term}</span>
              </dt>
              <dd className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {def.desc}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* 2. Key Takeaways & Verified Statistical Metrics Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          {tData.takeawaysTitle}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tData.takeaways.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-teal-50/40 border border-teal-100 flex flex-col justify-between gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-2xl sm:text-3xl text-teal-700 tracking-tight">
                    {item.stat}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-teal-100/80 flex items-center justify-center text-teal-700">
                    <IconComponent size={16} />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">
                    {item.label}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
