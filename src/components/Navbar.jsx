import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowDownRight, Menu, X, Globe } from 'lucide-react';
import { getLocalizedPath, getLanguageUrl } from '../utils/navigation';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { name: t('nav.home'), path: getLocalizedPath('/', i18n.language) },
    { name: t('nav.services'), path: getLocalizedPath('/hizmetler', i18n.language) },
    { name: t('nav.case_studies'), path: getLocalizedPath('/basari-hikayeleri', i18n.language) },
    { name: t('nav.blog'), path: getLocalizedPath('/blog', i18n.language) },
    { name: t('nav.faq', { defaultValue: i18n.language === 'tr' ? 'SSS' : i18n.language === 'ar' ? 'الأسئلة' : 'FAQ' }), path: getLocalizedPath('/faq', i18n.language) },
    { name: t('nav.about'), path: getLocalizedPath('/hakkimda', i18n.language) },
    { name: t('nav.contact'), path: getLocalizedPath('/iletisim', i18n.language) }
  ];

  const handleLangChange = (lang) => {
    i18n.changeLanguage(lang);
    const targetUrl = getLanguageUrl(location.pathname, lang);
    navigate(targetUrl);
  };

  const isRtl = i18n.language === 'ar';

  return (
    <nav className={`fixed top-0 w-full z-[2000] flex items-center transition-all duration-300 ${scrolled ? 'h-20 bg-[#0b0f19]/90 backdrop-blur-md border-b border-white/5' : 'h-24 bg-transparent'}`}>
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 xl:px-12 flex justify-between items-center gap-4">
        
        {/* Brand Logo */}
        <Link to={getLocalizedPath('/', i18n.language)} className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-10 h-10 bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 rounded-xl flex items-center justify-center group-hover:bg-[#ff6b6b] transition-all duration-300">
            <ArrowDownRight className="text-[#ff6b6b] group-hover:text-white transition-colors" size={20} />
          </div>
          <div className="flex flex-col text-left">
            <span className="mono font-black text-sm md:text-base tracking-tighter leading-none text-white">SAMER ALLAHAM</span>
            <span className="mono text-[8px] text-[#ff6b6b] tracking-[0.2em] font-bold uppercase mt-1">
              {i18n.language === 'tr' ? 'E-Ticaret Sistemleri' : i18n.language === 'ar' ? 'أنظمة التجارة الإلكترونية' : 'E-Commerce Systems'}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-8 flex-shrink-0">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `mono text-[9px] xl:text-[10px] font-black uppercase tracking-[0.15em] transition-colors hover:text-[#ff6b6b] ${
                  isActive ? 'text-[#ff6b6b] relative after:content-[""] after:absolute after:bottom-[-6px] after:left-0 after:w-full after:height-[1.5px] after:bg-[#ff6b6b]' : 'text-neutral-400'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Action Panel: Lang & CTA */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6 flex-shrink-0">
          {/* Language Selector */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5">
            {['tr', 'en', 'ar'].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLangChange(lang)}
                className={`w-8 h-8 rounded-full mono text-[9px] font-black flex items-center justify-center transition-all cursor-pointer ${
                  i18n.language === lang ? 'bg-[#ff6b6b] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <Link
            to={getLocalizedPath('/iletisim', i18n.language)}
            className="inline-flex items-center justify-center px-4 xl:px-6 py-2.5 bg-[#ff6b6b] text-white hover:bg-[#ff5252] rounded-full mono text-[9px] xl:text-[10px] font-black hover:scale-105 transition-all duration-300"
          >
            {t('nav.cta').toUpperCase()}
          </Link>
        </div>

          {/* Mobile Toggle & Menu Buttons */}
          <div className="flex items-center gap-4 lg:hidden">
            {/* Mobile Language Switch Quick Select */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5">
              <button
                onClick={() => handleLangChange(i18n.language === 'tr' ? 'en' : i18n.language === 'en' ? 'ar' : 'tr')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-[#ff6b6b] transition-colors"
                aria-label="Change language"
              >
                <Globe size={16} />
              </button>
              <span className="mono text-[10px] font-bold text-[#ff6b6b] pr-3 pl-1 uppercase">{i18n.language}</span>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-[#ff6b6b] transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`fixed inset-0 top-20 w-full h-[calc(100vh-80px)] bg-[#0b0f19] z-[1999] border-t border-white/5 flex flex-col justify-between p-8 lg:hidden transition-all duration-300 ${isOpen ? 'translate-x-0 opacity-100' : isRtl ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'}`}>
        <div className="flex flex-col gap-6 text-left">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="mono text-2xl font-black uppercase tracking-wider text-neutral-300 hover:text-[#ff6b6b] transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          {/* Full Lang Option inside menu */}
          <div className="flex justify-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2">
            {['tr', 'en', 'ar'].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLangChange(lang)}
                className={`px-4 py-2 rounded-xl mono text-[10px] font-black cursor-pointer ${
                  i18n.language === lang ? 'bg-[#ff6b6b] text-white' : 'text-neutral-400'
                }`}
              >
                {lang === 'tr' ? 'TÜRKÇE' : lang === 'en' ? 'ENGLISH' : 'العربية'}
              </button>
            ))}
          </div>

          <Link
            to={getLocalizedPath('/iletisim', i18n.language)}
            onClick={() => setIsOpen(false)}
            className="w-full py-4 bg-[#ff6b6b] text-white text-center rounded-2xl mono text-xs font-black hover:scale-102 transition-all"
          >
            {t('nav.cta').toUpperCase()}
          </Link>
        </div>
      </div>
    </nav>
  );
}
