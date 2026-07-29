import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowDownRight, Github, Linkedin, Mail, MapPin, ExternalLink } from 'lucide-react';
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/5 text-left">
          
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
            <div className="flex items-center gap-2.5 mt-2 flex-wrap">
              <a href="https://share.google/IrAWdrTQOMekMNmwh" target="_blank" rel="noopener noreferrer" aria-label="Google Maps Business Profile" title="Google Maps İşletme Profili" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#ff6b6b] hover:border-[#ff6b6b]/30 transition-all">
                <MapPin size={16} />
              </a>
              <a href="https://github.com/mhdsamerallaham" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" title="GitHub" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#ff6b6b] hover:border-[#ff6b6b]/30 transition-all">
                <Github size={16} />
              </a>
              <a href="https://www.linkedin.com/in/samer-allaham-18a784162/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" title="LinkedIn" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#ff6b6b] hover:border-[#ff6b6b]/30 transition-all">
                <Linkedin size={16} />
              </a>
              <a href="https://www.upwork.com/freelancers/~010348fd03fde0f41b?mp_source=share" target="_blank" rel="noopener noreferrer" aria-label="Upwork Profile" title="Upwork" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#ff6b6b] hover:border-[#ff6b6b]/30 transition-all">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.396-2.185 1.684-3.203 3.003-3.203 1.258 0 2.227.971 2.227 2.257 0 1.954-1.026 3.291-2.392 3.291zm-2.483-6.621c-2.316 0-4.143 1.637-4.793 4.195-1.096-1.579-1.95-3.568-2.366-5.732H6.104v7.712c0 1.666-.889 2.583-2.31 2.583-1.42 0-2.28-.917-2.28-2.583V5h-2.8v7.712c0 3.167 1.934 5.288 5.08 5.288 3.125 0 5.11-2.121 5.11-5.288v-1.093c.484 1.484 1.246 2.87 2.235 4.022L9.5 24h3.011l1.242-4.992c1.238.835 2.68 1.35 4.308 1.35 3.187 0 5.439-2.617 5.439-6.201 0-3.957-2.317-6.02-4.922-6.02z" />
                </svg>
              </a>
              <a href="https://www.fiverr.com/s/akQab8g" target="_blank" rel="noopener noreferrer" aria-label="Fiverr Profile" title="Fiverr" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#ff6b6b] hover:border-[#ff6b6b]/30 transition-all">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23 15.011h-2.073v-5.63h2.073v5.63zm-3.204-5.63h-2.008v1.391h-.044c-.381-.977-1.442-1.59-2.55-1.59-2.094 0-3.606 1.612-3.606 3.738 0 2.148 1.512 3.738 3.606 3.738 1.108 0 2.169-.613 2.55-1.59h.044v1.347h2.008v-6.993zm-3.541 5.411c-1.152 0-1.942-.875-1.942-1.982 0-1.108.79-1.983 1.942-1.983 1.153 0 1.942.875 1.942 1.983 0 1.107-.789 1.982-1.942 1.982zm-4.708-5.411h-2.072v5.63h2.072v-5.63zm-1.036-1.547c-.678 0-1.225-.547-1.225-1.225 0-.678.547-1.225 1.225-1.225.679 0 1.225.547 1.225 1.225 0 .678-.546 1.225-1.225 1.225zm-2.822 7.177v-3.715c0-.984-.525-1.465-1.356-1.465-.962 0-1.553.678-1.553 1.772v3.408H2.709v-5.63h1.838v.919h.044c.481-.722 1.378-1.115 2.385-1.115 1.751 0 2.713 1.05 2.713 2.844v3.082H7.689z" />
                </svg>
              </a>
              <a href="https://contra.com/samer_allaham_s51lxcvv?referralExperimentNid=DEFAULT_REFERRAL_PROGRAM&referrerUsername=samer_allaham_s51lxcvv" target="_blank" rel="noopener noreferrer" aria-label="Contra Portfolio" title="Contra" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#ff6b6b] hover:border-[#ff6b6b]/30 transition-all">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2V7h2v10z" />
                </svg>
              </a>
              <a href="https://hashnode.com/@samerallaham" target="_blank" rel="noopener noreferrer" aria-label="Hashnode Profile" title="Hashnode" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#ff6b6b] hover:border-[#ff6b6b]/30 transition-all">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 0 0-7.962 0l-6.37 6.37a5.63 5.63 0 0 0 0 7.962l6.37 6.37a5.63 5.63 0 0 0 7.962 0l6.37-6.37a5.63 5.63 0 0 0 0-7.962zM12 15.5a3.5 3.5 0 1 1 3.5-3.5 3.5 3.5 0 0 1-3.5 3.5z" />
                </svg>
              </a>
              <a href="https://www.quora.com/profile/Samer-Allaham-4" target="_blank" rel="noopener noreferrer" aria-label="Quora Profile" title="Quora" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#ff6b6b] hover:border-[#ff6b6b]/30 transition-all">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.64 16.51c-.69.69-1.5 1.05-2.42 1.05-1.28 0-2.31-.62-2.31-2.4 0-2.58 3.54-3.56 5.8-3.56v.69c0 1.63-.37 3.52-1.07 4.22zm4.33 3.65c-.88.66-2.1 1.04-3.55 1.04-1.92 0-3.41-.75-4.32-2.02l-.66 1.48H6.5v-.57c.72-.81 1.02-1.74 1.02-3.87 0-3.66 2.37-6.52 6.54-6.52 4.14 0 6.33 2.82 6.33 6.44 0 1.45-.44 2.81-1.42 3.82z" />
                </svg>
              </a>
              <a href="mailto:samerallaham3@gmail.com" aria-label="Send Email" title="E-Posta" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#ff6b6b] hover:border-[#ff6b6b]/30 transition-all">
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

          {/* Global Profiles & Freelance Platforms */}
          <div className="flex flex-col gap-4">
            <span className="mono text-[9px] font-black text-neutral-400 tracking-[0.2em] uppercase">PROFİLLER</span>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href="https://www.upwork.com/freelancers/~010348fd03fde0f41b?mp_source=share" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors inline-flex items-center gap-1.5 group">
                  <span>Upwork Profile</span>
                  <ExternalLink size={11} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="https://www.fiverr.com/s/akQab8g" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors inline-flex items-center gap-1.5 group">
                  <span>Fiverr Profile</span>
                  <ExternalLink size={11} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="https://contra.com/samer_allaham_s51lxcvv?referralExperimentNid=DEFAULT_REFERRAL_PROGRAM&referrerUsername=samer_allaham_s51lxcvv" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors inline-flex items-center gap-1.5 group">
                  <span>Contra Portfolio</span>
                  <ExternalLink size={11} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="https://hashnode.com/@samerallaham" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors inline-flex items-center gap-1.5 group">
                  <span>Hashnode Tech</span>
                  <ExternalLink size={11} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="https://www.quora.com/profile/Samer-Allaham-4" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-[#ff6b6b] text-xs font-semibold transition-colors inline-flex items-center gap-1.5 group">
                  <span>Quora Profile</span>
                  <ExternalLink size={11} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
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
