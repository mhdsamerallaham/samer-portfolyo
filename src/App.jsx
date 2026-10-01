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
const DesignPreviewA = lazy(() => import('./pages/DesignPreviewA'));
const DesignPreviewB = lazy(() => import('./pages/DesignPreviewB'));

// Minimal loading spinner for Suspense fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
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
  const location = useLocation();

  const isPreview = location.pathname.includes('design-preview');

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

  // Sync i18n language with URL prefix AND immediately update document attributes
  // (before react-helmet-async fires) to prevent a dir= flash on hard navigation.
  useEffect(() => {
    const path = location.pathname;
    let targetLang = 'tr';
    if (path.startsWith('/en/') || path === '/en') targetLang = 'en';
    else if (path.startsWith('/ar/') || path === '/ar') targetLang = 'ar';

    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang);
    }

    // Set document attributes immediately — Helmet will also set these but this
    // ensures the FIRST paint after a hard /ar/ navigation is already RTL.
    const dir = targetLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', targetLang);
  }, [location.pathname, i18n]);

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen flex flex-col relative overflow-x-hidden selection:bg-teal-100 selection:text-teal-900">
      {/* Subtle ambient light accents (only on regular pages) */}
      {!isPreview && (
        <>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/[0.04] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-[800px] left-0 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-3xl pointer-events-none hidden md:block" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/[0.03] rounded-full blur-3xl pointer-events-none hidden md:block" />
        </>
      )}

      {/* Force page scroll resets */}
      <ScrollToTop />

      {/* Global Navigation bar (Hidden on preview routes for pure layout isolation) */}
      {!isPreview && <Navbar />}

      {/* Route Switchboard with Suspense for lazy-loaded pages */}
      <main className="flex-grow z-10 relative">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* === ISOLATED DESIGN PREVIEW ROUTES === */}
            <Route path="/design-preview-a" element={<DesignPreviewA />} />
            <Route path="/design-preview-b" element={<DesignPreviewB />} />
            <Route path="/en/design-preview-a" element={<DesignPreviewA />} />
            <Route path="/en/design-preview-b" element={<DesignPreviewB />} />
            <Route path="/ar/design-preview-a" element={<DesignPreviewA />} />
            <Route path="/ar/design-preview-b" element={<DesignPreviewB />} />

            {/* === TURKISH ROUTES (Default) === */}
            <Route path="/" element={<Home />} />
            <Route path="/hizmetler" element={<ServicesOverview />} />
            <Route path="/web-tasarim" element={<ServiceDetail />} />
            <Route path="/istanbul-web-tasarim" element={<ServiceDetail />} />
            <Route path="/fatih-web-tasarim" element={<ServiceDetail />} />
            <Route path="/e-ticaret-web-tasarim" element={<ServiceDetail />} />
            <Route path="/eticaret-site-kurulumu" element={<ServiceDetail />} />
            <Route path="/eticaret-optimizasyon" element={<ServiceDetail />} />
            <Route path="/urun-gorsel-ve-icerik" element={<ServiceDetail />} />
            <Route path="/stok-ve-depo-sistemi" element={<ServiceDetail />} />
            <Route path="/aylik-yonetim" element={<ServiceDetail />} />
            <Route path="/web-sitesi-gelistirme" element={<ServiceDetail />} />
            <Route path="/ozel-yazilim-gelistirme" element={<ServiceDetail />} />
            <Route path="/yapay-zeka-cozumleri" element={<ServiceDetail />} />
            <Route path="/hizmetler/geo-yapay-zeka-optimizasyonu" element={<ServiceDetail />} />
            <Route path="/geo-yapay-zeka-optimizasyonu" element={<ServiceDetail />} />
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
            <Route path="/en/istanbul-web-design" element={<ServiceDetail />} />
            <Route path="/en/fatih-web-design" element={<ServiceDetail />} />
            <Route path="/en/ecommerce-web-design" element={<ServiceDetail />} />
            <Route path="/en/ecommerce-setup" element={<ServiceDetail />} />
            <Route path="/en/ecommerce-optimization" element={<ServiceDetail />} />
            <Route path="/en/product-visuals-content" element={<ServiceDetail />} />
            <Route path="/en/inventory-stock-automation" element={<ServiceDetail />} />
            <Route path="/en/monthly-management" element={<ServiceDetail />} />
            <Route path="/en/web-development" element={<ServiceDetail />} />
            <Route path="/en/custom-software" element={<ServiceDetail />} />
            <Route path="/en/ai-solutions" element={<ServiceDetail />} />
            <Route path="/en/services/generative-engine-optimization" element={<ServiceDetail />} />
            <Route path="/en/generative-engine-optimization" element={<ServiceDetail />} />
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
            <Route path="/ar/istanbul-web-design" element={<ServiceDetail />} />
            <Route path="/ar/fatih-web-design" element={<ServiceDetail />} />
            <Route path="/ar/ecommerce-web-design" element={<ServiceDetail />} />
            <Route path="/ar/shopify-setup-turkey" element={<ServiceDetail />} />
            <Route path="/ar/ecommerce-optimization" element={<ServiceDetail />} />
            <Route path="/ar/product-content-ai" element={<ServiceDetail />} />
            <Route path="/ar/stock-inventory-system" element={<ServiceDetail />} />
            <Route path="/ar/monthly-ecommerce-management" element={<ServiceDetail />} />
            <Route path="/ar/web-development" element={<ServiceDetail />} />
            <Route path="/ar/custom-software" element={<ServiceDetail />} />
            <Route path="/ar/ai-solutions" element={<ServiceDetail />} />
            <Route path="/ar/services/generative-engine-optimization" element={<ServiceDetail />} />
            <Route path="/ar/generative-engine-optimization" element={<ServiceDetail />} />
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

      {/* Global rich footer (Hidden on preview routes) */}
      {!isPreview && <Footer />}

      {/* Floating WhatsApp chat widget (Hidden on preview routes) */}
      {!isPreview && <WhatsAppButton />}
    </div>
  );
}

export default App;
