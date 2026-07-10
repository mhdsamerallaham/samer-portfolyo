import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowDownRight, Github, Linkedin, Mail, MessageSquare } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-20 bg-black overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="grid-bg" />
      </div>

      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/5 text-left">
          
          {/* Logo & Identity */}
          <div className="flex flex-col gap-6">
            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#00ffaa]/10 border border-[#00ffaa]/20 rounded-xl flex items-center justify-center group-hover:bg-[#00ffaa] transition-all duration-300">
                <ArrowDownRight className="text-[#00ffaa] group-hover:text-black transition-colors" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="mono font-black text-base tracking-tighter leading-none text-white">SAMER ALLAHAM</span>
                <span className="mono text-[8px] text-[#00ffaa] tracking-[0.2em] font-bold uppercase mt-1">E-Commerce Systems</span>
              </div>
            </Link>
            <p className="text-neutral-400 text-xs leading-relaxed font-medium">
              {t('about_page.identity_statement')}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              <a href="https://github.com/mhdsamerallaham" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#00ffaa] hover:border-[#00ffaa]/30 transition-all">
                <Github size={16} />
              </a>
              <a href="https://www.linkedin.com/in/samer-allaham-18a784162/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#00ffaa] hover:border-[#00ffaa]/30 transition-all">
                <Linkedin size={16} />
              </a>
              <a href="mailto:samerallaham3@gmail.com" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#00ffaa] hover:border-[#00ffaa]/30 transition-all">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Sitemap Links */}
          <div className="flex flex-col gap-4">
            <span className="mono text-[9px] font-black text-neutral-500 tracking-[0.2em] uppercase">// SİTEMAP</span>
            <ul className="flex flex-col gap-2.5">
              <li><Link to="/" onClick={handleLogoClick} className="text-neutral-300 hover:text-[#00ffaa] text-xs font-semibold transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/hizmetler" className="text-neutral-300 hover:text-[#00ffaa] text-xs font-semibold transition-colors">{t('nav.services')}</Link></li>
              <li><Link to="/basari-hikayeleri" className="text-neutral-300 hover:text-[#00ffaa] text-xs font-semibold transition-colors">{t('nav.case_studies')}</Link></li>
              <li><Link to="/blog" className="text-neutral-300 hover:text-[#00ffaa] text-xs font-semibold transition-colors">{t('nav.blog')}</Link></li>
              <li><Link to="/hakkimda" className="text-neutral-300 hover:text-[#00ffaa] text-xs font-semibold transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/iletisim" className="text-neutral-300 hover:text-[#00ffaa] text-xs font-semibold transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* E-Commerce Solutions Links */}
          <div className="flex flex-col gap-4">
            <span className="mono text-[9px] font-black text-neutral-500 tracking-[0.2em] uppercase">// SOLUTİONS</span>
            <ul className="flex flex-col gap-2.5">
              <li><Link to="/eticaret-site-kurulumu" className="text-neutral-300 hover:text-[#00ffaa] text-xs font-semibold transition-colors">{t('services.items.site-kurulumu.title')}</Link></li>
              <li><Link to="/eticaret-optimizasyon" className="text-neutral-300 hover:text-[#00ffaa] text-xs font-semibold transition-colors">{t('services.items.optimizasyon.title')}</Link></li>
              <li><Link to="/urun-gorsel-ve-icerik" className="text-neutral-300 hover:text-[#00ffaa] text-xs font-semibold transition-colors">{t('services.items.urun-gorsel.title')}</Link></li>
              <li><Link to="/stok-ve-depo-sistemi" className="text-neutral-300 hover:text-[#00ffaa] text-xs font-semibold transition-colors">{t('services.items.stok-depo.title')}</Link></li>
              <li><Link to="/aylik-yonetim" className="text-neutral-300 hover:text-[#00ffaa] text-xs font-semibold transition-colors">{t('services.items.aylik-yonetim.title')}</Link></li>
            </ul>
          </div>

          {/* Tech Stack Showcase */}
          <div className="flex flex-col gap-4">
            <span className="mono text-[9px] font-black text-neutral-500 tracking-[0.2em] uppercase">// TECH STACK</span>
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
