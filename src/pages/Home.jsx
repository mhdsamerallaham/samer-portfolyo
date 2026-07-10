import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowRight, Star, ShieldCheck, Zap, Layers } from 'lucide-react';
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
    <div className="pt-24 min-h-screen text-white">
      {/* SEO configuration for Homepage */}
      <SEO
        title={t('hero.badge')}
        description={t('hero.subheadline')}
        keywords="shopify site kurma, ikas e ticaret sitesi, e ticaret danışmanlığı, ürün fotoğraf düzenleme, e-ticaret optimizasyon, stok entegrasyonu"
      />

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-16 pb-20 max-w-[1440px] mx-auto flex flex-col items-center text-center overflow-hidden">
        {/* Glowing background highlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00ffaa]/5 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none" />

        <div className="flex flex-col items-center gap-8 max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00ffaa]/5 border border-[#00ffaa]/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-[#00ffaa] rounded-full animate-ping" />
            <span className="mono text-[9px] font-black tracking-widest uppercase text-[#00ffaa]">
              {t('hero.badge')}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-white">
            {t('hero.headline')}
          </h1>

          {/* Subheadline */}
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl font-medium leading-relaxed">
            {t('hero.subheadline')}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link
              to="/iletisim"
              className="px-8 py-4 bg-[#00ffaa] text-black font-black rounded-xl hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,170,0.2)] transition-all duration-300 text-xs tracking-wider uppercase"
            >
              {t('hero.cta_primary')}
            </Link>
            <Link
              to="/hizmetler"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 transition-all duration-300 text-xs tracking-wider uppercase"
            >
              {t('hero.cta_secondary')}
            </Link>
          </div>
        </div>

        {/* Tech Logos Banner */}
        <div className="w-full mt-24 border-y border-white/5 py-8 opacity-75">
          <p className="mono text-[8px] font-black text-neutral-500 tracking-[0.25em] uppercase mb-6">// INTEGRATED_SYSTEM_STABILIZERS</p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-6 text-neutral-400 font-black text-sm tracking-widest uppercase mono">
            <span className="hover:text-white transition-colors">SHOPIFY</span>
            <span className="hover:text-white transition-colors">İKAS</span>
            <span className="hover:text-white transition-colors">REACT</span>
            <span className="hover:text-white transition-colors">NODE.JS</span>
            <span className="hover:text-white transition-colors">PYTHON</span>
            <span className="hover:text-white transition-colors">REST API</span>
          </div>
        </div>
      </section>

      {/* Why Me / Positioning Section */}
      <section className="px-6 md:px-12 py-24 bg-[#080808] border-y border-white/5">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="mono text-[#00ffaa] text-[9px] font-black uppercase tracking-widest">
              // {t('positioning.tag')}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {t('positioning.title')}
            </h2>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-semibold">
              {t('positioning.desc')}
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Trust feature blocks */}
            <div className="p-6 bg-[#0c0c0c] border border-white/5 rounded-2xl flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00ffaa]/10 flex items-center justify-center text-[#00ffaa]"><ShieldCheck size={20} /></div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">{i18n.language === 'tr' ? 'Türkiye Merkezli' : 'Turkey-Based'}</h4>
              <p className="text-neutral-500 text-[11px] font-semibold leading-relaxed">{i18n.language === 'tr' ? 'İstanbul merkezli, hızlı destek ve faturalandırılabilir profesyonel hizmet.' : 'Istanbul HQ, reliable consulting, and invoice-ready agreements.'}</p>
            </div>
            <div className="p-6 bg-[#0c0c0c] border border-white/5 rounded-2xl flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00ffaa]/10 flex items-center justify-center text-[#00ffaa]"><Zap size={20} /></div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">{i18n.language === 'tr' ? 'Yazılım Geliştirici' : 'Developer Mindset'}</h4>
              <p className="text-neutral-500 text-[11px] font-semibold leading-relaxed">{i18n.language === 'tr' ? 'Hazır kalıplar değil, iş akışınızı hızlandıracak kod entegrasyonları.' : 'No simple page building; custom-developed APIs and integrations.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-6 md:px-12 py-24 max-w-[1440px] mx-auto">
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span className="mono text-[#00ffaa] text-[9px] font-black uppercase tracking-widest">// SERVICES_CATALOGUE</span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{t('services.title')}</h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-xl font-semibold leading-relaxed">{t('services.subtitle')}</p>
        </div>

        {/* Services Grid */}
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

      {/* Interactive AI Generator Section */}
      <section className="px-6 md:px-12 py-24 bg-[#080808] border-y border-white/5">
        <div className="max-w-[1440px] mx-auto text-center">
          <div className="mb-12 flex flex-col items-center gap-3">
            <span className="mono text-[#00ffaa] text-[9px] font-black uppercase tracking-widest">// AI_LAB_EXPERIMENT</span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{i18n.language === 'tr' ? 'Etkileşimli Yapay Zeka Deneyimi' : 'Interactive AI Laboratory'}</h2>
          </div>
          <AIDemo />
        </div>
      </section>

      {/* Case Studies / Success metrics Section */}
      <section className="px-6 md:px-12 py-24 max-w-[1440px] mx-auto text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="flex flex-col gap-3">
            <span className="mono text-[#00ffaa] text-[9px] font-black uppercase tracking-widest">// CASE_STUDIES</span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{t('case_studies.title')}</h2>
          </div>
          <Link
            to="/basari-hikayeleri"
            className="flex items-center gap-2 text-xs font-black mono text-[#00ffaa] hover:translate-x-1.5 transition-transform"
          >
            TÜM HİKAYELERİ GÖR
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {Array.isArray(caseStudies) && caseStudies.map((item, idx) => (
            <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 flex flex-col justify-between hover:border-white/10 transition-all duration-300">
              <div className="flex flex-col gap-4">
                <span className="mono text-[8px] font-black text-[#00ffaa] bg-[#00ffaa]/5 border border-[#00ffaa]/10 px-3 py-1 rounded-full w-fit">
                  {item.metric}
                </span>
                <h4 className="text-lg font-black text-white">{item.client}</h4>
                <p className="text-neutral-400 text-xs md:text-sm font-semibold leading-relaxed">{item.desc}</p>
              </div>
              <div className="border-t border-white/5 pt-6 mt-8 flex justify-between items-center">
                <span className="mono text-[8px] font-black text-neutral-500 uppercase tracking-widest">METRIC_IMPACT // 0{idx + 1}</span>
                <span className="text-neutral-400 text-[10px] font-bold">{t('case_studies.results')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 md:px-12 py-24 bg-[#080808] border-y border-white/5">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16 flex flex-col items-center gap-3">
            <span className="mono text-[#00ffaa] text-[9px] font-black uppercase tracking-widest">// FAQ_ACCORDION</span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{t('faq.title')}</h2>
            <p className="text-neutral-400 text-sm md:text-base font-semibold">{t('faq.subtitle')}</p>
          </div>
          <FAQ />
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 md:px-12 py-24 max-w-[1440px] mx-auto">
        <ContactForm />
      </section>
    </div>
  );
}
