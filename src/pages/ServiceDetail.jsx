import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, Award, ArrowUpRight } from 'lucide-react';
import SEO from '../components/SEO';
import FAQ from '../components/FAQ';

const routeToKeyMap = {
  '/eticaret-site-kurulumu': 'site-kurulumu',
  '/eticaret-optimizasyon': 'optimizasyon',
  '/urun-gorsel-ve-icerik': 'urun-gorsel',
  '/stok-ve-depo-sistemi': 'stok-depo',
  '/aylik-yonetim': 'aylik-yonetim'
};

export default function ServiceDetail() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [serviceKey, setServiceKey] = useState(null);

  useEffect(() => {
    const key = routeToKeyMap[location.pathname];
    if (key) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setServiceKey(key);
      window.scrollTo(0, 0);
    } else {
      // Redirect to services overview if route not found
      navigate('/hizmetler');
    }
  }, [location.pathname, navigate]);

  if (!serviceKey) return null;

  const data = t(`services.items.${serviceKey}`, { returnObjects: true });
  if (!data || typeof data === 'string' || !Array.isArray(data.features)) return null;

  return (
    <div className="pt-32 pb-24 text-white min-h-screen text-start">
      {/* Dynamic SEO configuration */}
      <SEO
        title={data.title}
        description={data.desc}
        keywords={`${data.title.toLowerCase()}, shopify site kurma, ikas e ticaret sitesi, e ticaret danışmanlığı`}
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Back Link */}
        <Link
          to="/hizmetler"
          className="inline-flex items-center gap-2 text-xs font-black mono text-neutral-400 hover:text-[#ff6b6b] mb-12 transition-colors"
        >
          <ArrowLeft size={14} />
          {i18n.language === 'tr' ? 'HİZMETLERE DÖN' : i18n.language === 'ar' ? 'العودة للخدمات' : 'BACK TO SERVICES'}
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5 mb-16 items-start">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3.5 py-1 bg-white/5 border border-white/10 rounded-full mono text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                {data.badge}
              </span>
              <span className="mono text-[10px] font-black text-[#ff6b6b] tracking-widest bg-[#ff6b6b]/5 border border-[#ff6b6b]/10 px-3 py-1 rounded-full">
                {data.price}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight mb-6">
              {data.title}
            </h1>
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed font-semibold">
              {data.desc}
            </p>
          </div>
          <div className="lg:col-span-4 bg-[#131b2e] border border-white/5 rounded-3xl p-6 flex flex-col gap-6 w-full mt-2 lg:mt-0">
            <h3 className="mono text-[9px] font-black text-[#ff6b6b] tracking-wider uppercase">Paket İçeriği</h3>
            <ul className="flex flex-col gap-3">
              {data.features.map((feature, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-neutral-300 font-semibold leading-relaxed">
                  <Check size={14} className="text-[#ff6b6b] flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              to={`/iletisim?service=${serviceKey}`}
              className="w-full py-4 bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-center rounded-2xl mono text-[10px] font-black tracking-widest uppercase hover:scale-102 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {i18n.language === 'tr' ? 'TEKLİF AL / İLETİŞİME GEÇ' : i18n.language === 'ar' ? 'احصل على عرض' : 'GET QUOTE / CONNECT'}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Structured AI & Search Engine Optimization Sections */}
        {data.ai_desc && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
            
            <div className="lg:col-span-7 flex flex-col gap-8">
              {/* Question 1: What is this? */}
              <div className="flex flex-col gap-3">
                <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                  <span className="mono text-xs text-[#ff6b6b]">01</span>
                  {i18n.language === 'tr' ? 'Bu Hizmet Nedir?' : i18n.language === 'ar' ? 'ما هي هذه الخدمة؟' : 'What is this Service?'}
                </h3>
                <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-semibold pl-6 border-l border-white/10">
                  {data.ai_desc.definition}
                </p>
              </div>

              {/* Question 2: Who is it for? */}
              <div className="flex flex-col gap-3">
                <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                  <span className="mono text-xs text-[#ff6b6b]">02</span>
                  {i18n.language === 'tr' ? 'Bu Hizmet Kimler İçin?' : i18n.language === 'ar' ? 'لمن هذه الخدمة؟' : 'Who is it For?'}
                </h3>
                <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-semibold pl-6 border-l border-white/10">
                  {data.ai_desc.for_whom}
                </p>
              </div>

              {/* Question 3: How does it work? */}
              <div className="flex flex-col gap-3">
                <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                  <span className="mono text-xs text-[#ff6b6b]">03</span>
                  {i18n.language === 'tr' ? 'Süreç Nasıl İşler?' : i18n.language === 'ar' ? 'كيف تعمل هذه الخدمة؟' : 'How does it Work?'}
                </h3>
                <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-semibold pl-6 border-l border-white/10 whitespace-pre-line">
                  {data.ai_desc.how_works}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6 bg-[#131b2e] border border-white/5 rounded-3xl p-8 relative overflow-hidden h-fit">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b6b]/5 rounded-full blur-[40px] pointer-events-none" />
              <div className="w-10 h-10 rounded-xl bg-[#ff6b6b]/10 flex items-center justify-center text-[#ff6b6b] mb-2">
                <Award size={20} />
              </div>
              <h4 className="text-lg font-black text-white mt-1">
                {i18n.language === 'tr' ? 'Örnek Uygulama' : i18n.language === 'ar' ? 'مثال عملي' : 'Example Project'}
              </h4>
              <p className="text-neutral-400 text-xs leading-relaxed font-semibold">
                {data.ai_desc.example}
              </p>
            </div>

          </div>
        )}

        {/* Dynamic Service FAQ Accordion */}
        <div className="border-t border-white/5 pt-20 mb-20 text-center">
          <div className="flex flex-col items-center gap-3 mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {i18n.language === 'tr' ? 'Hizmet Hakkında SSS' : i18n.language === 'ar' ? 'الأسئلة Şarkı' : 'Service FAQ'}
            </h2>
          </div>
          <FAQ />
        </div>

      </div>
    </div>
  );
}
