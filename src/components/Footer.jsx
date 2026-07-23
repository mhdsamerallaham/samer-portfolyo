import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowDownRight, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { getLocalizedPath } from '../utils/navigation';

export default function Footer() {
  const { t, i18n } = useTranslation();

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-20 bg-[#0b0f19] overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="grid-bg" />
      </div>

      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/5 text-left">
          
          {/* Logo & Identity */}
          <div className="flex flex-col gap-6">
            <Link to={getLocalizedPath('/', i18n.language)} onClick={handleLogoClick} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 rounded-xl flex items-center justify-center group-hover:bg-[#ff6b6b] transition-all duration-300">
                <ArrowDownRight className="text-[#ff6b6b] group-hover:text-white transition-colors" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="mono font-black text-base tracking-tighter leading-none text-white">SAMER ALLAHAM</span>
                <span className="mono text-[8px] text-[#ff6b6b] tracking-[0.2em] font-bold uppercase mt-1">E-Commerce Systems</span>
              </div>
            </Link>
            <p className="text-neutral-400 text-xs leading-relaxed font-medium">
              {t('about_page.identity_statement')}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              <a href="https://share.google/IrAWdrTQOMekMNmwh" target="_blank" rel="noopener noreferrer" aria-label="Google Maps Business Profile" title="Google Maps İşletme Profili" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#ff6b6b] hover:border-[#ff6b6b]/30 transition-all">
                <MapPin size={16} />
              </a>
              <a href="https://github.com/mhdsamerallaham" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#ff6b6b] hover:border-[#ff6b6b]/30 transition-all">
                <Github size={16} />
              </a>
              <a href="https://www.linkedin.com/in/samer-allaham-18a784162/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#ff6b6b] hover:border-[#ff6b6b]/30 transition-all">
                <Linkedin size={16} />
              </a>
              <a href="mailto:samerallaham3@gmail.com" aria-label="Send Email" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#ff6b6b] hover:border-[#ff6b6b]/30 transition-all">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Sitemap Links */}
          <div className="flex flex-col gap-4">
            <span className="mono text-[9px] font-black text-neutral-400 tracking-[0.2em] uppercase">SİTEMAP</span>
            <ul className="flex flex-col gap-2.5">
              <li><Link to={getLocalizedPath('/', i18n.language)} onClick={handleLogoClick} className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors">{t('nav.home')}</Link></li>
              <li><Link to={getLocalizedPath('/hizmetler', i18n.language)} className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors">{t('nav.services')}</Link></li>
              <li><Link to={getLocalizedPath('/basari-hikayeleri', i18n.language)} className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors">{t('nav.case_studies')}</Link></li>
              <li><Link to={getLocalizedPath('/blog', i18n.language)} className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors">{t('nav.blog')}</Link></li>
              <li><Link to={getLocalizedPath('/hakkimda', i18n.language)} className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors">{t('nav.about')}</Link></li>
              <li><Link to={getLocalizedPath('/iletisim', i18n.language)} className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* E-Commerce Solutions Links */}
          <div className="flex flex-col gap-4">
            <span className="mono text-[9px] font-black text-neutral-400 tracking-[0.2em] uppercase">ÇÖZÜMLER</span>
            <ul className="flex flex-col gap-2.5">
              <li><Link to={getLocalizedPath('/e-ticaret-web-tasarim', i18n.language)} className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors">{i18n.language === 'tr' ? 'E-Ticaret Web Tasarım' : 'E-Commerce Web Design'}</Link></li>
              <li><Link to={getLocalizedPath('/web-tasarim', i18n.language)} className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors">{i18n.language === 'tr' ? 'Web Tasarım & Geliştirme' : 'Web Design & Development'}</Link></li>
              <li><Link to={getLocalizedPath('/eticaret-site-kurulumu', i18n.language)} className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors">{t('services.items.site-kurulumu.title')}</Link></li>
              <li><Link to={getLocalizedPath('/eticaret-optimizasyon', i18n.language)} className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors">{t('services.items.optimizasyon.title')}</Link></li>
              <li><Link to={getLocalizedPath('/urun-gorsel-ve-icerik', i18n.language)} className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors">{t('services.items.urun-gorsel.title')}</Link></li>
              <li><Link to={getLocalizedPath('/stok-ve-depo-sistemi', i18n.language)} className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors">{t('services.items.stok-depo.title')}</Link></li>
              <li><Link to={getLocalizedPath('/aylik-yonetim', i18n.language)} className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors">{t('services.items.aylik-yonetim.title')}</Link></li>
            </ul>
          </div>

          {/* Tech Stack Showcase */}
          <div className="flex flex-col gap-4">
            <span className="mono text-[9px] font-black text-neutral-400 tracking-[0.2em] uppercase">TEKNOLOJİLER</span>
            <div className="flex flex-wrap gap-2">
              {['Shopify', 'İKAS', 'React', 'Next.js', 'Node.js', 'Python', 'PostgreSQL', 'APIs', 'Webhooks'].map((tech) => (
                <span key={tech} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-10 opacity-30 text-xs font-semibold">
          <span className="mono text-[9px] font-black text-white uppercase font-mono">
            © {currentYear} SAMER ALLAHAM // E-COMMERCE SYSTEMS & GROWTH
          </span>
          <span className="mono text-[9px] font-black text-white uppercase font-mono tracking-widest">
            ALL SYSTEMS OPERATIONAL [200 OK]
          </span>
        </div>

      </div>
    </footer>
  );
}
