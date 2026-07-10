import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowDownRight, Menu, X, Globe } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
    { name: t('nav.home'), path: '/' },
    { name: t('nav.services'), path: '/hizmetler' },
    { name: t('nav.case_studies'), path: '/basari-hikayeleri' },
    { name: t('nav.blog'), path: '/blog' },
    { name: t('nav.about'), path: '/hakkimda' },
    { name: t('nav.contact'), path: '/iletisim' }
  ];

  const handleLangChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const isRtl = i18n.language === 'ar';

  return (
    <nav className={`fixed top-0 w-full z-[2000] flex items-center transition-all duration-300 ${scrolled ? 'h-20 bg-[#050505]/80 backdrop-blur-md border-b border-white/5' : 'h-24 bg-transparent'}`}>
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 flex justify-between items-center">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#00ffaa]/10 border border-[#00ffaa]/20 rounded-xl flex items-center justify-center group-hover:bg-[#00ffaa] transition-all duration-300">
            <ArrowDownRight className="text-[#00ffaa] group-hover:text-black transition-colors" size={20} />
          </div>
          <div className="flex flex-col text-left">
            <span className="mono font-black text-base tracking-tighter leading-none text-white">SAMER ALLAHAM</span>
            <span className="mono text-[8px] text-[#00ffaa] tracking-[0.2em] font-bold uppercase mt-1">
              {i18n.language === 'tr' ? 'E-Ticaret Sistemleri' : i18n.language === 'ar' ? 'أنظمة التجارة الإلكترونية' : 'E-Commerce Systems'}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `mono text-[10px] font-black uppercase tracking-[0.15em] transition-colors hover:text-[#00ffaa] ${
                  isActive ? 'text-[#00ffaa] relative after:content-[""] after:absolute after:bottom-[-6px] after:left-0 after:w-full after:height-[1.5px] after:bg-[#00ffaa]' : 'text-neutral-400'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Action Panel: Lang & CTA */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Language Selector */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5">
            {['tr', 'en', 'ar'].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLangChange(lang)}
                className={`w-8 h-8 rounded-full mono text-[9px] font-black flex items-center justify-center transition-all cursor-pointer ${
                  i18n.language === lang ? 'bg-[#00ffaa] text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <Link
            to="/iletisim"
            className="px-6 py-2.5 bg-[#00ffaa] text-black rounded-full mono text-[10px] font-black hover:scale-105 transition-all duration-300"
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
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-[#00ffaa] transition-colors"
            >
              <Globe size={16} />
            </button>
            <span className="mono text-[10px] font-bold text-[#00ffaa] pr-3 pl-1 uppercase">{i18n.language}</span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-[#00ffaa] transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`fixed inset-0 top-20 w-full h-[calc(100vh-80px)] bg-[#050505] z-[1999] border-t border-white/5 flex flex-col justify-between p-8 lg:hidden transition-all duration-300 ${isOpen ? 'translate-x-0 opacity-100' : isRtl ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'}`}>
        <div className="flex flex-col gap-6 text-left">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="mono text-2xl font-black uppercase tracking-wider text-neutral-300 hover:text-[#00ffaa] transition-colors"
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
                  i18n.language === lang ? 'bg-[#00ffaa] text-black' : 'text-neutral-400'
                }`}
              >
                {lang === 'tr' ? 'TÜRKÇE' : lang === 'en' ? 'ENGLISH' : 'العربية'}
              </button>
            ))}
          </div>

          <Link
            to="/iletisim"
            onClick={() => setIsOpen(false)}
            className="w-full py-4 bg-[#00ffaa] text-black text-center rounded-2xl mono text-xs font-black hover:scale-102 transition-all"
          >
            {t('nav.cta').toUpperCase()}
          </Link>
        </div>
      </div>
    </nav>
  );
}
