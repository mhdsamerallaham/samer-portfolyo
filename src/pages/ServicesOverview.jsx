import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import ServiceCard from '../components/ServiceCard';

export default function ServicesOverview() {
  const { t, i18n } = useTranslation();
  const servicesKeys = ['site-kurulumu', 'optimizasyon', 'urun-gorsel', 'stok-depo', 'aylik-yonetim'];

  return (
    <div className="pt-32 pb-24 text-white min-h-screen">
      {/* SEO metadata for services page */}
      <SEO
        title={t('nav.services')}
        description={t('services.subtitle')}
        keywords="shopify site kurma, ikas e ticaret sitesi, e ticaret danışmanlığı, ürün fotoğraf düzenleme"
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-start">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-6">
            {t('services.title')}
          </h1>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed font-semibold">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {servicesKeys.map((key) => (
            <ServiceCard
              key={key}
              serviceKey={key}
              serviceData={t(`services.items.${key}`, { returnObjects: true })}
              recommended={key === 'site-kurulumu'}
            />
          ))}
        </div>

        {/* Shopify vs İKAS Comparison Banner */}
        <div className="bg-[#131b2e] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b6b]/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="lg:col-span-7 flex flex-col gap-5">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              {i18n.language === 'tr' ? 'Shopify mı İKAS mı? Hangisini Seçmelisiniz?' : 'Shopify or İKAS? Which to Choose?'}
            </h2>
            <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-semibold">
              {i18n.language === 'tr' 
                ? 'E-ticarette en önemli adım doğru altyapı seçimidir. Shopify ile küresel pazarlara açılabilir ve devasa entegrasyon havuzundan faydalanabilirsiniz. İKAS ise Türkiye pazarında inanılmaz yüksek hızlar, sıfır işlem komisyonu ve yerleşik yerel entegrasyonlar sunar. Hangisinin işletmeniz için doğru karar olduğunu detaylı analiz edip seçiyoruz.'
                : 'Choosing the right engine dictates your growth. Shopify delivers global scaling with multi-currency checkout, while Turkish domestic performer İKAS provides blistering speeds, zero fees, and built-in local integration templates. We map out and implement the ideal choice for your business.'}
            </p>
            <div className="flex gap-6 mt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                <CheckCircle2 size={16} className="text-[#ff6b6b]" />
                <span>Shopify: Global Scalability</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                <CheckCircle2 size={16} className="text-[#ff6b6b]" />
                <span>İKAS: Speed & Local Power</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 flex flex-col gap-4 bg-[#0b0f19] p-6 rounded-2xl border border-white/5 w-full">
            <ul className="flex flex-col gap-3 text-xs leading-relaxed text-neutral-400 font-semibold">
              <li className="flex gap-2">
                <span className="text-[#ff6b6b] font-bold">&gt;</span>
                <span>{i18n.language === 'tr' ? 'Hedef Pazarınız Türkiye ise: İKAS' : 'Turkish Local Target: İKAS'}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#ff6b6b] font-bold">&gt;</span>
                <span>{i18n.language === 'tr' ? 'Hedef Pazarınız Küresel ise: Shopify' : 'Global Export Target: Shopify'}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#ff6b6b] font-bold">&gt;</span>
                <span>{i18n.language === 'tr' ? 'Kararsızsanız: Birlikte Ücretsiz Analiz Edelim' : 'Unsure: Let\'s analyze it together'}</span>
              </li>
            </ul>
            <Link
              to="/iletisim?service=site-kurulumu"
              className="mt-4 py-3 bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-center rounded-xl mono text-[9px] font-black tracking-widest uppercase hover:scale-102 transition-all flex items-center justify-center gap-2"
            >
              {i18n.language === 'tr' ? 'YOL HARİTASI ÇİZELİM' : 'MAP A ROADMAP'}
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
