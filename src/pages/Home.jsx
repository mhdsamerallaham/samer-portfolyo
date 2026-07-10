import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Globe, MessageSquare, Plus, ArrowUpRight } from 'lucide-react';
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
      <section className="relative px-6 md:px-12 pt-32 pb-20 max-w-[1280px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          
          {/* Hero Left Column (Copy and CTAs) */}
          <div className="lg:col-span-7 flex flex-col gap-6 z-10">
            
            {/* Localized Hello greeting */}
            <div className="flex flex-col gap-1">
              <span className="text-[#ff6b6b] text-xl font-black tracking-wider uppercase">
                {i18n.language === 'tr' ? 'Merhaba.' : i18n.language === 'ar' ? 'مرحباً.' : 'Hello.'}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-300">
                {i18n.language === 'tr' ? "Ben Samer" : i18n.language === 'ar' ? "أنا سامر" : "I'm Samer"}
              </h2>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              {i18n.language === 'tr' ? 'E-Ticaret Sistemleri ve Büyüme Uzmanı' : i18n.language === 'ar' ? 'أخصائي أنظمة التجارة والنمو' : 'E-Commerce Systems & Growth Specialist'}
            </h1>

            {/* Subheadline description */}
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl font-medium">
              {t('hero.subheadline')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                to="/iletisim"
                className="px-8 py-3.5 bg-[#ff6b6b] text-white font-black rounded-xl hover:bg-[#ff5252] transition-colors duration-300 text-xs tracking-wider uppercase"
              >
                {t('contact_page.submit')}
              </Link>
              <Link
                to="/hakkimda"
                className="px-8 py-3.5 bg-transparent border border-white/20 text-white font-black rounded-xl hover:bg-white/5 transition-all duration-300 text-xs tracking-wider uppercase"
              >
                {t('nav.about')}
              </Link>
            </div>
          </div>

          {/* Hero Right Column (Avatar and Glowing frame) */}
          <div className="lg:col-span-5 flex justify-center items-center z-10 relative">
            <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
              {/* Coral Glowing Ring Background (Matches image) */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#ff6b6b]/20 animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border-2 border-[#ff6b6b]/40" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#ff6b6b]/10 to-transparent rounded-full blur-2xl -z-10" />

              {/* Avatar picture */}
              <div className="w-60 h-60 md:w-68 md:h-68 rounded-full overflow-hidden border-4 border-white/5 bg-[#131b2e] shadow-2xl relative">
                <img
                  src="/avatar.png"
                  alt="Samer Allaham"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 scale-105"
                />
              </div>

              {/* Status active badge */}
              <div className="absolute bottom-2 right-6 px-4 py-1.5 bg-[#0b0f19] border border-[#ff6b6b]/30 rounded-full shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#ff6b6b] rounded-full animate-ping" />
                  <span className="mono text-[8px] font-black tracking-widest uppercase text-[#ff6b6b]">
                    ONLINE_
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. HORIZONTAL TECH STACK ROW (Immediately below hero, matching image) */}
      <section className="w-full border-y border-white/5 bg-[#0e1423]/50 py-5">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-wrap justify-between items-center gap-6">
          <span className="mono text-[8px] font-black text-neutral-500 tracking-[0.2em]">// POWERED_BY</span>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-neutral-400 font-extrabold text-[10px] md:text-xs tracking-wider uppercase mono">
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
            <span>REST API</span>
          </div>
        </div>
      </section>

      {/* 3. ABOUT ME / PILLARS SECTION */}
      <section className="px-6 md:px-12 py-24 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Vertical Service Pillars (Matches image layout) */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left relative pl-8 border-l-2 border-white/5">
            <span className="mono text-[#ff6b6b] text-[9px] font-black uppercase tracking-widest block mb-2">
              // SERVICE_PILLARS
            </span>

            {/* Pillar 1 */}
            <div className="relative group">
              {/* Connecting point dot */}
              <div className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#0b0f19] border-2 border-[#ff6b6b] group-hover:bg-[#ff6b6b] transition-colors" />
              <div className="flex flex-col gap-1">
                <h4 className="text-base font-bold text-white uppercase tracking-wide">
                  {t('services.items.site-kurulumu.title')}
                </h4>
                <p className="text-neutral-500 text-xs leading-relaxed font-semibold">
                  Shopify & İKAS Setup, custom checkouts, payment systems mapping.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="relative group mt-4">
              <div className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#0b0f19] border-2 border-[#ff6b6b] group-hover:bg-[#ff6b6b] transition-colors" />
              <div className="flex flex-col gap-1">
                <h4 className="text-base font-bold text-white uppercase tracking-wide">
                  {t('services.items.stok-depo.title')}
                </h4>
                <p className="text-neutral-500 text-xs leading-relaxed font-semibold">
                  Multi-channel stock synchronization, POS/ERP links, microservice structures.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="relative group mt-4">
              <div className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#0b0f19] border-2 border-[#ff6b6b] group-hover:bg-[#ff6b6b] transition-colors" />
              <div className="flex flex-col gap-1">
                <h4 className="text-base font-bold text-white uppercase tracking-wide">
                  {t('services.items.optimizasyon.title')}
                </h4>
                <p className="text-neutral-500 text-xs leading-relaxed font-semibold">
                  Page load speeds, conversion rate analysis (CRO), Core Web Vitals optimization.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Bio text & Metrics (Matches image layout) */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <span className="mono text-[#ff6b6b] text-[9px] font-black uppercase tracking-widest block">
              // PROFILE_OVERVIEW
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {i18n.language === 'tr' ? 'Hakkımda' : i18n.language === 'ar' ? 'من أنا' : 'About me'}
            </h2>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-semibold">
              {t('about_page.bio')}
            </p>

            {/* Statistics grid (Matches image style exactly) */}
            <div className="grid grid-cols-3 gap-6 border-t border-white/5 pt-8 mt-4">
              <div className="flex flex-col text-left">
                <span className="text-3xl md:text-4xl font-black text-[#ff6b6b] tracking-tight">50+</span>
                <span className="text-[10px] md:text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1">
                  {i18n.language === 'tr' ? 'Proje' : 'Projects'}
                </span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-3xl md:text-4xl font-black text-[#ff6b6b] tracking-tight">98%</span>
                <span className="text-[10px] md:text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1">
                  {i18n.language === 'tr' ? 'Memnuniyet' : 'Satisfaction'}
                </span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-3xl md:text-4xl font-black text-[#ff6b6b] tracking-tight">5+</span>
                <span className="text-[10px] md:text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1">
                  {i18n.language === 'tr' ? 'Yıl Deneyim' : 'Years Exp'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SERVICES PACKAGES */}
      <section className="px-6 md:px-12 py-24 max-w-[1280px] mx-auto border-t border-white/5">
        <div className="text-center mb-16 flex flex-col items-center gap-3">
          <span className="mono text-[#ff6b6b] text-[9px] font-black uppercase tracking-widest">// SERVICES_PRICING</span>
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
        <div className="max-w-[1280px] mx-auto text-center">
          <div className="mb-12 flex flex-col items-center gap-3">
            <span className="mono text-[#ff6b6b] text-[9px] font-black uppercase tracking-widest">// AUTOMATION_LAB</span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{i18n.language === 'tr' ? 'Yapay Zeka Servisleri' : 'AI Services Showcase'}</h2>
          </div>
          <AIDemo />
        </div>
      </section>

      {/* 6. SUCCESS METRICS CASE STUDIES */}
      <section className="px-6 md:px-12 py-24 max-w-[1280px] mx-auto text-left">
        <div className="flex justify-between items-end mb-16">
          <div className="flex flex-col gap-3">
            <span className="mono text-[#ff6b6b] text-[9px] font-black uppercase tracking-widest">// RESULTS_DELIVERED</span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{t('case_studies.title')}</h2>
          </div>
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
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16 flex flex-col items-center gap-3">
            <span className="mono text-[#ff6b6b] text-[9px] font-black uppercase tracking-widest">// FAQ</span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{t('faq.title')}</h2>
            <p className="text-neutral-400 text-sm md:text-base font-semibold">{t('faq.subtitle')}</p>
          </div>
          <FAQ />
        </div>
      </section>

      {/* 8. CONTACT FORM */}
      <section className="px-6 md:px-12 py-24 max-w-[1280px] mx-auto">
        <ContactForm />
      </section>
    </div>
  );
}
