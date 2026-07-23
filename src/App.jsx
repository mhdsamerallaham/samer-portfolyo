import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import { useTranslation } from 'react-i18next';

// i18n initialization import (Fixes react-i18next useTranslation warning)
import './i18n';

// Components that are always visible (not lazy loaded)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Lazy-loaded pages for code splitting (reduces initial bundle drastically)
const Home = lazy(() => import('./pages/Home'));
const ServicesOverview = lazy(() => import('./pages/ServicesOverview'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const Blog = lazy(() => import('./pages/Blog'));
const FAQ = lazy(() => import('./pages/FAQ'));
const FAQDetail = lazy(() => import('./pages/FAQDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

// Minimal loading spinner for Suspense fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-[#ff6b6b]/30 border-t-[#ff6b6b] rounded-full animate-spin" />
    </div>
  );
}

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

  // Setup Lenis smooth scrolling — DISABLED on mobile to prevent jank and improve performance
  useEffect(() => {
    // Skip Lenis on mobile/tablet devices (screen width < 1024 or touch device)
    const isMobile = window.innerWidth < 1024 || 'ontouchstart' in window;
    if (isMobile) return;

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

  // Sync i18n language with pathname prefix (/en or /ar)
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/en/') || path === '/en') {
      if (i18n.language !== 'en') i18n.changeLanguage('en');
    } else if (path.startsWith('/ar/') || path === '/ar') {
      if (i18n.language !== 'ar') i18n.changeLanguage('ar');
    } else {
      if (i18n.language !== 'tr') i18n.changeLanguage('tr');
    }
  }, [location.pathname, i18n]);

  // Update HTML tag text direction dynamically for RTL language support (Arabic)
  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language || 'tr';
  }, [i18n.language]);

  return (
    <div className="bg-[#0b0f19] text-white min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Dynamic Background Mesh Gradients — reduced blur on mobile via CSS class */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ff6b6b]/5 rounded-full mesh-blur pointer-events-none" />
      <div className="absolute top-[800px] left-0 w-[500px] h-[500px] bg-[#3b82f6]/3 rounded-full mesh-blur pointer-events-none hidden md:block" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#ff6b6b]/3 rounded-full mesh-blur pointer-events-none hidden md:block" />

      {/* Force page scroll resets */}
      <ScrollToTop />

      {/* Global Navigation bar */}
      <Navbar />

      {/* Route Switchboard with Suspense for lazy-loaded pages */}
      <main className="flex-grow z-10 relative">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* === TURKISH ROUTES (Default) === */}
            <Route path="/" element={<Home />} />
            <Route path="/hizmetler" element={<ServicesOverview />} />
            <Route path="/web-tasarim" element={<ServiceDetail />} />
            <Route path="/e-ticaret-web-tasarim" element={<ServiceDetail />} />
            <Route path="/eticaret-site-kurulumu" element={<ServiceDetail />} />
            <Route path="/eticaret-optimizasyon" element={<ServiceDetail />} />
            <Route path="/urun-gorsel-ve-icerik" element={<ServiceDetail />} />
            <Route path="/stok-ve-depo-sistemi" element={<ServiceDetail />} />
            <Route path="/aylik-yonetim" element={<ServiceDetail />} />
            <Route path="/web-sitesi-gelistirme" element={<ServiceDetail />} />
            <Route path="/ozel-yazilim-gelistirme" element={<ServiceDetail />} />
            <Route path="/yapay-zeka-cozumleri" element={<ServiceDetail />} />
            <Route path="/basari-hikayeleri" element={<CaseStudies />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Blog />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/faq/:slug" element={<FAQDetail />} />
            <Route path="/sss" element={<FAQ />} />
            <Route path="/sss/:slug" element={<FAQDetail />} />
            <Route path="/hakkimda" element={<About />} />
            <Route path="/iletisim" element={<Contact />} />

            {/* === ENGLISH ROUTES === */}
            <Route path="/en" element={<Home />} />
            <Route path="/en/services" element={<ServicesOverview />} />
            <Route path="/en/web-design" element={<ServiceDetail />} />
            <Route path="/en/ecommerce-web-design" element={<ServiceDetail />} />
            <Route path="/en/ecommerce-setup" element={<ServiceDetail />} />
            <Route path="/en/ecommerce-optimization" element={<ServiceDetail />} />
            <Route path="/en/product-visuals-content" element={<ServiceDetail />} />
            <Route path="/en/inventory-stock-automation" element={<ServiceDetail />} />
            <Route path="/en/monthly-management" element={<ServiceDetail />} />
            <Route path="/en/web-development" element={<ServiceDetail />} />
            <Route path="/en/custom-software" element={<ServiceDetail />} />
            <Route path="/en/ai-solutions" element={<ServiceDetail />} />
            <Route path="/en/case-studies" element={<CaseStudies />} />
            <Route path="/en/blog" element={<Blog />} />
            <Route path="/en/blog/:slug" element={<Blog />} />
            <Route path="/en/faq" element={<FAQ />} />
            <Route path="/en/faq/:slug" element={<FAQDetail />} />
            <Route path="/en/about" element={<About />} />
            <Route path="/en/contact" element={<Contact />} />

            {/* === ARABIC ROUTES === */}
            <Route path="/ar" element={<Home />} />
            <Route path="/ar/services" element={<ServicesOverview />} />
            <Route path="/ar/web-design" element={<ServiceDetail />} />
            <Route path="/ar/ecommerce-web-design" element={<ServiceDetail />} />
            <Route path="/ar/shopify-setup-turkey" element={<ServiceDetail />} />
            <Route path="/ar/ecommerce-optimization" element={<ServiceDetail />} />
            <Route path="/ar/product-content-ai" element={<ServiceDetail />} />
            <Route path="/ar/stock-inventory-system" element={<ServiceDetail />} />
            <Route path="/ar/monthly-ecommerce-management" element={<ServiceDetail />} />
            <Route path="/ar/web-development" element={<ServiceDetail />} />
            <Route path="/ar/custom-software" element={<ServiceDetail />} />
            <Route path="/ar/ai-solutions" element={<ServiceDetail />} />
            <Route path="/ar/case-studies" element={<CaseStudies />} />
            <Route path="/ar/blog" element={<Blog />} />
            <Route path="/ar/blog/:slug" element={<Blog />} />
            <Route path="/ar/faq" element={<FAQ />} />
            <Route path="/ar/faq/:slug" element={<FAQDetail />} />
            <Route path="/ar/about" element={<About />} />
            <Route path="/ar/contact" element={<Contact />} />

            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* Global rich footer */}
      <Footer />

      {/* Floating WhatsApp chat widget */}
      <WhatsAppButton />
    </div>
  );
}

export default App;
