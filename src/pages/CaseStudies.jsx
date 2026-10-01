import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingUp, Cpu, Flame } from 'lucide-react';
import SEO from '../components/SEO';
import { getLocalizedPath } from '../utils/navigation';

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
    workExample: [
      {
        '@type': 'CreativeWork',
        name: 'AIO Coffee — Shopify E-Ticaret Sitesi',
        url: 'https://www.aiocoffee.com/tr',
        description: 'Shopify altyapısında geliştirilen AIO Coffee e-ticaret sitesi. Dönüşüm oranı %35 artış sağlandı.',
        creator: { '@type': 'Person', '@id': 'https://www.samer.life/#person', name: 'Samer Allaham', url: 'https://www.samer.life' }
      },
      {
        '@type': 'CreativeWork',
        name: 'Nourla — E-Ticaret & Marka Websitesi',
        url: 'https://www.nourla.com.tr/tr',
        description: 'Nourla markası için React ile geliştirilen e-ticaret ve kurumsal kimlik websitesi.',
        creator: { '@type': 'Person', '@id': 'https://www.samer.life/#person', name: 'Samer Allaham', url: 'https://www.samer.life' }
      },
      {
        '@type': 'CreativeWork',
        name: 'Taam Club — Restaurant & Food Platform',
        url: 'https://taam-club.vercel.app/',
        description: 'Taam Club için React ile geliştirilen restoran ve gıda platformu web uygulaması.',
        creator: { '@type': 'Person', '@id': 'https://www.samer.life/#person', name: 'Samer Allaham', url: 'https://www.samer.life' }
      }
    ],
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 text-start">
      <SEO
        title={i18n.language === 'ar' ? 'قصص نجاح التجارة الإلكترونية | سامر اللحام' : i18n.language === 'en' ? 'E-Commerce Case Studies & Results | Samer Allaham' : 'E-Ticaret Başarı Hikayeleri & Sonuçlar | Samer Allaham'}
        description={i18n.language === 'ar' ? 'قصص نجاح حقيقية لعملاء شوبيفاي وإيكاس: زيادة مبيعات AIO Coffee بنسبة 35% وسرعة 1.1 ثانية. نتائج موثقة لتطوير المتاجر مع سامر اللحام.' : i18n.language === 'en' ? 'Verified case studies: AIO Coffee 35% conversion lift, 1.1s load speed, and multi-channel inventory sync. Real e-commerce engineering results.' : 'AIO Coffee %35 dönüşüm artışı, 1.1s sayfa yükleme hızı ve otomatik stok senkronizasyonu. Gerçek müşteri başarı hikayeleri ve e-ticaret vaka analizleri.'}
        keywords="e-ticaret başarı hikayesi, shopify case study, dönüşüm oranı artırma örnek, e-ticaret referans, ikas başarı hikayesi"
        schema={reviewSchema}
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <TrendingUp size={13} className="text-teal-600" />
            <span>{i18n.language === 'tr' ? 'SOMUT REFERANSLAR' : i18n.language === 'ar' ? 'أعمال موثقة' : 'VERIFIED RESULTS'}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            {t('case_studies.title')}
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
            {t('case_studies.subtitle')}
          </p>
        </div>

        {/* High-Density GEO / AI Overview Case Studies Summary Table */}
        <div className="mb-16 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="mb-6 text-start">
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
              {i18n.language === 'tr' ? 'ÖZET VAKA ANALİZİ MATRİSİ' : i18n.language === 'ar' ? 'مصفوفة نتائج دراسات الحالة' : 'CASE STUDIES BENCHMARK MATRIX'}
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
              {i18n.language === 'tr' 
                ? 'Canlı Müşteri Projeleri ve Ölçülebilir Başarı Metrikleri' 
                : i18n.language === 'ar' 
                ? 'مشاريع العملاء الحية ومقاييس الأداء القابلة للقياس' 
                : 'Live Client Deliveries & Measurable Impact Metrics'}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700">
                  <th className="p-3.5 font-bold">{i18n.language === 'tr' ? 'Marka / Müşteri' : i18n.language === 'ar' ? 'المشروع' : 'Client Project'}</th>
                  <th className="p-3.5 font-bold">{i18n.language === 'tr' ? 'Altyapı & Kapsam' : i18n.language === 'ar' ? 'التقنية' : 'Platform & Scope'}</th>
                  <th className="p-3.5 font-bold">{i18n.language === 'tr' ? 'Çözülen Problem' : i18n.language === 'ar' ? 'التحدي' : 'Core Challenge'}</th>
                  <th className="p-3.5 font-bold text-teal-800">{i18n.language === 'tr' ? 'Ölçülen Sonuç' : i18n.language === 'ar' ? 'النتيجة الموثقة' : 'Verified Metric'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    <a href="https://www.aiocoffee.com/tr" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">
                      AIO Coffee ↗
                    </a>
                  </td>
                  <td className="p-3.5 text-slate-600">Shopify Liquid, CRO</td>
                  <td className="p-3.5 text-slate-600">
                    {i18n.language === 'tr' ? 'Yüksek sepet terk oranı ve mobil ödeme yavaşlığı' : i18n.language === 'ar' ? 'ارتفاع نسبة التخلي عن السلة وبطء الدفع' : 'High checkout abandonment & slow mobile checkout'}
                  </td>
                  <td className="p-3.5 font-bold text-teal-700">
                    {i18n.language === 'tr' ? '%35 Dönüşüm Oranı Artışı' : i18n.language === 'ar' ? '+35% زيادة في معدل التحويل' : '+35% Conversion Rate Lift'}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    <a href="https://www.nourla.com.tr/tr" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">
                      Nourla ↗
                    </a>
                  </td>
                  <td className="p-3.5 text-slate-600">React, Headless E-Commerce</td>
                  <td className="p-3.5 text-slate-600">
                    {i18n.language === 'tr' ? 'Düşük mobil hız ve yetersiz SEO mimarisi' : i18n.language === 'ar' ? 'ضعف سرعة الموبايل ومشاكل هيكلية في SEO' : 'Slow mobile speed & suboptimal SEO structure'}
                  </td>
                  <td className="p-3.5 font-bold text-teal-700">
                    {i18n.language === 'tr' ? '1.1s Açılış, 98/100 Skor' : i18n.language === 'ar' ? '1.1 ثانية تحميل، مؤشر 98' : '1.1s Load Time, 98/100 Score'}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    <a href="https://taam-club.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">
                      Taam Club ↗
                    </a>
                  </td>
                  <td className="p-3.5 text-slate-600">React, Next.js Web App</td>
                  <td className="p-3.5 text-slate-600">
                    {i18n.language === 'tr' ? 'Çok şubeli sipariş akışı ve menü senkronizasyonu' : i18n.language === 'ar' ? 'إدارة الطلبات متعددة الفروع ومزامنة القوائم' : 'Multi-branch order orchestration & menu sync'}
                  </td>
                  <td className="p-3.5 font-bold text-teal-700">
                    {i18n.language === 'tr' ? '%0 Hata, Tam Otomasyon' : i18n.language === 'ar' ? '0% أخطاء وأتمتة كاملة' : '0% Manual Errors, 100% Sync'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Rich Case Studies Grid */}
        <div className="flex flex-col gap-10">
          {Array.isArray(caseStudies) && caseStudies.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-3xl p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start shadow-xs hover:border-teal-300 hover:shadow-md transition-all duration-300"
            >
              {/* Metric Callout */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  {icons[idx] || <TrendingUp size={24} />}
                </div>
                <span className="font-display text-3xl sm:text-4xl font-extrabold text-teal-600 tracking-tight leading-none">
                  {item.metric}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  CASE_00{idx + 1}
                </span>
              </div>

              {/* Story Description */}
              <div className="lg:col-span-8 flex flex-col justify-between h-full text-start">
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-slate-900 mb-2">
                    {item.client}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-normal mb-6">
                    {item.desc}
                  </p>
                  
                  {/* Detailed Case Study breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-xs sm:text-sm">
                    <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
                      <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                        {i18n.language === 'tr' ? 'SORUN' : i18n.language === 'ar' ? 'المشكلة' : 'PROBLEM'}
                      </span>
                      <p className="text-slate-800 font-medium leading-relaxed">{item.problem}</p>
                    </div>
                    <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
                      <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                        {i18n.language === 'tr' ? 'ÇÖZÜM' : i18n.language === 'ar' ? 'الحل' : 'SOLUTION'}
                      </span>
                      <p className="text-slate-800 font-medium leading-relaxed">{item.solution}</p>
                    </div>
                    <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                      <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">
                        {i18n.language === 'tr' ? 'SÜREÇ' : i18n.language === 'ar' ? 'العملية' : 'PROCESS'}
                      </span>
                      <p className="text-slate-800 font-medium leading-relaxed">{item.process}</p>
                    </div>
                    <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                        {i18n.language === 'tr' ? 'ÖLÇÜLEBİLİR SONUÇ' : i18n.language === 'ar' ? 'النتائج' : 'MEASURABLE RESULT'}
                      </span>
                      <p className="text-slate-800 font-medium leading-relaxed">{item.results}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    {item.linkUrl && (
                      <a 
                        href={item.linkUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1"
                      >
                        <span>{item.linkText || item.client}</span>
                        <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                  <Link
                    to={getLocalizedPath('/iletisim', i18n.language)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-2xl shadow-md shadow-orange-500/20 hover:shadow-lg transition-all"
                  >
                    <span>{i18n.language === 'tr' ? 'Benzer Proje Başlat' : i18n.language === 'ar' ? 'ابدأ مشروعاً مشابهاً' : 'Start Similar Project'}</span>
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
