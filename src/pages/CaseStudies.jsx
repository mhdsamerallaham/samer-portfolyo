import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingUp, Cpu, Flame } from 'lucide-react';
import SEO from '../components/SEO';

export default function CaseStudies() {
  const { t, i18n } = useTranslation();
  const caseStudies = t('case_studies.items', { returnObjects: true }) || [];

  const icons = [<TrendingUp size={24} />, <Flame size={24} />, <Cpu size={24} />];

  // E-E-A-T: AggregateRating + Review schema for trust signals
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://www.samer.life/#organization',
    name: 'Samer Allaham | E-Ticaret & Web Tasarım Uzmanı',
    url: 'https://www.samer.life/',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '27',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Ahmet Y.' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody:
          'Samer ile checkout ve hız optimizasyonu üzerinde çalıştık. Dönüşüm oranımız %35 arttı. İş disiplini ve teknik bilgisi harika.',
        name: 'AIO Coffee — Shopify Optimizasyon',
        datePublished: '2025-10-01',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Elif K.' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody:
          'Wordpress sitemizi İKAS altyapısına sorunsuz taşıdı. Sayfa hızımız 1.1 saniyeye düştü. Destek ve yönlendirmeleri için çok teşekkürler.',
        name: 'Moda Butıği — İKAS Göçü & Hız Optimizasyonu',
        datePublished: '2025-09-15',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Omar B.' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody:
          'Shopify ve Trendyol arasındaki stok senkronizasyon yazılımını geliştirdi. Manuel hatalardan kaynaklanan cezalarımız tamamen bitti.',
        name: 'Global E-Ticaret — Çok Kanal Stok Otomasyonu',
        datePublished: '2025-08-20',
      },
    ],
  };

  return (
    <div className="pt-32 pb-24 text-white min-h-screen text-start">
      <SEO
        title={i18n.language === 'ar' ? 'قصص نجاح التجارة الإلكترونية | سامر اللحام' : i18n.language === 'en' ? 'E-Commerce Success Stories & Proven Results | Samer Allaham' : 'E-Ticaret Başarı Hikayeleri & Gerçek Sonuçlar | Samer Allaham'}
        description={i18n.language === 'ar' ? 'قصص نجاح حقيقية: زيادة معدل التحويل بنسبة 35% لـ AIO Coffee. أمثلة على نتائج تحسين التجارة الإلكترونية.' : i18n.language === 'en' ? 'Real client success: AIO Coffee 35% conversion rate increase, fashion boutique page speed from 45 to 98. Verified e-commerce case studies.' : 'Gerçek müşteri başarı hikayeleri: AIO Coffee %35 CR artışı, moda butığı hız skoru 45\'ten 98\'e. Shopify ve İKAS e-ticaret sonuçları.'}
        keywords="e-ticaret başarı hikayesi, shopify case study, dönüşüm oranı artırma örnek, e-ticaret referans, ikas başarı hikayesi"
        schema={reviewSchema}
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
            {t('case_studies.title')}
          </h1>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed font-semibold">
            {t('case_studies.subtitle')}
          </p>
        </div>

        {/* Rich Case Studies Grid */}
        <div className="flex flex-col gap-12">
          {Array.isArray(caseStudies) && caseStudies.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#131b2e] border border-white/5 rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:border-white/10 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff6b6b]/5 rounded-full blur-[60px] pointer-events-none" />
              
              {/* Metric Callout */}
              <div className="lg:col-span-4 flex flex-col justify-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ff6b6b]/10 flex items-center justify-center text-[#ff6b6b] mb-2">
                  {icons[idx] || <TrendingUp size={24} />}
                </div>
                <span className="text-3xl md:text-4xl font-black text-[#ff6b6b] tracking-tight leading-none">
                  {item.metric}
                </span>
              </div>

              {/* Story Description */}
              <div className="lg:col-span-8 flex flex-col justify-between h-full text-start">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">
                    {item.client}
                  </h3>
                  <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-semibold mb-6">
                    {item.desc}
                  </p>
                  
                  {/* Detailed Case Study breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-xs md:text-sm">
                    <div className="flex flex-col gap-1 pl-4 border-l-2 border-[#ff6b6b]/40">
                      <span className="mono text-[8px] font-black text-[#ff6b6b] uppercase tracking-wider">
                        {i18n.language === 'tr' ? 'SORUN' : i18n.language === 'ar' ? 'المشكلة' : 'PROBLEM'}
                      </span>
                      <p className="text-neutral-300 font-medium leading-relaxed">{item.problem}</p>
                    </div>
                    <div className="flex flex-col gap-1 pl-4 border-l-2 border-green-500/40">
                      <span className="mono text-[8px] font-black text-green-400 uppercase tracking-wider">
                        {i18n.language === 'tr' ? 'ÇÖZÜM' : i18n.language === 'ar' ? 'الحل' : 'SOLUTION'}
                      </span>
                      <p className="text-neutral-300 font-medium leading-relaxed">{item.solution}</p>
                    </div>
                    <div className="flex flex-col gap-1 pl-4 border-l-2 border-blue-500/40">
                      <span className="mono text-[8px] font-black text-blue-400 uppercase tracking-wider">
                        {i18n.language === 'tr' ? 'SÜREÇ' : i18n.language === 'ar' ? 'العملية' : 'PROCESS'}
                      </span>
                      <p className="text-neutral-300 font-medium leading-relaxed">{item.process}</p>
                    </div>
                    <div className="flex flex-col gap-1 pl-4 border-l-2 border-yellow-500/40">
                      <span className="mono text-[8px] font-black text-yellow-400 uppercase tracking-wider">
                        {i18n.language === 'tr' ? 'ÖLÇÜLEBİLİR SONUÇ' : i18n.language === 'ar' ? 'النتائج' : 'MEASURABLE RESULT'}
                      </span>
                      <p className="text-neutral-300 font-medium leading-relaxed">{item.results}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="mono text-[8px] font-black text-neutral-400 uppercase tracking-widest">
                      CASE_00{idx + 1}
                    </span>
                    {item.linkUrl && (
                      <>
                        <span className="text-neutral-700">•</span>
                        <a 
                          href={item.linkUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-[#ff6b6b] hover:underline"
                        >
                          {item.linkText || item.client}
                        </a>
                      </>
                    )}
                  </div>
                  <Link
                    to="/iletisim"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-[#ff6b6b] hover:text-white text-white text-xs font-bold rounded-xl transition-all"
                  >
                    {i18n.language === 'tr' ? 'Benzer Proje Başlat' : i18n.language === 'ar' ? 'ابدأ مشروعاً مشابهاً' : 'Start Similar Project'}
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
