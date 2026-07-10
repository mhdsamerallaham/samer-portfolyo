import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import { useTranslation } from 'react-i18next';

// Components & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ServicesOverview from './pages/ServicesOverview';
import ServiceDetail from './pages/ServiceDetail';
import CaseStudies from './pages/CaseStudies';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';

class Star {
  init() {
    this.x = (Math.random() - 0.5) * 1000;
    this.y = (Math.random() - 0.5) * 1000;
    this.z = Math.random() * 1000;
  }
  update() {
    this.z -= 1.5; // Smooth scroll movement speed
    if (this.z <= 0) this.init();
  }
  draw(ctx, w, h) {
    const x = (this.x / this.z) * w + w / 2;
    const y = (this.y / this.z) * h + h / 2;
    const s = (1 - this.z / 1000) * 2;
    const o = (1 - this.z / 1000);
    ctx.fillStyle = `rgba(255, 255, 255, ${o * 0.4})`; // Muted opacity for non-intrusive backdrop
    ctx.fillRect(x, y, s, s);
  }
}

// Starfield Background Canvas
const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let w, h;
    const stars = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const setup = () => {
      resize();
      for (let i = 0; i < 200; i++) {
        const star = new Star();
        star.init();
        stars.push(star);
      }
    };

    const render = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);
      stars.forEach(s => { s.update(); s.draw(ctx, w, h); });
      animationFrameId = requestAnimationFrame(render);
    };

    setup();
    render();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

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

  // Setup Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Update HTML tag text direction dynamically for RTL language support (Arabic)
  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language || 'tr';
  }, [i18n.language]);

  return (
    <div className="bg-[#050505] text-white min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Central Canvas Starfield backdrop */}
      <Starfield />
      
      {/* Background abstract grid lines */}
      <div className="grid-bg" />

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

          {/* Success studies, bio about, blog listing and contact form */}
          <Route path="/basari-hikayeleri" element={<CaseStudies />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/hakkimda" element={<About />} />
          <Route path="/iletisim" element={<Contact />} />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global rich footer */}
      <Footer />
    </div>
  );
}

export default App;
