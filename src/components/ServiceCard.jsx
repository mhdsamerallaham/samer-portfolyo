import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, ArrowUpRight, ShieldCheck, Zap, Globe, BarChart, Settings, Code2, Cpu, Bot, Sparkles } from 'lucide-react';
import { getLocalizedPath } from '../utils/navigation';

export default function ServiceCard({ serviceKey, serviceData, recommended = false }) {
  const { t, i18n } = useTranslation();

  const slugMap = {
    'site-kurulumu': '/eticaret-site-kurulumu',
    'optimizasyon': '/eticaret-optimizasyon',
    'urun-gorsel': '/urun-gorsel-ve-icerik',
    'stok-depo': '/stok-ve-depo-sistemi',
    'aylik-yonetim': '/aylik-yonetim',
    'web-gelistirme': '/web-sitesi-gelistirme',
    'ozel-yazilim': '/ozel-yazilim-gelistirme',
    'yapay-zeka': '/yapay-zeka-cozumleri',
    'geo-optimizasyon': '/hizmetler/geo-yapay-zeka-optimizasyonu'
  };

  const iconMap = {
    'site-kurulumu': <Globe className="text-teal-600" size={22} />,
    'optimizasyon': <Zap className="text-teal-600" size={22} />,
    'urun-gorsel': <ShieldCheck className="text-teal-600" size={22} />,
    'stok-depo': <Settings className="text-teal-600" size={22} />,
    'aylik-yonetim': <BarChart className="text-teal-600" size={22} />,
    'web-gelistirme': <Code2 className="text-teal-600" size={22} />,
    'ozel-yazilim': <Cpu className="text-teal-600" size={22} />,
    'yapay-zeka': <Bot className="text-teal-600" size={22} />,
    'geo-optimizasyon': <Sparkles className="text-teal-600" size={22} />
  };

  const rawPath = slugMap[serviceKey] || '/hizmetler';
  const path = getLocalizedPath(rawPath, i18n.language);

  if (!serviceData || typeof serviceData === 'string' || !Array.isArray(serviceData.features)) {
    return null;
  }

  const icon = iconMap[serviceKey] || <Zap className="text-teal-600" size={22} />;

  return (
    <div 
      className={`group relative bg-white border ${
        recommended 
          ? 'border-teal-400/90 shadow-[0_8px_30px_rgb(13,148,136,0.12)] ring-1 ring-teal-400/50' 
          : 'border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)]'
      } rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-teal-400 hover:shadow-[0_16px_36px_-6px_rgba(13,148,136,0.15)] hover:-translate-y-1 transition-all duration-300 text-start min-h-[460px]`}
    >
      
      {/* Recommended Tag */}
      {recommended && (
        <span className="absolute -top-3.5 end-6 inline-flex items-center gap-1 px-3.5 py-1 bg-orange-500 text-white text-[11px] font-extrabold tracking-wide uppercase rounded-full shadow-md shadow-orange-500/25">
          <Sparkles size={12} className="text-orange-200" />
          {t('services.recommended') || 'ÖNERİLEN'}
        </span>
      )}

      <div>
        {/* Header: Icon & Price */}
        <div className="flex justify-between items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
            {icon}
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-800 bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-full font-mono">
            {serviceData.price}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2.5 group-hover:text-teal-700 transition-colors">
          {serviceData.title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
          {serviceData.desc}
        </p>

        {/* Deliverables List */}
        <ul className="flex flex-col gap-2.5 mb-8">
          {serviceData.features.slice(0, 3).map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium leading-snug">
              <div className="w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="text-teal-700" size={11} strokeWidth={3} />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-100">
        <Link
          to={path}
          className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-center rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
        >
          {t('services.cta_card')}
        </Link>
        <a
          href={`https://wa.me/905394611684?text=${encodeURIComponent(t('services.cta_whatsapp_msg', { service: serviceData.title }))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white text-center rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1"
        >
          <span>{t('services.cta_contact')}</span>
          <ArrowUpRight size={13} />
        </a>
      </div>

    </div>
  );
}

