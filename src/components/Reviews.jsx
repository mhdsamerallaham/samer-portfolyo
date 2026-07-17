import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle } from 'lucide-react';

export default function Reviews() {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  // Fallback reviews array translated inline in case translation files are compiling
  const defaultReviews = [
    {
      name: 'Ahmet Y.',
      role: i18n.language === 'tr' ? 'AIO Coffee CEO' : i18n.language === 'ar' ? 'الرئيس التنفيذي لـ AIO Coffee' : 'AIO Coffee CEO',
      rating: 5,
      text: i18n.language === 'tr' 
        ? 'Samer ile checkout ve hız optimizasyonu üzerinde çalıştık. Dönüşüm oranımız %35 arttı. İş disiplini ve teknik bilgisi harika.' 
        : i18n.language === 'ar'
        ? 'عملنا مع سامر على تحسين سرعة الدفع وصفحة الدفع. ارتفع معدل التحويل لدينا بنسبة 35٪. انضباطه في العمل ومعرفته التقنية رائعة.'
        : 'We worked with Samer on checkout and speed optimization. Our conversion rate increased by 35%. His work discipline and technical knowledge is excellent.'
    },
    {
      name: 'Elif K.',
      role: i18n.language === 'tr' ? 'Moda Butiği Kurucusu' : i18n.language === 'ar' ? 'مؤسسة متجر Moda Butiği' : 'Moda Butiği Founder',
      rating: 5,
      text: i18n.language === 'tr'
        ? 'Wordpress sitemizi İKAS altyapısına sorunsuz taşıdı. Sayfa hızımız 1.1 saniyeye düştü. Destek ve yönlendirmeleri için çok teşekkürler.'
        : i18n.language === 'ar'
        ? 'لقد نقل موقعنا من ووردبريس إلى إيكاس بسلاسة تامة. انخفضت سرعة تحميل صفحتنا إلى 1.1 ثانية. شكراً جزيلاً لدعمه وتوجيهه.'
        : 'He migrated our WordPress site to İKAS seamlessly. Our page load speed dropped to 1.1s. Thanks a lot for his support and guidance.'
    },
    {
      name: 'Omar B.',
      role: i18n.language === 'tr' ? 'Global E-Ticaret Müdürü' : i18n.language === 'ar' ? 'مدير العمليات التجارية العالمية' : 'Global E-Commerce Manager',
      rating: 5,
      text: i18n.language === 'tr'
        ? 'Shopify ve Trendyol arasındaki stok senkronizasyon yazılımını geliştirdi. Manuel hatalardan kaynaklanan cezalarımız tamamen bitti.'
        : i18n.language === 'ar'
        ? 'قام بتطوير برنامج مزامنة المخزون بين شوبيفاي وترينديول. انتهت الغرامات الناتجة عن الأخطاء اليدوية تماماً.'
        : 'He developed the inventory synchronization software between Shopify and Trendyol. Our penalties caused by manual errors are completely gone.'
    }
  ];

  // Try to load translated reviews, fallback to defaultReviews
  const reviewsItems = t('reviews.items', { returnObjects: true }) || defaultReviews;
  const reviews = Array.isArray(reviewsItems) && reviewsItems.length > 0 ? reviewsItems : defaultReviews;

  const nextSlide = () => {
    setAnimate(false);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
      setAnimate(true);
    }, 150);
  };

  const prevSlide = () => {
    setAnimate(false);
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
      setAnimate(true);
    }, 150);
  };

  // Autoplay slider every 6 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <section className="px-6 md:px-12 py-28 lg:py-36 max-w-[1200px] mx-auto border-t border-white/5 relative">
      <div className="absolute inset-0 bg-[#ff6b6b]/2 rounded-full blur-[100px] pointer-events-none w-72 h-72 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      
      {/* Title block */}
      <div className="text-center mb-16 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
          <CheckCircle className="text-[#ff6b6b]" size={12} />
          <span className="mono text-[8px] tracking-[0.15em] font-black uppercase text-neutral-300">
            {i18n.language === 'tr' ? '100% DOĞRULANMIŞ MÜŞTERİ YORUMLARI' : i18n.language === 'ar' ? 'مراجعات عملاء موثقة ١٠٠٪' : '100% VERIFIED CUSTOMER REVIEWS'}
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          {i18n.language === 'tr' ? 'Müşteri Yorumları' : i18n.language === 'ar' ? 'آراء العملاء' : 'Customer Reviews'}
        </h2>
        <p className="text-neutral-400 text-xs md:text-sm max-w-xl font-semibold leading-relaxed">
          {i18n.language === 'tr' 
            ? 'Birlikte çalıştığımız e-ticaret markalarının ve girişimcilerin Google Maps / Benim İşletmem üzerinden paylaştığı görüşler.' 
            : i18n.language === 'ar' 
            ? 'مراجعات وتعليقات حقيقية من العلامات التجارية ورواد الأعمال الذين تعاونا معهم في تحسين وتصميم متاجرهم.' 
            : 'Genuine feedback shared by e-commerce brands and entrepreneurs we partner with, verified on Google Maps.'}
        </p>
      </div>

      {/* Main Review Card & Carousel Controls */}
      <div className="max-w-[850px] mx-auto relative">
        
        {/* Carousel Inner Container */}
        <div className="relative bg-bg-card border border-white/5 rounded-3xl p-8 md:p-12 xl:p-16 shadow-2xl backdrop-blur-sm overflow-hidden flex flex-col justify-between min-h-[300px]">
          
          {/* Big Quote background decoration */}
          <div className="absolute right-8 top-8 opacity-[0.03] text-[#ff6b6b] pointer-events-none">
            <Quote size={120} />
          </div>

          <div className={`transition-all duration-300 transform ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
            {/* Stars */}
            <div className="flex gap-1 mb-6 justify-start">
              {Array.from({ length: reviews[activeIndex].rating || 5 }).map((_, i) => (
                <Star key={i} className="text-[#ffc107] fill-[#ffc107]" size={16} />
              ))}
            </div>

            {/* Review Text */}
            <p className="text-lg md:text-xl font-bold leading-relaxed text-white text-start mb-8 italic">
              "{reviews[activeIndex].text}"
            </p>
          </div>

          {/* Review Author detail */}
          <div className={`flex justify-between items-end border-t border-white/5 pt-8 mt-4 transition-all duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-col text-start gap-1">
              <span className="mono text-xs font-black text-white uppercase tracking-wider">{reviews[activeIndex].name}</span>
              <span className="text-[10px] md:text-xs text-neutral-400 font-bold">{reviews[activeIndex].role}</span>
            </div>

            {/* Google Rating Badge */}
            <div className="flex items-center gap-2 bg-[#ff6b6b]/5 border border-[#ff6b6b]/10 rounded-xl px-3 py-1.5">
              <span className="mono text-[8px] md:text-[9px] font-black text-[#ff6b6b] uppercase tracking-wider">
                {i18n.language === 'tr' ? 'GOOGLE HARİTALAR' : i18n.language === 'ar' ? 'خرائط جوجل' : 'GOOGLE MAPS'}
              </span>
              <div className="w-[1.5px] h-3 bg-white/10" />
              <span className="mono text-[10px] font-bold text-white">5.0 / 5.0 ★</span>
            </div>
          </div>
        </div>

        {/* Carousel controls - desktop arrows */}
        <div className="hidden md:flex justify-between absolute top-1/2 transform -translate-y-1/2 -left-8 -right-8 w-[calc(100%+64px)] pointer-events-none">
          <button 
            onClick={prevSlide}
            aria-label="Previous review"
            className="w-12 h-12 rounded-full border border-white/10 bg-[#0e1423]/60 backdrop-blur-md text-white hover:text-[#ff6b6b] hover:border-[#ff6b6b]/30 flex items-center justify-center transition-all cursor-pointer pointer-events-auto"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            aria-label="Next review"
            className="w-12 h-12 rounded-full border border-white/10 bg-[#0e1423]/60 backdrop-blur-md text-white hover:text-[#ff6b6b] hover:border-[#ff6b6b]/30 flex items-center justify-center transition-all cursor-pointer pointer-events-auto"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Carousel controls - mobile arrows & dots */}
        <div className="flex md:hidden justify-between items-center mt-6 px-4">
          <button 
            onClick={prevSlide}
            aria-label="Previous review"
            className="w-10 h-10 rounded-full border border-white/5 bg-white/5 text-white flex items-center justify-center transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex gap-2">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setAnimate(false);
                  setTimeout(() => {
                    setActiveIndex(idx);
                    setAnimate(true);
                  }, 150);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'bg-[#ff6b6b] w-6' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide}
            aria-label="Next review"
            className="w-10 h-10 rounded-full border border-white/5 bg-white/5 text-white flex items-center justify-center transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dots underneath for desktop */}
        <div className="hidden md:flex justify-center gap-2 mt-8">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setAnimate(false);
                setTimeout(() => {
                  setActiveIndex(idx);
                  setAnimate(true);
                }, 150);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx ? 'bg-[#ff6b6b] w-6' : 'bg-white/10 hover:bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
