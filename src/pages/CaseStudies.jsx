import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingUp, Cpu, Flame } from 'lucide-react';
import SEO from '../components/SEO';

export default function CaseStudies() {
  const { t, i18n } = useTranslation();
  const caseStudies = t('case_studies.items', { returnObjects: true }) || [];

  const icons = [<TrendingUp size={24} />, <Flame size={24} />, <Cpu size={24} />];

  return (
    <div className="pt-32 pb-24 text-white min-h-screen text-start">
      <SEO
        title={t('nav.case_studies')}
        description={t('case_studies.subtitle')}
        keywords="e ticaret danışmanlığı, shopify site kurma, ikas e ticaret sitesi, başarı hikayeleri"
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="mono text-[#ff6b6b] text-[9px] font-black uppercase tracking-widest block mb-4">
            // CASE_STUDIES_ARCHIVE
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
            {t('case_studies.title')}
          </h1>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed font-semibold">
            {t('case_studies.subtitle')}
          </p>
        </div>

        {/* Rich Case Studies Grid */}
        <div className="flex flex-col gap-12">
          {Array.isArray(caseStudies) && caseStudies.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#131b2e] border border-white/5 rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:border-white/10 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff6b6b]/5 rounded-full blur-[60px] pointer-events-none" />
              
              {/* Metric Callout */}
              <div className="lg:col-span-4 flex flex-col justify-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ff6b6b]/10 flex items-center justify-center text-[#ff6b6b] mb-2">
                  {icons[idx] || <TrendingUp size={24} />}
                </div>
                <span className="mono text-[10px] font-black text-neutral-500 uppercase tracking-widest">// METRİC_BREAKTHROUGH</span>
                <span className="text-3xl md:text-4xl font-black text-[#ff6b6b] tracking-tight leading-none">
                  {item.metric}
                </span>
              </div>

              {/* Story Description */}
              <div className="lg:col-span-8 flex flex-col justify-between h-full text-start">
                <div>
                  <h3 className="text-2xl font-black text-white mb-4">
                    {item.client}
                  </h3>
                  <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-semibold mb-8">
                    {item.desc}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5">
                  <span className="mono text-[8px] font-black text-neutral-500 uppercase tracking-widest">
                    SYSTEM_STABILIZER // CASE_00{idx + 1}
                  </span>
                  <Link
                    to="/iletisim"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-[#ff6b6b] hover:text-white text-white text-xs font-bold rounded-xl transition-all"
                  >
                    {i18n.language === 'tr' ? 'Benzer Proje Başlat' : i18n.language === 'ar' ? 'ابدأ مشروعاً مشابهاً' : 'Start Similar Project'}
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
