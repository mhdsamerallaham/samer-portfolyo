import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import { useTranslation } from 'react-i18next';

// i18n initialization import (Fixes react-i18next useTranslation warning)
import './i18n';

// Components & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import ServicesOverview from './pages/ServicesOverview';
import ServiceDetail from './pages/ServiceDetail';
import CaseStudies from './pages/CaseStudies';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const { i18n } = useTranslation();

  // Setup Lenis smooth scrolling (deferred to avoid layout thrashing during initial mount)
  useEffect(() => {
    let lenis;
    let rafId;

    const initLenis = () => {
      lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });

      function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    };

    const timerId = setTimeout(initLenis, 150);

    return () => {
      clearTimeout(timerId);
      if (lenis) lenis.destroy();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Update HTML tag text direction dynamically for RTL language support (Arabic)
  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language || 'tr';
  }, [i18n.language]);

  return (
    <div className="bg-[#0b0f19] text-white min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ff6b6b]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[800px] left-0 w-[500px] h-[500px] bg-[#3b82f6]/3 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#ff6b6b]/3 rounded-full blur-[140px] pointer-events-none" />

      {/* Force page scroll resets */}
      <ScrollToTop />

      {/* Global Navigation bar */}
      <Navbar />

      {/* Route Switchboard */}
      <main className="flex-grow z-10 relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hizmetler" element={<ServicesOverview />} />
          
          {/* Individual Service Subpages */}
          <Route path="/eticaret-site-kurulumu" element={<ServiceDetail />} />
          <Route path="/eticaret-optimizasyon" element={<ServiceDetail />} />
          <Route path="/urun-gorsel-ve-icerik" element={<ServiceDetail />} />
          <Route path="/stok-ve-depo-sistemi" element={<ServiceDetail />} />
          <Route path="/aylik-yonetim" element={<ServiceDetail />} />
          <Route path="/web-sitesi-gelistirme" element={<ServiceDetail />} />
          <Route path="/ozel-yazilim-gelistirme" element={<ServiceDetail />} />
          <Route path="/yapay-zeka-cozumleri" element={<ServiceDetail />} />

          {/* Success studies, bio about, blog listing and contact form */}
          <Route path="/basari-hikayeleri" element={<CaseStudies />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Blog />} />
          <Route path="/hakkimda" element={<About />} />
          <Route path="/iletisim" element={<Contact />} />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global rich footer */}
      <Footer />

      {/* Floating WhatsApp chat widget */}
      <WhatsAppButton />
    </div>
  );
}

export default App;
