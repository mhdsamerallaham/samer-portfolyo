import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowDownRight, Github, Linkedin, Mail, MapPin, ExternalLink, Sparkles, Phone, Instagram, Facebook } from 'lucide-react';
import { getLocalizedPath } from '../utils/navigation';

export default function Footer() {
  const { t, i18n } = useTranslation();

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 sm:py-20 bg-slate-900 text-slate-300 overflow-hidden border-t border-slate-800">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80 text-left">
          
          {/* Logo & Identity */}
          <div className="flex flex-col gap-5 lg:col-span-2 pr-0 lg:pr-6">
            <Link to={getLocalizedPath('/', i18n.language)} onClick={handleLogoClick} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-all duration-300 shadow-sm">
                <ArrowDownRight className="text-teal-400 group-hover:text-white transition-colors" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg tracking-tight leading-none text-white">SAMER ALLAHAM</span>
                <span className="font-semibold text-[10px] text-teal-400 tracking-wider uppercase mt-1">E-Commerce Growth & Engineering</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {t('about_page.identity_statement') || 'İstanbul merkezli e-ticaret ve tam yığın web geliştirici. Shopify, İKAS ve modern web altyapılarıyla satışlarınızı ölçeklendiriyorum.'}
            </p>
            
            {/* Local SEO Visible NAP (Address, Phone, Email) */}
            <div className="flex flex-col gap-2 pt-1 text-xs text-slate-300 border-t border-slate-800/80">
              <a
                href="https://share.google/IrAWdrTQOMekMNmwh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-teal-400 transition-colors group"
                title="Google Maps İşletme Konumu"
              >
                <MapPin size={15} className="text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">Akşemsettin Mah., Fatih, 34080 İstanbul, Türkiye</span>
              </a>
              <a
                href="tel:+905394611684"
                className="flex items-center gap-2 hover:text-teal-400 transition-colors"
                title="Telefon ile arayın"
              >
                <Phone size={15} className="text-teal-400 flex-shrink-0" />
                <span>+90 539 461 16 84</span>
              </a>
              <a
                href="mailto:samerallaham3@gmail.com"
                className="flex items-center gap-2 hover:text-teal-400 transition-colors"
                title="E-posta gönderin"
              >
                <Mail size={15} className="text-teal-400 flex-shrink-0" />
                <span>samerallaham3@gmail.com</span>
              </a>
            </div>

            {/* Social Icons (X, LinkedIn, Facebook, Instagram, GitHub, Maps, Email) */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <a
                href="https://share.google/IrAWdrTQOMekMNmwh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Maps Business Profile"
                title="Google Maps İşletme Profili"
                className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-500/50 hover:bg-slate-800/80 transition-all"
              >
                <MapPin size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/samer-allaham-18a784162/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                title="LinkedIn"
                className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-500/50 hover:bg-slate-800/80 transition-all"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://x.com/samerallaham"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter) Profile"
                title="X (Twitter)"
                className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-500/50 hover:bg-slate-800/80 transition-all"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/samerallaham"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                title="Instagram"
                className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-500/50 hover:bg-slate-800/80 transition-all"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://www.facebook.com/samerallaham"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Profile"
                title="Facebook"
                className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-500/50 hover:bg-slate-800/80 transition-all"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://github.com/mhdsamerallaham"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                title="GitHub"
                className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-500/50 hover:bg-slate-800/80 transition-all"
              >
                <Github size={16} />
              </a>
              <a
                href="mailto:samerallaham3@gmail.com"
                aria-label="Send Email"
                title="E-Posta"
                className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-500/50 hover:bg-slate-800/80 transition-all"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Sitemap Links */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-xs text-slate-200 tracking-wider uppercase">
              {i18n.language === 'tr' ? 'SİTE' : i18n.language === 'ar' ? 'الموقع' : 'SITEMAP'}
            </span>
            <ul className="flex flex-col gap-2">
              <li><Link to={getLocalizedPath('/', i18n.language)} onClick={handleLogoClick} className="text-slate-400 hover:text-teal-300 text-sm font-medium transition-colors">{t('nav.home')}</Link></li>
              <li><Link to={getLocalizedPath('/hizmetler', i18n.language)} className="text-slate-400 hover:text-teal-300 text-sm font-medium transition-colors">{t('nav.services')}</Link></li>
              <li><Link to={getLocalizedPath('/basari-hikayeleri', i18n.language)} className="text-slate-400 hover:text-teal-300 text-sm font-medium transition-colors">{t('nav.case_studies')}</Link></li>
              <li><Link to={getLocalizedPath('/blog', i18n.language)} className="text-slate-400 hover:text-teal-300 text-sm font-medium transition-colors">{t('nav.blog')}</Link></li>
              <li><Link to={getLocalizedPath('/faq', i18n.language)} className="text-slate-400 hover:text-teal-300 text-sm font-medium transition-colors">{i18n.language === 'tr' ? 'Sıkça Sorulan Sorular' : i18n.language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</Link></li>
              <li><Link to={getLocalizedPath('/hakkimda', i18n.language)} className="text-slate-400 hover:text-teal-300 text-sm font-medium transition-colors">{t('nav.about')}</Link></li>
              <li><Link to={getLocalizedPath('/iletisim', i18n.language)} className="text-slate-400 hover:text-teal-300 text-sm font-medium transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* E-Commerce Solutions */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-xs text-slate-200 tracking-wider uppercase">
              {i18n.language === 'tr' ? 'HİZMETLER' : i18n.language === 'ar' ? 'الخدمات' : 'SERVICES'}
            </span>
            <ul className="flex flex-col gap-2">
              <li><Link to={getLocalizedPath('/eticaret-site-kurulumu', i18n.language)} className="text-slate-400 hover:text-teal-300 text-sm font-medium transition-colors">{i18n.language === 'tr' ? 'E-Ticaret Kurulumu' : i18n.language === 'ar' ? 'إنشاء متجر إلكتروني' : 'E-Commerce Setup'}</Link></li>
              <li><Link to={getLocalizedPath('/eticaret-optimizasyon', i18n.language)} className="text-slate-400 hover:text-teal-300 text-sm font-medium transition-colors">{i18n.language === 'tr' ? 'Dönüşüm & Hız (CRO)' : i18n.language === 'ar' ? 'تحسين التحويل والسرعة' : 'CRO & Speed'}</Link></li>
              <li><Link to={getLocalizedPath('/web-tasarim', i18n.language)} className="text-slate-400 hover:text-teal-300 text-sm font-medium transition-colors">{i18n.language === 'tr' ? 'Web Tasarım' : i18n.language === 'ar' ? 'تصميم المواقع' : 'Web Design'}</Link></li>
              <li><Link to={getLocalizedPath('/stok-ve-depo-sistemi', i18n.language)} className="text-slate-400 hover:text-teal-300 text-sm font-medium transition-colors">{i18n.language === 'tr' ? 'Stok & API Entegrasyon' : i18n.language === 'ar' ? 'المخزون والربط البرمجي' : 'Inventory API Sync'}</Link></li>
              <li><Link to={getLocalizedPath('/fatih-web-tasarim', i18n.language)} className="text-slate-400 hover:text-teal-300 text-sm font-medium transition-colors">{i18n.language === 'tr' ? 'Fatih Web Tasarım' : i18n.language === 'ar' ? 'تصميم مواقع الفاتح' : 'Fatih Web Design'}</Link></li>
            </ul>
          </div>

          {/* Global Profiles & Stack */}
          <div className="flex flex-col gap-4">
            <span className="font-bold text-xs text-slate-200 tracking-wider uppercase">
              {i18n.language === 'tr' ? 'UZMANLIK' : i18n.language === 'ar' ? 'الخبرات' : 'EXPERTISE'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['Shopify Partner', 'İKAS Specialist', 'React', 'Next.js', 'Node.js', 'REST & GraphQL', 'Tailwind', 'PostgreSQL'].map((tech) => (
                <span key={tech} className="px-2.5 py-1 bg-slate-800/90 border border-slate-700/80 rounded-lg text-xs font-semibold text-slate-300">
                  {tech}
                </span>
              ))}
            </div>
            <div className="pt-2">
              <Link 
                to={getLocalizedPath('/iletisim', i18n.language)} 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
              >
                <Sparkles size={14} />
                <span>
                  {i18n.language === 'tr' ? 'Projenizi konuşalım →' : i18n.language === 'ar' ? '← لنناقش مشروعك' : 'Start a project →'}
                </span>
              </Link>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-slate-500">
          <span>
            © {currentYear} Samer Allaham — E-Commerce Systems & Engineering. İstanbul, TR.{' '}
            <a
              href="https://www.samer.life/"
              target="_blank"
              rel="nofollow noopener"
              title="Developer Portfolio"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              Built by
            </a>
          </span>
          <span className="flex items-center gap-2 text-teal-400/80 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            {i18n.language === 'ar' ? 'متاح للمشاريع الجديدة' : 'AVAILABLE FOR NEW PROJECTS'}
          </span>
        </div>

      </div>
    </footer>
  );
}
