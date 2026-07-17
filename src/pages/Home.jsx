import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ServiceCard from '../components/ServiceCard';
import AIDemo from '../components/AIDemo';
import FAQ from '../components/FAQ';
import ContactForm from '../components/ContactForm';
import Reviews from '../components/Reviews';

export default function Home() {
  const { t, i18n } = useTranslation();

  const servicesKeys = ['site-kurulumu', 'optimizasyon', 'urun-gorsel', 'stok-depo', 'aylik-yonetim', 'web-gelistirme', 'ozel-yazilim', 'yapay-zeka'];
  const caseStudies = t('case_studies.items', { returnObjects: true }) || [];

  return (
    <div className="text-white min-h-screen">
      {/* SEO Configuration */}
      <SEO
        title={t('hero.badge')}
        description={t('hero.subheadline')}
        keywords="shopify site kurma, ikas e ticaret sitesi, e ticaret danışmanlığı, ürün fotoğraf düzenleme, e-ticaret optimizasyon, stok entegrasyonu"
      />

      {/* 1. HERO SECTION */}
      <section className="relative px-6 md:px-12 pt-36 pb-28 max-w-[1200px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center text-start">
          
          {/* Hero Left Column (Copy and CTAs) */}
          <div className="lg:col-span-7 flex flex-col gap-8 z-10 w-full">
            
            {/* Elegant coral greeting line */}
            <div className="flex items-center gap-3">
              <span className="text-accent text-sm font-extrabold tracking-wider uppercase">
                {i18n.language === 'tr' ? 'Merhaba.' : i18n.language === 'ar' ? 'مرحباً.' : 'Hello.'}
              </span>
              <div className="w-12 h-[1px] bg-accent" />
            </div>

            {/* Dominant H1 Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tight leading-[1.05] text-white">
              {i18n.language === 'tr' ? 'E-Ticaret & Yazılım Çözümleri Uzmanı' : i18n.language === 'ar' ? 'أخصائي التجارة الإلكترونية وحلول البرمجيات' : 'E-Commerce & Software Solutions Expert'}
            </h1>

            {/* Short Subheadline */}
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl font-medium">
              {t('hero.subheadline')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                to="/iletisim"
                className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-hover text-white font-black rounded-xl transition-colors duration-300 text-xs tracking-wider uppercase shadow-lg shadow-accent/10"
              >
                {t('contact_page.submit')}
              </Link>
              <Link
                to="/hakkimda"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-white/10 hover:border-white/20 text-white font-black rounded-xl transition-all duration-300 text-xs tracking-wider uppercase"
              >
                {t('nav.about')}
              </Link>
            </div>

            {/* Trust Badges under CTA */}
            <div className="border-t border-white/5 pt-6 mt-4">
              <span className="mono text-[9px] font-black text-neutral-400 uppercase tracking-widest block mb-3">PLATFORM PARTNERS & TECH</span>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-neutral-400 font-extrabold text-[10px] tracking-wider uppercase mono">
                <span>Shopify Partner</span>
                <span className="text-accent">•</span>
                <span>İKAS Specialist</span>
                <span className="text-accent">•</span>
                <span>React</span>
                <span className="text-accent">•</span>
                <span>Next.js</span>
                <span className="text-accent">•</span>
                <span>Full-Stack Dev</span>
                <span className="text-accent">•</span>
                <span>AI Solutions</span>
              </div>
            </div>

          </div>

          {/* Hero Right Column (Avatar and Glowing frame) */}
          <div className="lg:col-span-5 flex justify-center items-center z-10 relative w-full">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-72 lg:h-72 xl:w-80 xl:h-80 flex items-center justify-center">
              {/* Soft glow behind avatar */}
              <div className="absolute inset-0 bg-accent/10 rounded-full blur-[80px] -z-10" />
              {/* Clean concentric outline */}
              <div className="absolute inset-0 rounded-full border border-white/5" />
              <div className="absolute inset-4 rounded-full border border-accent/20" />

              {/* Avatar picture */}
              <div className="w-56 h-56 sm:w-60 sm:h-60 lg:w-60 lg:h-60 xl:w-68 xl:h-68 rounded-full overflow-hidden border-4 border-[#131b2e] bg-[#131b2e] shadow-2xl relative">
                <img
                  src="/avatar.webp"
                  alt="Samer Allaham"
                  width="240"
                  height="240"
                  fetchpriority="high"
                  decoding="async"
                  className="w-full h-full object-top object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. ABOUT ME SECTION (Clean 2-Column Grid) */}
      <section className="px-6 md:px-12 py-28 lg:py-36 max-w-[1200px] mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Bio text column */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-start">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              {i18n.language === 'tr' ? 'Hakkımda' : i18n.language === 'ar' ? 'من أنا' : 'About me'}
            </h2>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-semibold">
              {t('about_page.bio')}
            </p>
          </div>

          {/* Statistics grid column */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-8 w-full mt-4 lg:mt-0">
            <div className="bg-bg-card border border-white/5 rounded-2xl p-6 text-start hover:border-white/10 transition-colors">
              <span className="text-3xl md:text-4xl font-black text-accent tracking-tight block">50+</span>
              <span className="text-[10px] md:text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1 block">
                {i18n.language === 'tr' ? 'Proje' : 'Projects'}
              </span>
            </div>
            <div className="bg-bg-card border border-white/5 rounded-2xl p-6 text-start hover:border-white/10 transition-colors">
              <span className="text-3xl md:text-4xl font-black text-accent tracking-tight block">98%</span>
              <span className="text-[10px] md:text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1 block">
                {i18n.language === 'tr' ? 'Memnuniyet' : 'Satisfaction'}
              </span>
            </div>
            <div className="bg-bg-card border border-white/5 rounded-2xl p-6 text-start hover:border-white/10 transition-colors">
              <span className="text-3xl md:text-4xl font-black text-accent tracking-tight block">5+</span>
              <span className="text-[10px] md:text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1 block">
                {i18n.language === 'tr' ? 'Yıl Deneyim' : 'Years Exp'}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section className="px-6 md:px-12 py-28 lg:py-36 max-w-[1200px] mx-auto border-t border-white/5">
        <div className="text-center mb-20 flex flex-col items-center gap-3">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{t('services.title')}</h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-xl font-semibold leading-relaxed">{t('services.subtitle')}</p>
        </div>

        {/* Dynamic Service Grid mapping with Recommended logic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesKeys.map((key) => (
            <ServiceCard
              key={key}
              serviceKey={key}
              serviceData={t(`services.items.${key}`, { returnObjects: true })}
              recommended={key === 'site-kurulumu'}
            />
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE AI DEMO */}
      <section className="px-6 md:px-12 py-28 lg:py-36 bg-[#0e1423]/20 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="mb-16 flex flex-col items-center gap-3">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              {i18n.language === 'tr' ? 'Yapay Zeka Servisleri' : 'AI Services Showcase'}
            </h2>
          </div>
          <AIDemo />
        </div>
      </section>

      {/* 5. SUCCESS METRICS CASE STUDIES */}
      <section className="px-6 md:px-12 py-28 lg:py-36 max-w-[1200px] mx-auto text-start">
        <div className="flex flex-col gap-3 mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{t('case_studies.title')}</h2>
        </div>

        {/* Results Metrics grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {Array.isArray(caseStudies) && caseStudies.map((item, idx) => (
            <div key={idx} className="bg-bg-card border border-white/5 rounded-3xl p-8 flex flex-col justify-between hover:border-white/10 hover:scale-[1.02] transition-all duration-300">
              <div className="flex flex-col gap-4">
                <span className="mono text-2xl font-black text-accent tracking-tight block">
                  {item.metric}
                </span>
                <h3 className="text-lg font-black text-white">{item.client}</h3>
                <p className="text-neutral-400 text-xs md:text-sm font-semibold leading-relaxed">{item.desc}</p>
              </div>
              <div className="border-t border-white/5 pt-6 mt-8 flex justify-between items-center">
                <span className="mono text-[8px] font-black text-neutral-400 uppercase tracking-widest">IMPACT // 0{idx + 1}</span>
                <span className="text-neutral-400 text-[10px] font-bold">{t('case_studies.results')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5.5. CUSTOMER REVIEWS CAROUSEL */}
      <Reviews />

      {/* 6. FAQ ACCORDIONS */}
      <section className="px-6 md:px-12 py-28 lg:py-36 bg-[#0e1423]/20 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20 flex flex-col items-center gap-3">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{t('faq.title')}</h2>
            <p className="text-neutral-400 text-sm md:text-base font-semibold">{t('faq.subtitle')}</p>
          </div>
          <FAQ />
        </div>
      </section>

      {/* 7. CONTACT FORM */}
      <section className="px-6 md:px-12 py-28 lg:py-36 max-w-[1200px] mx-auto">
        <ContactForm />
      </section>
    </div>
  );
}
