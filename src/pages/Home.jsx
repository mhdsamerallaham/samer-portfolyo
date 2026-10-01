import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Zap, CheckCircle2, TrendingUp, ShieldCheck, Award, Layers, ArrowUpRight } from 'lucide-react';
import SEO from '../components/SEO';
import ServiceCard from '../components/ServiceCard';
import AIDemo from '../components/AIDemo';
import FAQ from '../components/FAQ';
import ContactForm from '../components/ContactForm';
import Reviews from '../components/Reviews';
import { getLocalizedPath } from '../utils/navigation';

export default function Home() {
  const { t, i18n } = useTranslation();

  const featuredServices = ['site-kurulumu', 'optimizasyon'];
  const companionServices = ['stok-depo', 'urun-gorsel', 'web-gelistirme', 'ozel-yazilim', 'aylik-yonetim', 'yapay-zeka'];
  const caseStudies = t('case_studies.items', { returnObjects: true }) || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* SEO Configuration — title/description routeSEOMap'ten otomatik alınır */}
      <SEO
        keywords="shopify site kurma, ikas e ticaret sitesi kurulumu, e-ticaret web tasarım, dönüşüm optimizasyonu, stok entegrasyonu, web tasarım istanbul"
      />

      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Human-Centric & Solution-Driven)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 md:px-12 pt-32 sm:pt-36 pb-20 md:pb-28 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center text-start">
          
          {/* Left Column: Value Promise & CTAs */}
          <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-7 z-10">
            
            {/* Live Availability Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold w-fit shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
              </span>
              <span>{i18n.language === 'tr' ? 'PROJELERE AÇIK • İSTANBUL & REMOTE' : i18n.language === 'ar' ? 'متاح للمشاريع الجديدة • إسطنبول وعن بُعد' : 'AVAILABLE FOR PROJECTS • ISTANBUL & REMOTE'}</span>
            </div>

            {/* Dominant Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl xl:text-6xl font-extrabold tracking-tight leading-[1.08] text-slate-900">
              {i18n.language === 'tr' 
                ? 'E-ticaret sitenizi satış getiren bir sisteme dönüştürüyorum.' 
                : i18n.language === 'ar' 
                ? 'أحوّل متجرك الإلكتروني إلى نظام مبيعات عالي التحويل والأداء.' 
                : 'I turn e-commerce stores into high-converting revenue systems.'}
            </h1>

            {/* Subheadline */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              {t('hero.subheadline') || 'Shopify ve İKAS altyapıları ile dönüşüm odaklı, yüksek performanslı ve otomatik e-ticaret çözümleri.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                to={getLocalizedPath('/iletisim', i18n.language)}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-sm sm:text-base tracking-wide shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/35 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>{t('hero.cta_primary') || 'Ücretsiz Analiz Al'}</span>
                <ArrowRight size={17} />
              </Link>
              <a
                href="#hizmetler"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-2xl text-sm sm:text-base transition-all duration-200 shadow-xs hover:border-slate-300"
              >
                {t('hero.cta_secondary') || 'Hizmetleri Keşfet'}
              </a>
            </div>

            {/* Platform Partners & Tech Tags */}
            <div className="pt-5 border-t border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                {i18n.language === 'tr' 
                  ? 'UZMANLAŞILAN PLATFORM VE TEKNOLOJİLER' 
                  : i18n.language === 'ar' 
                  ? 'المنصات والتقنيات المتخصصة' 
                  : 'PLATFORMS & SPECIALIZATIONS'}
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  🛍️ Shopify Partner
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  ⚡ İKAS Specialist
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  ⚛️ React & Next.js
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  📦 {i18n.language === 'tr' ? 'API & Stok Senkronu' : i18n.language === 'ar' ? 'مزامنة المخزون و API' : 'API & Stock Sync'}
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Trust Profile & Proof Card */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_16px_48px_-12px_rgba(15,23,42,0.08)] relative">
              
              {/* Profile Photo and Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-2 border-teal-500/20 bg-slate-100 flex-shrink-0 shadow-sm">
                  <img
                    src="/avatar.webp"
                    alt="Samer Allaham - E-Ticaret Web Tasarım ve Geliştirme Uzmanı"
                    width="88"
                    height="88"
                    fetchpriority="high"
                    decoding="async"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-md mb-1">
                    <ShieldCheck size={12} className="text-teal-600" />
                    <span>{i18n.language === 'tr' ? 'Doğrulanmış Uzman' : i18n.language === 'ar' ? 'خبير معتمد' : 'Verified Specialist'}</span>
                  </div>
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 leading-tight">
                    Samer Allaham
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {i18n.language === 'tr' ? 'Full-Stack E-Ticaret Geliştirici' : i18n.language === 'ar' ? 'مهندس ومطور متاجر متكامل' : 'Full-Stack E-Commerce Engineer'}
                  </p>
                </div>
              </div>

              {/* Proven Proof Cards */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                      <Star size={16} className="fill-amber-500 text-amber-500" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      {i18n.language === 'tr' ? 'Müşteri Puanı' : i18n.language === 'ar' ? 'تقييم العملاء' : 'Client Rating'}
                    </span>
                  </div>
                  <span className="font-display font-extrabold text-sm text-slate-900">4.9 / 5.0 ★</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
                      <Zap size={16} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      {i18n.language === 'tr' ? 'Core Web Vitals Skoru' : i18n.language === 'ar' ? 'مؤشرات سرعة الأداء' : 'PageSpeed Score'}
                    </span>
                  </div>
                  <span className="font-display font-extrabold text-sm text-teal-600">
                    {i18n.language === 'tr' ? '90+ Mobil Hız' : i18n.language === 'ar' ? '+90 سرعة الهاتف' : '90+ Mobile Speed'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                      <TrendingUp size={16} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      {i18n.language === 'tr' ? 'Teslim Edilen Proje' : i18n.language === 'ar' ? 'المشاريع المنجزة' : 'Completed Stores'}
                    </span>
                  </div>
                  <span className="font-display font-extrabold text-sm text-slate-900">
                    {i18n.language === 'tr' ? '50+ Mağaza' : i18n.language === 'ar' ? '+50 متجر' : '50+ Stores'}
                  </span>
                </div>
              </div>

              {/* Quick WhatsApp message trigger */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {i18n.language === 'tr' ? 'Doğrudan iletişim:' : i18n.language === 'ar' ? 'تواصل مباشر:' : 'Direct contact:'}
                </span>
                <a
                  href="https://wa.me/905394611684?text=Merhaba%20Samer,%20e-ticaret%20projem%20için%20görüşmek%20istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  <span>WhatsApp (+90 539 461 1684)</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. VALUE PROPOSITION: "Why Samer vs Traditional Agency"
          ───────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 md:px-12 py-20 lg:py-24 max-w-[1280px] mx-auto border-t border-slate-200/80">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-start">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Award size={13} className="text-teal-600" />
            <span>{t('positioning.tag') || 'NEDEN BEN?'}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            {t('positioning.title') || 'Sadece e-ticaret sitesi kurmuyor, satışlarınızı artıran sistemler inşa ediyorum.'}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
            {t('positioning.desc') || 'Ajanslar görselliğe, sıradan geliştiriciler ise sadece koda bakar. Ben ikisini birleştirerek dönüşüm oranını artıran, stok senkronizasyonu sağlayan ve arama motorlarının sevdiği uçtan uca satış sistemleri kuruyorum.'}
          </p>
        </div>

        {/* Comparison Grid & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Comparison Card: Agency vs Samer */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            
            {/* Column 1: Traditional Agency */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 text-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                {i18n.language === 'tr' ? 'GELENEKSEL AJANSLAR' : i18n.language === 'ar' ? 'الوكالات التقليدية' : 'TRADITIONAL AGENCIES'}
              </span>
              <ul className="flex flex-col gap-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>
                    {i18n.language === 'tr' 
                      ? 'Hazır şablonu kopyalayıp yükler, özel UX sunmaz.' 
                      : i18n.language === 'ar' 
                      ? 'نسخ قوالب جاهزة دون تخصيص تجربة المستخدم (UX).' 
                      : 'Copies generic templates without custom UX design.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>
                    {i18n.language === 'tr' 
                      ? 'Sayfa açılış hızı ve Core Web Vitals\'ı ihmal eder.' 
                      : i18n.language === 'ar' 
                      ? 'إهمال سرعة فتح الصفحة ومؤشرات أداء Core Web Vitals.' 
                      : 'Ignores page load speed and Core Web Vitals scores.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>
                    {i18n.language === 'tr' 
                      ? 'Pazaryeri ve depo/ERP entegrasyonundan anlamaz.' 
                      : i18n.language === 'ar' 
                      ? 'ضعف الربط البرمجي بين المتاجر ومنظومات المخزون و ERP.' 
                      : 'Lacks marketplace API & ERP warehouse automation.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>
                    {i18n.language === 'tr' 
                      ? 'İletişim katmanları yavaştır, hesap yöneticileri aracıdır.' 
                      : i18n.language === 'ar' 
                      ? 'تواصل بطيء عبر وسطاء ومدراء حسابات غير تقنيين.' 
                      : 'Slow communication through non-technical account managers.'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 2: With Samer */}
            <div className="p-5 rounded-2xl bg-teal-50/80 border border-teal-200 text-start">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block mb-3">
                {i18n.language === 'tr' ? 'SAMER İLE ÇALIŞINCA' : i18n.language === 'ar' ? 'مع المهندس سامر' : 'WITH SAMER'}
              </span>
              <ul className="flex flex-col gap-3 text-xs sm:text-sm text-slate-800 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>
                    {i18n.language === 'tr' 
                      ? 'Dönüşüm (CRO) odaklı checkout ve mobil tasarım.' 
                      : i18n.language === 'ar' 
                      ? 'تصميم مسار شراء وموبايل مخصص لرفع معدل التحويل (CRO).' 
                      : 'Conversion (CRO) optimized checkout and mobile UX.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>
                    {i18n.language === 'tr' 
                      ? '1.1s hızlı açılış ve 90+ Core Web Vitals optimizasyonu.' 
                      : i18n.language === 'ar' 
                      ? 'سرعة فتح 1.1 ثانية ومؤشر أداء Core Web Vitals 90+.' 
                      : '1.1s load speed and 90+ Core Web Vitals scores.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>
                    {i18n.language === 'tr' 
                      ? 'Shopify/İKAS ve Trendyol arası otomatik stok API\'si.' 
                      : i18n.language === 'ar' 
                      ? 'مزامنة فورية للمخزون عبر API بين شوبيفاي وإيكاس والمنصات.' 
                      : 'Automated stock sync API between Shopify/İKAS & marketplaces.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>
                    {i18n.language === 'tr' 
                      ? 'Birebir teknik uzmanla hızlı ve şeffaf iletişim.' 
                      : i18n.language === 'ar' 
                      ? 'تواصل تقني مباشر وسريع مع المهندس المنفذ بدون وسطاء.' 
                      : 'Direct, transparent communication with a senior engineer.'}
                  </span>
                </li>
              </ul>
            </div>

          </div>

          {/* Stats Column */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 text-start shadow-xs">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-teal-600 tracking-tight block">50+</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 mt-1 block">
                {i18n.language === 'tr' ? 'Teslim Edilen Proje' : i18n.language === 'ar' ? 'مشاريع مكتملة' : 'Completed Projects'}
              </span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                {i18n.language === 'tr' 
                  ? 'Shopify, İKAS ve özel React mağazaları' 
                  : i18n.language === 'ar' 
                  ? 'متاجر شوبيفاي وإيكاس وتطبيقات مخصصة' 
                  : 'Shopify, İKAS & React custom stores'}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 text-start shadow-xs">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-orange-500 tracking-tight block">%98</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 mt-1 block">
                {i18n.language === 'tr' ? 'Müşteri Memnuniyeti' : i18n.language === 'ar' ? 'رضا العملاء' : 'Client Satisfaction'}
              </span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                {i18n.language === 'tr' 
                  ? 'Doğrulanmış 5 yıldızlı Google değerlendirmeleri' 
                  : i18n.language === 'ar' 
                  ? 'تقييمات معتمدة 5 نجوم على جوجل' 
                  : 'Verified 5-star client ratings'}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 text-start shadow-xs">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight block">
                {i18n.language === 'tr' ? '5+ Yıl' : i18n.language === 'ar' ? '+5 سنوات' : '5+ Years'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 mt-1 block">
                {i18n.language === 'tr' ? 'Teknik & E-Ticaret Deneyimi' : i18n.language === 'ar' ? 'سنوات خبرة تقنية' : 'Years Experience'}
              </span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                {i18n.language === 'tr' 
                  ? 'Full-stack yazılım ve e-ticaret büyümesi' 
                  : i18n.language === 'ar' 
                  ? 'تطوير برمجي شامل ونمو التجارة الإلكترونية' 
                  : 'Full-stack software and growth'}
              </span>
            </div>
          </div>

        </div>

        {/* High-Density GEO & AI Overview Technical Architecture Table */}
        <div className="mt-14 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="mb-6 text-start">
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
              {i18n.language === 'tr' ? 'TEKNİK MİMARİ VE KARŞILAŞTIRMA' : i18n.language === 'ar' ? 'المقارنة الهندسية والتقنية' : 'TECHNICAL ARCHITECTURE COMPARISON'}
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
              {i18n.language === 'tr' 
                ? 'E-Ticaret ve Web Geliştirme Karşılaştırma Matrisi' 
                : i18n.language === 'ar' 
                ? 'مصفوفة مقارنة تطوير المتاجر وتصميم الويب' 
                : 'E-Commerce & Web Engineering Comparison Matrix'}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700">
                  <th className="p-3.5 font-bold">{i18n.language === 'tr' ? 'Kriter / Parametre' : i18n.language === 'ar' ? 'المعيار التقني' : 'Evaluation Criteria'}</th>
                  <th className="p-3.5 font-bold text-teal-800 bg-teal-50/50">{i18n.language === 'tr' ? 'Samer Allaham (Mühendislik)' : i18n.language === 'ar' ? 'سامر اللحام (هندسة مخصصة)' : 'Samer Allaham (Engineering)'}</th>
                  <th className="p-3.5 font-bold text-slate-600">{i18n.language === 'tr' ? 'Geleneksel Ajanslar' : i18n.language === 'ar' ? 'الوكالات التقليدية' : 'Traditional Agencies'}</th>
                  <th className="p-3.5 font-bold text-slate-600">{i18n.language === 'tr' ? 'Hazır Şablon Kurucusu' : i18n.language === 'ar' ? 'مطبقي القوالب الجاهزة' : 'Generic Freelancers'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-semibold text-slate-900">
                    {i18n.language === 'tr' ? 'Mobil Sayfa Hızı (PageSpeed)' : i18n.language === 'ar' ? 'سرعة الهاتف (PageSpeed)' : 'Mobile PageSpeed & Vitals'}
                  </td>
                  <td className="p-3.5 font-bold text-teal-700 bg-teal-50/30">
                    {i18n.language === 'tr' ? '90+ Skor, < 1.2s Açılış' : i18n.language === 'ar' ? '+90 نقاط، أقل من 1.2 ثانية' : '90+ Score, < 1.2s Load'}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {i18n.language === 'tr' ? '40-60 Skor, 3.5s - 6s' : i18n.language === 'ar' ? '40-60 نقاط، 3.5 - 6 ثوانٍ' : '40-60 Score, 3.5s - 6s'}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {i18n.language === 'tr' ? 'Değişken, 4s+' : i18n.language === 'ar' ? 'غير مستقر، أكثر من 4 ثوانٍ' : 'Unstable, 4s+'}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-semibold text-slate-900">
                    {i18n.language === 'tr' ? 'Dönüşüm Oranı (CRO Checkout)' : i18n.language === 'ar' ? 'تحسين التحويل (CRO Checkout)' : 'Conversion Rate (CRO Checkout)'}
                  </td>
                  <td className="p-3.5 font-bold text-teal-700 bg-teal-50/30">
                    {i18n.language === 'tr' ? 'Özel Tek Sayfa, %35+ Artış' : i18n.language === 'ar' ? 'صفحة دفع مخصصة، +35% تحويل' : 'Custom One-Page, +35% Lift'}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {i18n.language === 'tr' ? 'Varsayılan Şablon Checkout' : i18n.language === 'ar' ? 'قالب الدفع الافتراضي' : 'Default Theme Checkout'}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {i18n.language === 'tr' ? 'Müdahale Edilmez' : i18n.language === 'ar' ? 'بدون تخصيص' : 'No Optimization'}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-semibold text-slate-900">
                    {i18n.language === 'tr' ? 'Stok, ERP & Pazaryeri API' : i18n.language === 'ar' ? 'ربط المخزون و ERP والمنصات' : 'Stock, ERP & Marketplace API'}
                  </td>
                  <td className="p-3.5 font-bold text-teal-700 bg-teal-50/30">
                    {i18n.language === 'tr' ? 'Otomatik İki Yönlü Webhook' : i18n.language === 'ar' ? 'مزامنة ثنائية الاتجاه عبر Webhook' : 'Automated Bi-directional Webhooks'}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {i18n.language === 'tr' ? 'Yüksek Ek Ücretli / Dış Kaynak' : i18n.language === 'ar' ? 'تكلفة إضافية باهظة' : 'Expensive External Vendor'}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {i18n.language === 'tr' ? 'Desteklenmez (Manuel)' : i18n.language === 'ar' ? 'يدوي فقط' : 'Not Supported (Manual)'}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-semibold text-slate-900">
                    {i18n.language === 'tr' ? 'İletişim & Proje Teslimatı' : i18n.language === 'ar' ? 'التواصل والالتزام بالتسليم' : 'Direct Support & Delivery'}
                  </td>
                  <td className="p-3.5 font-bold text-teal-700 bg-teal-50/30">
                    {i18n.language === 'tr' ? 'Doğrudan Baş Mühendis, 3-7 Gün' : i18n.language === 'ar' ? 'مباشرة مع المهندس، 3-7 أيام' : 'Direct Senior Engineer, 3-7 Days'}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {i18n.language === 'tr' ? 'Müşteri Temsilcisi, 4-8 Hafta' : i18n.language === 'ar' ? 'مندوب مبيعات، 4-8 أسابيع' : 'Account Manager, 4-8 Weeks'}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {i18n.language === 'tr' ? 'Düzensiz İletişim' : i18n.language === 'ar' ? 'غير منتظم' : 'Unreliable Availability'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SERVICES SECTION (Asymmetrical Grouping)
          ───────────────────────────────────────────────────────────── */}
      <section id="hizmetler" className="px-4 sm:px-6 md:px-12 py-20 lg:py-28 max-w-[1280px] mx-auto border-t border-slate-200/80">
        
        {/* Section Title */}
        <div className="text-center mb-16 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Layers size={13} className="text-teal-600" />
            <span>{i18n.language === 'tr' ? 'ÇÖZÜMLER & HİZMETLER' : 'SERVICES & SOLUTIONS'}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t('services.title') || 'Profesyonel E-Ticaret Hizmetleri'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            {t('services.subtitle') || 'İşletmenizin büyümesini otomatikleştiren ve satışlarınızı ölçekleyen özel çözümler.'}
          </p>
        </div>

        {/* 3.1. TOP FLAGSHIP SERVICES (2 Featured Big Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {featuredServices.map((key) => (
            <ServiceCard
              key={key}
              serviceKey={key}
              serviceData={t(`services.items.${key}`, { returnObjects: true })}
              recommended={key === 'site-kurulumu'}
            />
          ))}
        </div>

        {/* 3.2. COMPANION SPECIALIZED SERVICES (3-Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companionServices.map((key) => (
            <ServiceCard
              key={key}
              serviceKey={key}
              serviceData={t(`services.items.${key}`, { returnObjects: true })}
              recommended={false}
            />
          ))}
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. PROVEN RESULTS & REAL CASE STUDIES
          ───────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 md:px-12 py-20 lg:py-24 max-w-[1280px] mx-auto border-t border-slate-200/80 text-start">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2.5">
              <TrendingUp size={13} className="text-teal-600" />
              <span>{i18n.language === 'tr' ? 'SOMUT METRİKLER' : i18n.language === 'ar' ? 'نتائج واقعية' : 'PROVEN METRICS'}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t('case_studies.title') || 'Başarı Hikayeleri & Gerçek Sonuçlar'}
            </h2>
          </div>
          <Link
            to={getLocalizedPath('/basari-hikayeleri', i18n.language)}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors"
          >
            <span>{i18n.language === 'tr' ? 'Tüm vaka analizlerini incele' : i18n.language === 'ar' ? 'عرض كافة قصص النجاح' : 'View all case studies'}</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Results Metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.isArray(caseStudies) && caseStudies.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-7 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-teal-300 transition-all duration-300">
              <div className="flex flex-col gap-3">
                <div className="inline-flex items-center justify-between">
                  <span className="font-display text-3xl sm:text-4xl font-extrabold text-teal-600 tracking-tight block">
                    {item.metric}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                    <TrendingUp size={16} />
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900">{item.client}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
              <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center text-xs text-slate-500 font-semibold">
                <span>{item.client}</span>
                <span className="text-teal-700 font-bold">{t('case_studies.results')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. INTERACTIVE AI SERVICE DEMO
          ───────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 md:px-12 py-20 lg:py-24 bg-slate-100/70 border-y border-slate-200/80">
        <div className="max-w-[1280px] mx-auto text-center">
          <div className="mb-12 flex flex-col items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} className="text-teal-600" />
              <span>{i18n.language === 'tr' ? 'CANLI DEMO' : i18n.language === 'ar' ? 'تجربة حية' : 'LIVE DEMO'}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {i18n.language === 'tr' 
                ? 'Yapay Zeka ile E-Ticaret Ürün İçeriği Oluşturun' 
                : i18n.language === 'ar' 
                ? 'أنشئ محتوى منتجات متجرك بالذكاء الاصطناعي' 
                : 'AI E-Commerce Content Generator'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl">
              {i18n.language === 'tr' 
                ? 'Geliştirdiğim AI otomasyon motorunun e-ticaret ürün açıklamalarını nasıl saniyeler içinde yazdığını canlı test edin.' 
                : i18n.language === 'ar'
                ? 'جرّب بنفسك كيف يقوم محرك الذكاء الاصطناعي المخصص بإنشاء أوصاف منتجات احترافية ومُحسَّنة للمبيعات في ثوانٍ.'
                : 'Test how our custom AI automation generates conversion-optimized e-commerce descriptions in seconds.'}
            </p>
          </div>
          <AIDemo />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. VERIFIED CUSTOMER REVIEWS CAROUSEL
          ───────────────────────────────────────────────────────────── */}
      <Reviews />

      {/* ─────────────────────────────────────────────────────────────
          7. FAQ ACCORDIONS
          ───────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 md:px-12 py-20 lg:py-28 max-w-[1280px] mx-auto">
        <div className="text-center mb-14 flex flex-col items-center gap-2.5">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t('faq.title') || 'Sıkça Sorulan Sorular'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl">
            {t('faq.subtitle') || 'Shopify, İKAS ve web geliştirme süreçleri hakkında merak edilenler.'}
          </p>
        </div>
        <FAQ />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. HIGH-CONVERSION CONTACT FORM
          ───────────────────────────────────────────────────────────── */}
      <section id="teklif-al" className="px-4 sm:px-6 md:px-12 py-20 lg:py-28 max-w-[1280px] mx-auto border-t border-slate-200/80">
        <ContactForm />
      </section>

    </div>
  );
}

