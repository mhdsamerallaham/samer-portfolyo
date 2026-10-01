import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowDownRight, Menu, X, Globe, Sparkles } from 'lucide-react';
import { getLocalizedPath, getLanguageUrl } from '../utils/navigation';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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
    <nav 
      aria-label="Main Navigation"
      className={`fixed top-0 w-full z-[2000] flex items-center transition-all duration-300 ${
        scrolled 
          ? 'h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)]' 
          : 'h-24 bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-8 xl:px-12 flex justify-between items-center gap-4">
        
        {/* Brand Logo */}
        <Link 
          to={getLocalizedPath('/', i18n.language)} 
          className="flex items-center gap-3 group flex-shrink-0"
          aria-label="Samer Allaham Portfolio Home"
        >
          <div className="w-10 h-10 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-center group-hover:bg-teal-600 group-hover:border-teal-600 transition-all duration-300 shadow-sm">
            <ArrowDownRight className="text-teal-600 group-hover:text-white transition-colors" size={20} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display font-extrabold text-base md:text-lg tracking-tight leading-none text-slate-900">
              SAMER ALLAHAM
            </span>
            <span className="font-semibold text-[10px] text-teal-600 tracking-wider uppercase mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              {i18n.language === 'tr' ? 'E-Ticaret & Web Geliştirici' : i18n.language === 'ar' ? 'مطور متاجر الكترونية' : 'E-Commerce & Full-Stack'}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-6 flex-shrink-0">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'text-teal-700 bg-teal-50/80 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Action Panel: Lang & CTA */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-5 flex-shrink-0">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-100/90 border border-slate-200 rounded-full p-1 shadow-inner">
            {['tr', 'en', 'ar'].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLangChange(lang)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  i18n.language === lang 
                    ? 'bg-teal-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label={`Switch to ${lang.toUpperCase()}`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <Link
            to={getLocalizedPath('/iletisim', i18n.language)}
            className="inline-flex items-center justify-center gap-1.5 px-5 xl:px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full text-xs tracking-wide shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Sparkles size={14} className="text-orange-200" />
            {t('nav.cta')}
          </Link>
        </div>

        {/* Mobile Toggle & Menu Buttons */}
        <div className="flex items-center gap-2.5 lg:hidden">
          {/* Mobile Language Switch Quick Select */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-1">
            <button
              onClick={() => handleLangChange(i18n.language === 'tr' ? 'en' : i18n.language === 'en' ? 'ar' : 'tr')}
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:text-teal-600 transition-colors"
              aria-label="Change language"
            >
              <Globe size={15} />
            </button>
            <span className="text-[11px] font-bold text-teal-700 pr-2.5 pl-1 uppercase">{i18n.language}</span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Overlay — slides from right in LTR, from left in RTL */}
      <div 
        className={`fixed inset-0 top-20 w-full h-[calc(100vh-80px)] bg-white z-[1999] border-t border-slate-200 flex flex-col justify-between p-6 sm:p-8 lg:hidden transition-all duration-300 shadow-xl ${
          isOpen ? 'translate-x-0 opacity-100' : isRtl ? 'translate-x-full opacity-0 pointer-events-none' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className={`flex flex-col gap-3 ${isRtl ? 'text-right' : 'text-left'}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="font-display text-xl font-bold text-slate-800 hover:text-teal-600 py-2 border-b border-slate-100 transition-colors flex items-center justify-between"
            >
              {isRtl ? (
                <>
                  <ArrowDownRight size={18} className="text-slate-400 scale-x-[-1]" />
                  <span>{item.name}</span>
                </>
              ) : (
                <>
                  <span>{item.name}</span>
                  <ArrowDownRight size={18} className="text-slate-400" />
                </>
              )}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
          {/* Full Lang Option inside menu */}
          <div className="flex justify-center gap-2 bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
            {['tr', 'en', 'ar'].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLangChange(lang)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  i18n.language === lang 
                    ? 'bg-teal-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'tr' ? 'Türkçe' : lang === 'en' ? 'English' : 'العربية'}
              </button>
            ))}
          </div>

          <Link
            to={getLocalizedPath('/iletisim', i18n.language)}
            onClick={() => setIsOpen(false)}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white text-center font-bold rounded-2xl text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            {t('nav.cta')}
          </Link>
        </div>
      </div>
    </nav>
  );
}

