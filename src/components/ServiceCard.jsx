import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, ArrowUpRight } from 'lucide-react';

export default function ServiceCard({ serviceKey, serviceData }) {
  const { t } = useTranslation();

  const slugMap = {
    'site-kurulumu': '/eticaret-site-kurulumu',
    'optimizasyon': '/eticaret-optimizasyon',
    'urun-gorsel': '/urun-gorsel-ve-icerik',
    'stok-depo': '/stok-ve-depo-sistemi',
    'aylik-yonetim': '/aylik-yonetim'
  };

  const path = slugMap[serviceKey] || '/hizmetler';

  if (!serviceData || typeof serviceData === 'string' || !Array.isArray(serviceData.features)) {
    return null;
  }

  return (
    <div className="group relative bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 flex flex-col justify-between hover:border-[#00ffaa]/20 hover:shadow-[0_0_50px_rgba(0,255,170,0.02)] transition-all duration-500 overflow-hidden text-left min-h-[460px]">
      
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ffaa]/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        {/* Header: Badge & Pricing */}
        <div className="flex justify-between items-center mb-6">
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full mono text-[9px] font-black text-neutral-400 tracking-wider uppercase">
            {serviceData.badge}
          </span>
          <span className="mono text-[10px] font-black text-[#00ffaa] tracking-widest bg-[#00ffaa]/5 border border-[#00ffaa]/10 px-3 py-1 rounded-full">
            {serviceData.price}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl md:text-2xl font-black text-white tracking-tight mb-3">
          {serviceData.title}
        </h3>
        <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-medium">
          {serviceData.desc}
        </p>

        {/* Features List */}
        <ul className="flex flex-col gap-3 mb-8">
          {serviceData.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-300 font-semibold leading-relaxed">
              <Check className="text-[#00ffaa] flex-shrink-0 mt-0.5" size={14} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <Link
          to={path}
          className="py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-center rounded-xl mono text-[9px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-1.5"
        >
          {t('services.cta_card')}
        </Link>
        <Link
          to={`/iletisim?service=${serviceKey}`}
          className="py-3 bg-[#00ffaa] text-black text-center rounded-xl mono text-[9px] font-black tracking-widest uppercase hover:scale-102 transition-all flex items-center justify-center gap-1.5"
        >
          {t('services.cta_contact')}
          <ArrowUpRight size={12} />
        </Link>
      </div>

    </div>
  );
}
