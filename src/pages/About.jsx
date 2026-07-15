import { useTranslation } from 'react-i18next';
import { Award, GraduationCap, Compass } from 'lucide-react';
import SEO from '../components/SEO';

export default function About() {
  const { t, i18n } = useTranslation();

  const values = t('about_page.values', { returnObjects: true }) || [];

  const skillGroups = [
    { title: i18n.language === 'tr' ? 'E-Ticaret' : i18n.language === 'ar' ? 'التجارة الإلكترونية' : 'E-Commerce', items: ['Shopify Liquid', 'İKAS API', 'Custom Checkout', 'Payment Integration', 'SEO Auditing'] },
    { title: i18n.language === 'tr' ? 'Arka Yüz & Otomasyon' : i18n.language === 'ar' ? 'الخلفية والأتمتة' : 'Backend & Automation', items: ['Node.js', 'Python', 'RESTful APIs', 'Webhooks', 'ERP Sync'] },
    { title: i18n.language === 'tr' ? 'Ön Yüz & Tasarım' : i18n.language === 'ar' ? 'الواجهات والتصميم' : 'Frontend & Design', items: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Responsive UX'] },
    { title: i18n.language === 'tr' ? 'AI & Yapay Zeka' : i18n.language === 'ar' ? 'الذكاء الاصطناعي' : 'AI & Machine Learning', items: ['GPT / Gemini API', 'Chatbot Development', 'Prompt Engineering', 'AI Automation', 'Data Analysis'] }
  ];

  return (
    <div className="pt-32 pb-24 text-white min-h-screen text-start">
      <SEO
        title={t('nav.about')}
        description={t('about_page.bio')}
        keywords="samer allaham, e ticaret uzmanı, shopify yazılımcı, ikas uzmanı, yazılım geliştirici"
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Biography Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight">
              {t('about_page.title')}
            </h1>
            <h2 className="text-xl md:text-2xl font-black text-[#ff6b6b] tracking-tight">
              {t('about_page.subtitle')}
            </h2>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-semibold">
              {t('about_page.bio')}
            </p>
          </div>
          
          <div className="lg:col-span-4 bg-[#131b2e] border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col gap-6 w-full text-start">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b6b]/5 rounded-full blur-[40px] pointer-events-none" />
            <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-[#ff6b6b]/20 p-1.5 bg-[#ff6b6b]/5 relative mx-auto shadow-2xl">
              <img src="/avatar.webp" alt="Samer Allaham" className="w-full h-full object-top object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="text-center">
              <span className="mono text-[10px] font-black text-white uppercase tracking-wider">SAMER ALLAHAM</span>
              <span className="mono text-[8px] text-[#ff6b6b] tracking-widest block mt-1 uppercase">SOFTWARE ARCHITECT</span>
            </div>
            <div className="border-t border-white/5 pt-6 flex flex-col gap-2 text-xs font-semibold text-neutral-400">
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-white">Turkey</span>
              </div>
              <div className="flex justify-between">
                <span>Specialization:</span>
                <span className="text-[#ff6b6b]">E-Commerce</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Focus Grid */}
        <div className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skillGroups.map((group, i) => (
              <div key={i} className="bg-[#131b2e] border border-white/5 rounded-3xl p-8 flex flex-col gap-6">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span className="mono text-xs text-[#ff6b6b]">0{i + 1}</span>
                  {group.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {group.items.map((item, idx) => (
                    <li key={idx} className="text-xs text-neutral-400 font-semibold flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#ff6b6b] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Work Principles Section */}
        <div className="border-t border-white/5 pt-20">
          <div className="text-center mb-16 flex flex-col items-center gap-3">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">{t('about_page.values_title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-start">
            {Array.isArray(values) && values.map((val, idx) => (
              <div key={idx} className="p-8 bg-[#131b2e] border border-white/5 rounded-3xl flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#ff6b6b]/10 flex items-center justify-center text-[#ff6b6b]">
                  {idx === 0 ? <Compass size={20} /> : idx === 1 ? <Award size={20} /> : <GraduationCap size={20} />}
                </div>
                <h3 className="text-base font-black text-white">{val.title}</h3>
                <p className="text-neutral-400 text-xs md:text-sm font-semibold leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
