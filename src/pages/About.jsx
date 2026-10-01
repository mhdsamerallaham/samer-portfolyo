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
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 text-start">
      <SEO
        title={t('nav.about')}
        description={t('about_page.bio')}
        keywords="samer allaham, e ticaret uzmanı, shopify yazılımcı, ikas uzmanı, yazılım geliştirici, fatih web tasarımcı"
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Biography Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
          <div className="lg:col-span-8 flex flex-col gap-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider w-fit">
              <Award size={13} className="text-teal-600" />
              <span>{i18n.language === 'tr' ? 'MÜHENDİS PROFİLİ' : i18n.language === 'ar' ? 'نبذة عن المهندس' : 'ENGINEER PROFILE'}</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {t('about_page.title')}
            </h1>
            <h2 className="text-lg sm:text-xl font-bold text-teal-700 tracking-tight">
              {t('about_page.subtitle')}
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">
              {t('about_page.bio')}
            </p>
          </div>
          
          <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-7 shadow-xs flex flex-col gap-5 w-full text-start">
            <div className="w-36 h-36 rounded-2xl overflow-hidden border-2 border-teal-500/20 bg-slate-100 mx-auto shadow-sm">
              <img 
                src="/avatar.webp" 
                alt="Samer Allaham" 
                width="144" 
                height="144" 
                className="w-full h-full object-cover object-center" 
              />
            </div>
            <div className="text-center">
              <span className="font-display font-extrabold text-base text-slate-900 uppercase tracking-tight block">SAMER ALLAHAM</span>
              <span className="text-xs font-bold text-teal-600 tracking-wider block mt-0.5 uppercase">
                {i18n.language === 'tr' ? 'FULL-STACK MÜHENDİS & E-TİCARET' : i18n.language === 'ar' ? 'مهندس برمجيات وتجارة إلكترونية' : 'FULL-STACK & E-COMMERCE'}
              </span>
            </div>
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-2 text-xs font-medium text-slate-600">
              <div className="flex justify-between">
                <span>{i18n.language === 'tr' ? 'Konum:' : i18n.language === 'ar' ? 'الموقع:' : 'Location:'}</span>
                <span className="font-bold text-slate-900">İstanbul, Fatih / TR</span>
              </div>
              <div className="flex justify-between">
                <span>{i18n.language === 'tr' ? 'Uzmanlık:' : i18n.language === 'ar' ? 'التخصص:' : 'Specialization:'}</span>
                <span className="font-bold text-teal-700">Shopify & İKAS & React</span>
              </div>
              <div className="flex justify-between">
                <span>{i18n.language === 'tr' ? 'Deneyim:' : i18n.language === 'ar' ? 'الخبرة:' : 'Experience:'}</span>
                <span className="font-bold text-slate-900">5+ {i18n.language === 'tr' ? 'Yıl' : i18n.language === 'ar' ? 'سنوات' : 'Years'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* High-Density GEO & AI Overview Technical Competency Table */}
        <div className="mb-20 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="mb-6 text-start">
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
              {i18n.language === 'tr' ? 'TEKNİK YETKİNLİK MATRİSİ' : i18n.language === 'ar' ? 'مصفوفة الكفاءات التقنية' : 'TECHNICAL COMPETENCY MATRIX'}
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
              {i18n.language === 'tr' 
                ? 'Mühendislik Deneyimi ve Teknoloji Yığını' 
                : i18n.language === 'ar' 
                ? 'الخبرات الهندسية ومجموعة التقنيات المعتمدة' 
                : 'Engineering Expertise & Technology Stack'}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700">
                  <th className="p-3.5 font-bold">{i18n.language === 'tr' ? 'Alan' : i18n.language === 'ar' ? 'المجال' : 'Domain'}</th>
                  <th className="p-3.5 font-bold">{i18n.language === 'tr' ? 'Teknoloji & Araçlar' : i18n.language === 'ar' ? 'التقنيات والأدوات' : 'Technologies & Frameworks'}</th>
                  <th className="p-3.5 font-bold text-teal-800">{i18n.language === 'tr' ? 'Uygulama Seviyesi' : i18n.language === 'ar' ? 'مستوى التطبيق' : 'Production Proficiency'}</th>
                  <th className="p-3.5 font-bold">{i18n.language === 'tr' ? 'Canlı Proje Örnekleri' : i18n.language === 'ar' ? 'أمثلة واقعية' : 'Live References'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {i18n.language === 'tr' ? 'E-Ticaret Mimarisi' : i18n.language === 'ar' ? 'بنية التجارة الإلكترونية' : 'E-Commerce Architecture'}
                  </td>
                  <td className="p-3.5 text-slate-600">Shopify Liquid, İKAS API, Custom Checkout, Webhooks</td>
                  <td className="p-3.5 font-bold text-teal-700">{i18n.language === 'tr' ? 'Kıdemli / Uzman' : i18n.language === 'ar' ? 'خبير أول' : 'Senior Specialist'}</td>
                  <td className="p-3.5 text-slate-600">AIO Coffee, Moda Butiği</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {i18n.language === 'tr' ? 'Ön Yüz Geliştirme (Frontend)' : i18n.language === 'ar' ? 'تطوير الواجهات (Frontend)' : 'Frontend Engineering'}
                  </td>
                  <td className="p-3.5 text-slate-600">React, Next.js, Tailwind CSS, TypeScript, Vite</td>
                  <td className="p-3.5 font-bold text-teal-700">{i18n.language === 'tr' ? 'İleri Düzey' : i18n.language === 'ar' ? 'مستوى متقدم' : 'Advanced Production'}</td>
                  <td className="p-3.5 text-slate-600">Nourla, Taam Club</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {i18n.language === 'tr' ? 'Arka Yüz & API (Backend)' : i18n.language === 'ar' ? 'الخلفية البرمجية والربط' : 'Backend & Integrations'}
                  </td>
                  <td className="p-3.5 text-slate-600">Node.js, Express, PostgreSQL, REST & GraphQL, Trendyol API</td>
                  <td className="p-3.5 font-bold text-teal-700">{i18n.language === 'tr' ? 'İleri Düzey' : i18n.language === 'ar' ? 'مستوى متقدم' : 'Production Robust'}</td>
                  <td className="p-3.5 text-slate-600">Çok Kanallı Stok Entegrasyonları</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {i18n.language === 'tr' ? 'Yapay Zeka & Otomasyon' : i18n.language === 'ar' ? 'الذكاء الاصطناعي والأتمتة' : 'AI & Workflow Automation'}
                  </td>
                  <td className="p-3.5 text-slate-600">OpenAI API, Gemini API, AI Content Engine, Prompt Engineering</td>
                  <td className="p-3.5 font-bold text-teal-700">{i18n.language === 'tr' ? 'Uygulayıcı & Entegratör' : i18n.language === 'ar' ? 'خبير تكامل وأتمتة' : 'Practitioner & Integrator'}</td>
                  <td className="p-3.5 text-slate-600">E-Ticaret AI Ürün İçerik Motoru</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Focus Grid */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillGroups.map((group, i) => (
              <div key={i} className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 flex flex-col gap-4 shadow-xs">
                <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">0{i + 1}</span>
                  {group.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {group.items.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-600 font-medium flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-600 rounded-full flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Work Principles Section */}
        <div className="border-t border-slate-200/80 pt-16">
          <div className="text-center mb-14 flex flex-col items-center gap-2.5">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t('about_page.values_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
            {Array.isArray(values) && values.map((val, idx) => (
              <div key={idx} className="p-7 bg-white border border-slate-200/90 rounded-3xl flex flex-col gap-4 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  {idx === 0 ? <Compass size={20} /> : idx === 1 ? <Award size={20} /> : <GraduationCap size={20} />}
                </div>
                <h3 className="font-display text-base font-bold text-slate-900">{val.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
