import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck, MapPin } from 'lucide-react';

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

  // Autoplay slider every 7 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <section className="px-6 md:px-12 py-20 lg:py-28 max-w-[1200px] mx-auto border-t border-slate-200/80 relative">
      
      {/* Section Title */}
      <div className="text-center mb-14 flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-800 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide">
          <ShieldCheck size={14} className="text-teal-600" />
          <span>
            {i18n.language === 'tr' ? 'DOĞRULANMIŞ MÜŞTERİ GERİ BİLDİRİMLERİ' : i18n.language === 'ar' ? 'مراجعات عملاء موثقة' : 'VERIFIED CLIENT REVIEWS'}
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          {i18n.language === 'tr' ? 'Birlikte Büyüttüğümüz Markalar' : i18n.language === 'ar' ? 'علامات تجارية طورناها معاً' : 'Brands We Grew Together'}
        </h2>
        <p className="text-slate-600 text-sm md:text-base max-w-xl font-normal leading-relaxed">
          {i18n.language === 'tr' 
            ? 'Birlikte çalıştığımız e-ticaret markalarının ve girişimcilerin gerçek deneyimleri ve somut sonuçları.' 
            : i18n.language === 'ar' 
            ? 'تجارب ونتائج حقيقية من أصحاب المتاجر والعلامات التجارية الذين تعاونا معهم.' 
            : 'Verified feedback and measurable metrics from e-commerce entrepreneurs we partner with.'}
        </p>
      </div>

      {/* Main Review Card & Carousel Controls */}
      <div className="max-w-[850px] mx-auto relative">
        
        {/* Carousel Inner Container */}
        <div className="relative bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 md:p-14 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col justify-between min-h-[300px]">
          
          {/* Big Quote background decoration */}
          <div className="absolute right-6 top-6 opacity-5 text-teal-600 pointer-events-none">
            <Quote size={120} />
          </div>

          <div className={`transition-all duration-300 transform ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'}`}>
            {/* Stars */}
            <div className="flex gap-1 mb-5 justify-start">
              {Array.from({ length: reviews[activeIndex].rating || 5 }).map((_, i) => (
                <Star key={i} className="text-amber-400 fill-amber-400" size={18} />
              ))}
            </div>

            {/* Review Text */}
            <p className="text-base sm:text-lg md:text-xl font-medium leading-relaxed text-slate-800 text-start mb-8 italic">
              "{reviews[activeIndex].text}"
            </p>
          </div>

          {/* Review Author detail */}
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-t border-slate-100 pt-6 mt-2 transition-all duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-col text-start">
              <span className="font-display font-extrabold text-base text-slate-900">{reviews[activeIndex].name}</span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium">{reviews[activeIndex].role}</span>
            </div>

            {/* Google Rating Badge */}
            <a 
              href="https://share.google/IrAWdrTQOMekMNmwh" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-xl px-3 py-1.5 transition-colors group"
            >
              <MapPin size={13} className="text-teal-600" />
              <span className="text-[11px] font-bold text-slate-700 group-hover:text-teal-800 uppercase tracking-wide">
                {i18n.language === 'tr' ? 'GOOGLE HARİTALAR' : i18n.language === 'ar' ? 'خرائط جوجل' : 'GOOGLE REVIEWS'}
              </span>
              <span className="text-xs font-bold text-amber-500">5.0 ★</span>
            </a>
          </div>
        </div>

        {/* Carousel controls - desktop arrows */}
        <div className="hidden md:flex justify-between absolute top-1/2 transform -translate-y-1/2 -left-6 -right-6 w-[calc(100%+48px)] pointer-events-none">
          <button 
            onClick={prevSlide}
            aria-label="Previous review"
            className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-700 hover:text-white hover:bg-teal-600 hover:border-teal-600 shadow-md flex items-center justify-center transition-all cursor-pointer pointer-events-auto"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            aria-label="Next review"
            className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-700 hover:text-white hover:bg-teal-600 hover:border-teal-600 shadow-md flex items-center justify-center transition-all cursor-pointer pointer-events-auto"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Carousel dots */}
        <div className="flex justify-center gap-2 mt-6">
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
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx ? 'bg-teal-600 w-7' : 'bg-slate-300 hover:bg-slate-400 w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

