import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, ArrowUpRight, ShieldCheck, Zap, Globe, BarChart, Settings, Code2, Cpu, Bot } from 'lucide-react';

export default function ServiceCard({ serviceKey, serviceData, recommended = false }) {
  const { t } = useTranslation();

  const slugMap = {
    'site-kurulumu': '/eticaret-site-kurulumu',
    'optimizasyon': '/eticaret-optimizasyon',
    'urun-gorsel': '/urun-gorsel-ve-icerik',
    'stok-depo': '/stok-ve-depo-sistemi',
    'aylik-yonetim': '/aylik-yonetim',
    'web-gelistirme': '/web-sitesi-gelistirme',
    'ozel-yazilim': '/ozel-yazilim-gelistirme',
    'yapay-zeka': '/yapay-zeka-cozumleri'
  };

  const iconMap = {
    'site-kurulumu': <Globe className="text-accent" size={24} />,
    'optimizasyon': <Zap className="text-accent" size={24} />,
    'urun-gorsel': <ShieldCheck className="text-accent" size={24} />,
    'stok-depo': <Settings className="text-accent" size={24} />,
    'aylik-yonetim': <BarChart className="text-accent" size={24} />,
    'web-gelistirme': <Code2 className="text-accent" size={24} />,
    'ozel-yazilim': <Cpu className="text-accent" size={24} />,
    'yapay-zeka': <Bot className="text-accent" size={24} />
  };

  const path = slugMap[serviceKey] || '/hizmetler';

  if (!serviceData || typeof serviceData === 'string' || !Array.isArray(serviceData.features)) {
    return null;
  }

  const icon = iconMap[serviceKey] || <Zap className="text-accent" size={24} />;

  return (
    <div className={`group relative bg-bg-card border ${recommended ? 'border-accent/40' : 'border-white/5'} rounded-3xl p-8 md:p-10 flex flex-col justify-between hover:border-accent/30 hover:scale-[1.03] hover:shadow-[0_0_80px_rgba(255,107,107,0.06)] transition-all duration-500 overflow-hidden text-start min-h-[480px]`}>
      
      {/* Recommended Tag */}
      {recommended && (
        <span className="absolute top-0 end-8 -translate-y-1/2 px-4 py-1 bg-accent text-white text-[9px] font-black tracking-widest uppercase rounded-full shadow-lg">
          {t('services.recommended') || 'RECOMMENDED'}
        </span>
      )}

      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/3 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        {/* Header: Icon & Price */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent/5 border border-accent/15 flex items-center justify-center">
            {icon}
          </div>
          <span className="mono text-sm font-black text-accent tracking-tight bg-accent/5 border border-accent/10 px-3 py-1 rounded-full">
            {serviceData.price}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl md:text-2xl font-black text-white tracking-tight mb-3">
          {serviceData.title}
        </h3>
        <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-6 font-medium">
          {serviceData.desc}
        </p>

        {/* Features List (Max 3 Deliverables to prevent clutter) */}
        <ul className="flex flex-col gap-3 mb-8">
          {serviceData.features.slice(0, 3).map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-300 font-semibold leading-relaxed">
              <Check className="text-accent flex-shrink-0 mt-0.5" size={14} />
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
        <a
          href={`https://wa.me/905394611684?text=${encodeURIComponent(t('services.cta_whatsapp_msg', { service: serviceData.title }))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 bg-accent hover:bg-accent-hover text-white text-center rounded-xl mono text-[9px] font-black tracking-widest uppercase hover:scale-102 transition-all flex items-center justify-center gap-1.5"
        >
          {t('services.cta_contact')}
          <ArrowUpRight size={12} />
        </a>
      </div>

    </div>
  );
}
