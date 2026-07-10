import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ServiceCard from '../components/ServiceCard';
import AIDemo from '../components/AIDemo';
import FAQ from '../components/FAQ';
import ContactForm from '../components/ContactForm';

export default function Home() {
  const { t, i18n } = useTranslation();

  const servicesKeys = ['site-kurulumu', 'optimizasyon', 'urun-gorsel', 'stok-depo', 'aylik-yonetim'];
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
      <section className="relative px-6 md:px-12 pt-32 pb-24 max-w-[1200px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center text-start">
          
          {/* Hero Left Column (Copy and CTAs) */}
          <div className="lg:col-span-7 flex flex-col gap-6 z-10 w-full">
            
            {/* Localized Hello greeting */}
            <div className="flex items-center gap-3">
              <span className="text-[#ff6b6b] text-base font-extrabold tracking-wider uppercase">
                {i18n.language === 'tr' ? 'Merhaba.' : i18n.language === 'ar' ? 'مرحباً.' : 'Hello.'}
              </span>
              <div className="w-12 h-[2px] bg-[#ff6b6b]" />
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-300 -mt-2">
              {i18n.language === 'tr' ? "Ben Samer" : i18n.language === 'ar' ? "أنا سامر" : "I'm Samer"}
            </h2>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.15] text-white">
              {i18n.language === 'tr' ? 'E-Ticaret Sistemleri & Büyüme Uzmanı' : i18n.language === 'ar' ? 'أخصائي أنظمة التجارة والنمو' : 'E-Commerce Systems & Growth Specialist'}
            </h1>

            {/* Subheadline description */}
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl font-medium">
              {t('hero.subheadline')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                to="/iletisim"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-black rounded-xl transition-colors duration-300 text-xs tracking-wider uppercase"
              >
                {t('contact_page.submit')}
              </Link>
              <Link
                to="/hakkimda"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-white/20 hover:border-white/40 text-white font-black rounded-xl transition-all duration-300 text-xs tracking-wider uppercase"
              >
                {t('nav.about')}
              </Link>
            </div>
          </div>

          {/* Hero Right Column (Avatar and Glowing frame) */}
          <div className="lg:col-span-5 flex justify-center items-center z-10 relative w-full">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-72 lg:h-72 xl:w-80 xl:h-80 flex items-center justify-center">
              {/* Soft glow behind avatar */}
              <div className="absolute inset-0 bg-[#ff6b6b]/10 rounded-full blur-[80px] -z-10" />
              {/* Concentric clean circles matching image */}
              <div className="absolute inset-0 rounded-full border-2 border-[#ff6b6b]/20" />
              <div className="absolute inset-4 rounded-full border border-white/5" />

              {/* Avatar picture */}
              <div className="w-56 h-56 sm:w-60 sm:h-60 lg:w-60 lg:h-60 xl:w-68 xl:h-68 rounded-full overflow-hidden border-4 border-[#131b2e] bg-[#131b2e] shadow-2xl relative">
                <img
                  src="/avatar.png"
                  alt="Samer Allaham"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 scale-105"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. HORIZONTAL TECH STACK ROW */}
      <section className="w-full border-y border-white/5 bg-[#111622]/30 py-6">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex justify-center lg:justify-between items-center flex-wrap gap-6">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-neutral-400 font-extrabold text-[10px] md:text-xs tracking-widest uppercase mono">
            <span>Shopify</span>
            <span className="text-[#ff6b6b]">•</span>
            <span>İKAS</span>
            <span className="text-[#ff6b6b]">•</span>
            <span>Node.js</span>
            <span className="text-[#ff6b6b]">•</span>
            <span>Python</span>
            <span className="text-[#ff6b6b]">•</span>
            <span>React</span>
            <span className="text-[#ff6b6b]">•</span>
            <span>Next.js</span>
            <span className="text-[#ff6b6b]">•</span>
            <span>API Integration</span>
          </div>
        </div>
      </section>

      {/* 3. ABOUT ME / PILLARS SECTION */}
      <section className="px-6 md:px-12 py-28 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Bio column: Renders first on mobile (order-1), second on desktop (lg:order-2) */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-start order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              {i18n.language === 'tr' ? 'Hakkımda' : i18n.language === 'ar' ? 'من أنا' : 'About me'}
            </h2>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-semibold">
              {t('about_page.bio')}
            </p>

            {/* Statistics grid */}
            <div className="grid grid-cols-3 gap-6 border-t border-white/5 pt-8 mt-4">
              <div className="flex flex-col text-start">
                <span className="text-3xl md:text-4xl font-black text-[#ff6b6b] tracking-tight">50+</span>
                <span className="text-[10px] md:text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1">
                  {i18n.language === 'tr' ? 'Proje' : 'Projects'}
                </span>
              </div>
              <div className="flex flex-col text-start">
                <span className="text-3xl md:text-4xl font-black text-[#ff6b6b] tracking-tight">98%</span>
                <span className="text-[10px] md:text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1">
                  {i18n.language === 'tr' ? 'Memnuniyet' : 'Satisfaction'}
                </span>
              </div>
              <div className="flex flex-col text-start">
                <span className="text-3xl md:text-4xl font-black text-[#ff6b6b] tracking-tight">5+</span>
                <span className="text-[10px] md:text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1">
                  {i18n.language === 'tr' ? 'Yıl Deneyim' : 'Years Exp'}
                </span>
              </div>
            </div>
          </div>

          {/* Pillars column: Renders second on mobile (order-2), first on desktop (lg:order-1) */}
          <div className="lg:col-span-5 flex flex-col gap-10 text-start relative ps-8 order-2 lg:order-1 mt-8 lg:mt-0">
            {/* Clean timeline vertical line */}
            <div className="absolute start-0 top-2 bottom-2 w-[1px] bg-white/10" />

            {/* Pillar 1 */}
            <div className="relative group">
              <div className="absolute start-[-35px] top-1.5 w-2 h-2 rounded-full bg-[#ff6b6b] shadow-[0_0_10px_#ff6b6b]" />
              <h4 className="text-base font-bold text-white uppercase tracking-wide">
                {t('services.items.site-kurulumu.title')}
              </h4>
            </div>

            {/* Pillar 2 */}
            <div className="relative group">
              <div className="absolute start-[-35px] top-1.5 w-2 h-2 rounded-full bg-[#ff6b6b] shadow-[0_0_10px_#ff6b6b]" />
              <h4 className="text-base font-bold text-white uppercase tracking-wide">
                {t('services.items.stok-depo.title')}
              </h4>
            </div>

            {/* Pillar 3 */}
            <div className="relative group">
              <div className="absolute start-[-35px] top-1.5 w-2 h-2 rounded-full bg-[#ff6b6b] shadow-[0_0_10px_#ff6b6b]" />
              <h4 className="text-base font-bold text-white uppercase tracking-wide">
                {t('services.items.optimizasyon.title')}
              </h4>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SERVICES PACKAGES */}
      <section className="px-6 md:px-12 py-24 max-w-[1200px] mx-auto border-t border-white/5">
        <div className="text-center mb-16 flex flex-col items-center gap-3">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{t('services.title')}</h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-xl font-semibold leading-relaxed">{t('services.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesKeys.map((key) => (
            <ServiceCard
              key={key}
              serviceKey={key}
              serviceData={t(`services.items.${key}`, { returnObjects: true })}
            />
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE AI DEMO */}
      <section className="px-6 md:px-12 py-24 bg-[#0e1423]/30 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="mb-12 flex flex-col items-center gap-3">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{i18n.language === 'tr' ? 'Yapay Zeka Servisleri' : 'AI Services Showcase'}</h2>
          </div>
          <AIDemo />
        </div>
      </section>

      {/* 6. SUCCESS METRICS CASE STUDIES */}
      <section className="px-6 md:px-12 py-24 max-w-[1200px] mx-auto text-start">
        <div className="flex flex-col gap-3 mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{t('case_studies.title')}</h2>
        </div>

        {/* Results Metrics grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {Array.isArray(caseStudies) && caseStudies.map((item, idx) => (
            <div key={idx} className="bg-[#131b2e] border border-white/5 rounded-3xl p-8 flex flex-col justify-between hover:border-white/10 transition-all duration-300">
              <div className="flex flex-col gap-4">
                <span className="mono text-[9px] font-black text-[#ff6b6b] bg-[#ff6b6b]/5 border border-[#ff6b6b]/10 px-3 py-1 rounded-full w-fit">
                  {item.metric}
                </span>
                <h4 className="text-lg font-black text-white">{item.client}</h4>
                <p className="text-neutral-400 text-xs md:text-sm font-semibold leading-relaxed">{item.desc}</p>
              </div>
              <div className="border-t border-white/5 pt-6 mt-8 flex justify-between items-center">
                <span className="mono text-[8px] font-black text-neutral-500 uppercase tracking-widest">IMPACT // 0{idx + 1}</span>
                <span className="text-neutral-400 text-[10px] font-bold">{t('case_studies.results')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ ACCORDIONS */}
      <section className="px-6 md:px-12 py-24 bg-[#0e1423]/30 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 flex flex-col items-center gap-3">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{t('faq.title')}</h2>
            <p className="text-neutral-400 text-sm md:text-base font-semibold">{t('faq.subtitle')}</p>
          </div>
          <FAQ />
        </div>
      </section>

      {/* 8. CONTACT FORM */}
      <section className="px-6 md:px-12 py-24 max-w-[1200px] mx-auto">
        <ContactForm />
      </section>
    </div>
  );
}
