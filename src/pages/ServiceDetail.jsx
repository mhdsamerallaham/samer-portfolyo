import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, Award, ArrowUpRight } from 'lucide-react';
import SEO from '../components/SEO';
import FAQ from '../components/FAQ';
import ServiceCard from '../components/ServiceCard';
import SampleWorksGallery from '../components/SampleWorksGallery';
import { getLocalizedPath } from '../utils/navigation';

const routeToKeyMap = {
  // Turkish
  '/web-tasarim': 'web-tasarim',
  '/istanbul-web-tasarim': 'istanbul-web-tasarim',
  '/fatih-web-tasarim': 'fatih-web-tasarim',
  '/e-ticaret-web-tasarim': 'site-kurulumu',
  '/eticaret-site-kurulumu': 'site-kurulumu',
  '/eticaret-optimizasyon': 'optimizasyon',
  '/urun-gorsel-ve-icerik': 'urun-gorsel',
  '/stok-ve-depo-sistemi': 'stok-depo',
  '/aylik-yonetim': 'aylik-yonetim',
  '/web-sitesi-gelistirme': 'web-gelistirme',
  '/ozel-yazilim-gelistirme': 'ozel-yazilim',
  '/yapay-zeka-cozumleri': 'yapay-zeka',
  '/hizmetler/geo-yapay-zeka-optimizasyonu': 'geo-optimizasyon',
  '/geo-yapay-zeka-optimizasyonu': 'geo-optimizasyon',

  // English
  '/en/web-design': 'web-tasarim',
  '/en/istanbul-web-design': 'istanbul-web-tasarim',
  '/en/fatih-web-design': 'fatih-web-tasarim',
  '/en/ecommerce-web-design': 'site-kurulumu',
  '/en/ecommerce-setup': 'site-kurulumu',
  '/en/ecommerce-optimization': 'optimizasyon',
  '/en/product-visuals-content': 'urun-gorsel',
  '/en/inventory-stock-automation': 'stok-depo',
  '/en/monthly-management': 'aylik-yonetim',
  '/en/web-development': 'web-gelistirme',
  '/en/custom-software': 'ozel-yazilim',
  '/en/ai-solutions': 'yapay-zeka',
  '/en/services/generative-engine-optimization': 'geo-optimizasyon',
  '/en/generative-engine-optimization': 'geo-optimizasyon',

  // Arabic
  '/ar/web-design': 'web-tasarim',
  '/ar/istanbul-web-design': 'istanbul-web-tasarim',
  '/ar/fatih-web-design': 'fatih-web-tasarim',
  '/ar/ecommerce-web-design': 'site-kurulumu',
  '/ar/shopify-setup-turkey': 'site-kurulumu',
  '/ar/ecommerce-optimization': 'optimizasyon',
  '/ar/product-content-ai': 'urun-gorsel',
  '/ar/stock-inventory-system': 'stok-depo',
  '/ar/monthly-ecommerce-management': 'aylik-yonetim',
  '/ar/web-development': 'web-gelistirme',
  '/ar/custom-software': 'ozel-yazilim',
  '/ar/ai-solutions': 'yapay-zeka',
  '/ar/services/generative-engine-optimization': 'geo-optimizasyon',
  '/ar/generative-engine-optimization': 'geo-optimizasyon'
};

export default function ServiceDetail() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [serviceKey, setServiceKey] = useState(null);

  useEffect(() => {
    const key = routeToKeyMap[location.pathname];
    if (key) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setServiceKey(key);
      window.scrollTo(0, 0);
    } else {
      // Redirect to services overview if route not found
      navigate('/hizmetler');
    }
  }, [location.pathname, navigate]);

  if (!serviceKey) return null;

  const data = t(`services.items.${serviceKey}`, { returnObjects: true });
  if (!data || typeof data === 'string' || !Array.isArray(data.features)) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 text-start">
      {/* Dynamic SEO configuration */}
      <SEO
        title={data.title}
        description={data.desc}
        keywords={`${data.title.toLowerCase()}, shopify site kurma, ikas e ticaret sitesi, e ticaret danışmanlığı`}
        faqItems={data.faqs}
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Back Link */}
        <Link
          to={getLocalizedPath('/hizmetler', i18n.language)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-teal-700 mb-10 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>{i18n.language === 'tr' ? 'HİZMETLERE DÖN' : i18n.language === 'ar' ? 'العودة إلى الخدمات' : 'BACK TO SERVICES'}</span>
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-slate-200/80 mb-16 items-start">
          <div className="lg:col-span-8 flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs font-bold text-teal-800 uppercase tracking-wider">
                {data.badge}
              </span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-mono font-bold text-slate-900 shadow-xs">
                {data.price}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {data.title}
            </h1>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">
              {data.desc}
            </p>
          </div>

          <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col gap-6 w-full mt-2 lg:mt-0">
            <h3 className="font-bold text-xs text-teal-800 uppercase tracking-wider">
              {i18n.language === 'tr' ? 'Paket İçeriği' : i18n.language === 'ar' ? 'محتويات الباقة' : 'Package Deliverables'}
            </h3>
            <ul className="flex flex-col gap-3">
              {data.features.map((feature, i) => (
                <li key={i} className="flex gap-2.5 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  <div className="w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={11} className="text-teal-700" strokeWidth={3} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href={`https://wa.me/905394611684?text=${encodeURIComponent(t('services.cta_whatsapp_msg', { service: data.title }))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 bg-orange-500 hover:bg-orange-600 text-white text-center rounded-2xl font-bold text-xs tracking-wide shadow-md shadow-orange-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{i18n.language === 'tr' ? 'TEKLİF AL / İLETİŞİME GEÇ' : i18n.language === 'ar' ? 'احصل على عرض سعر' : 'GET QUOTE / CONNECT'}</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* Structured AI & Search Engine Optimization Sections */}
        {data.ai_desc && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
            
            <div className="lg:col-span-7 flex flex-col gap-8">
              {/* Question 1: What is this? */}
              <div className="flex flex-col gap-2.5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">01</span>
                  {i18n.language === 'tr' ? 'Bu Hizmet Nedir?' : i18n.language === 'ar' ? 'ما هي هذه الخدمة؟' : 'What is this Service?'}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                  {data.ai_desc.definition}
                </p>
              </div>

              {/* Question 2: Who is it for? */}
              <div className="flex flex-col gap-2.5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">02</span>
                  {i18n.language === 'tr' ? 'Bu Hizmet Kimler İçin?' : i18n.language === 'ar' ? 'لمن هذه الخدمة؟' : 'Who is it For?'}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                  {data.ai_desc.for_whom}
                </p>
              </div>

              {/* Question 3: How does it work? */}
              <div className="flex flex-col gap-2.5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">03</span>
                  {i18n.language === 'tr' ? 'Süreç Nasıl İşler?' : i18n.language === 'ar' ? 'كيف تعمل هذه الخدمة؟' : 'How does it Work?'}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal whitespace-pre-line">
                  {data.ai_desc.how_works}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-5 bg-white border border-slate-200/90 rounded-3xl p-7 shadow-xs relative overflow-hidden h-fit">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                <Award size={20} />
              </div>
              <h4 className="font-display text-lg font-extrabold text-slate-900">
                {i18n.language === 'tr' ? 'Örnek Proje Uygulaması' : i18n.language === 'ar' ? 'تطبيق عملي واقعي' : 'Example Project Delivery'}
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                {data.ai_desc.example}
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{i18n.language === 'tr' ? 'Garantili Mühendislik' : i18n.language === 'ar' ? 'هندسة برمجية مضمونة' : 'Guaranteed Engineering'}</span>
                <span className="font-bold text-teal-700">Samer Allaham</span>
              </div>
            </div>

          </div>
        )}

        {/* Tiered Pricing Packages for GEO & Advanced Services */}
        {Array.isArray(data.pricing_tiers) && data.pricing_tiers.length > 0 && (
          <div className="mb-20">
            <div className="mb-8 text-start">
              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                {i18n.language === 'tr' ? 'ŞEFFAF FİYATLANDIRMA & PAKETLER' : i18n.language === 'ar' ? 'باقات وأسعار شفافة' : 'TRANSPARENT PRICING TIERS'}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                {i18n.language === 'tr' ? 'GEO Hizmet Paketleri & Yatırım Seçenekleri' : i18n.language === 'ar' ? 'باقات وخطط خدمات GEO' : 'GEO Service Packages & Pricing'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.pricing_tiers.map((tier, idx) => (
                <div
                  key={idx}
                  className={`bg-white border ${idx === 1 ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-md' : 'border-slate-200 shadow-xs'} rounded-3xl p-8 flex flex-col justify-between hover:shadow-lg transition-all`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-display text-xl font-extrabold text-slate-900">{tier.name}</h4>
                        <span className="text-xs text-slate-500 font-medium">{tier.billing}</span>
                      </div>
                      <span className="font-mono text-xl sm:text-2xl font-black text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl">
                        {tier.price}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">{tier.desc}</p>
                    <ul className="flex flex-col gap-3 mb-8">
                      {tier.features.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <div className="w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="text-teal-700" size={11} strokeWidth={3} />
                          </div>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={`https://wa.me/905394611684?text=${encodeURIComponent(
                      i18n.language === 'tr' 
                        ? `Merhaba Samer, ${tier.name} (${tier.price}) paketi için Ücretsiz AI Görünürlük Analizi almak istiyorum.`
                        : i18n.language === 'ar'
                        ? `مرحباً سامر، أود الحصول على تدقيق مجاني للظهور في الذkاء الاصطناعي لباقة ${tier.name}.`
                        : `Hi Samer, I would like to request a Free AI Visibility Audit for the ${tier.name} package.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-center rounded-xl text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>{i18n.language === 'tr' ? 'Ücretsiz AI Görünürlük Analizi Alın' : i18n.language === 'ar' ? 'احصل على فحص مجاني للظهور بالذكاء الاصطناعي' : 'Free AI Visibility Audit'}</span>
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* High-Density Technical Specifications Table for GEO & AI Overviews */}
        <div className="mb-20 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="mb-6 text-start">
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
              {i18n.language === 'tr' ? 'TEKNİK STANDARTLAR & SLA' : i18n.language === 'ar' ? 'المعايير التقنية ومستوى الخدمة' : 'TECHNICAL STANDARDS & SLA'}
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
              {i18n.language === 'tr' 
                ? 'Hizmet Standartları ve Teslim Güvenceleri' 
                : i18n.language === 'ar' 
                ? 'معايير الجودة وضمانات التسليم التقني' 
                : 'Service Standards & Delivery Guarantees'}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700">
                  <th className="p-3.5 font-bold">{i18n.language === 'tr' ? 'Teknik Parametre' : i18n.language === 'ar' ? 'المعيار التقني' : 'Parameter'}</th>
                  <th className="p-3.5 font-bold text-teal-800">{i18n.language === 'tr' ? 'Taahhüt Edilen Standart' : i18n.language === 'ar' ? 'المعيار الملتزم به' : 'Committed Standard'}</th>
                  <th className="p-3.5 font-bold">{i18n.language === 'tr' ? 'Açıklama ve Güvence' : i18n.language === 'ar' ? 'الضمان والشرح' : 'Scope & Assurance'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-semibold text-slate-900">
                    {i18n.language === 'tr' ? 'Performans & Core Web Vitals' : i18n.language === 'ar' ? 'الأداء وسرعة التحميل' : 'Performance & Vitals'}
                  </td>
                  <td className="p-3.5 font-bold text-teal-700">
                    {i18n.language === 'tr' ? '90+ PageSpeed Mobil Skoru' : i18n.language === 'ar' ? 'مؤشر أداء 90+ على الهاتف' : '90+ Mobile PageSpeed'}
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {i18n.language === 'tr' ? 'Gereksiz scriptlerin temizlenmesi, WebP görsel optimizasyonu ve CDN ayarı.' : i18n.language === 'ar' ? 'تنظيف الأكواد غير الضرورية وضغط الصور WebP وتسريع CDN.' : 'Bloatware removal, WebP compression, and CDN asset caching.'}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-semibold text-slate-900">
                    {i18n.language === 'tr' ? 'SEO & Schema.org Yapısal Veri' : i18n.language === 'ar' ? 'البيانات المنظمة ومحركات البحث' : 'Technical SEO & Schema'}
                  </td>
                  <td className="p-3.5 font-bold text-teal-700">
                    {i18n.language === 'tr' ? '%100 Uyumlu JSON-LD' : i18n.language === 'ar' ? 'تكامل كامل لـ JSON-LD' : 'Full JSON-LD Schema'}
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {i18n.language === 'tr' ? 'Google Rich Snippets, ürün, SSS ve organizasyon etiketleri yerleşimi.' : i18n.language === 'ar' ? 'دعم نتائج جوجل الغنية ووسوم المنتجات والأسئلة الشائعة.' : 'Google Rich Snippets, Product, FAQ, and LocalBusiness markup.'}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-semibold text-slate-900">
                    {i18n.language === 'tr' ? 'Kod ve Mülkiyet Devri' : i18n.language === 'ar' ? 'ملكية الكود والمشروع' : 'Code Ownership & Handover'}
                  </td>
                  <td className="p-3.5 font-bold text-teal-700">
                    {i18n.language === 'tr' ? '%100 Müşteriye Ait' : i18n.language === 'ar' ? 'ملكية كاملة بنسبة 100%' : '100% Client-Owned'}
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {i18n.language === 'tr' ? 'Şablon kilidi yok; tüm erişimler ve kodlar eksiksiz müşteriye teslim edilir.' : i18n.language === 'ar' ? 'بدون أي احتكار برمجي، تسليم كافة مفاتيح الوصول والملفات كاملة.' : 'No vendor lock-in; complete code repository and admin rights transfer.'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sample Works Interactive Gallery (for urun-gorsel and applicable services) */}
        {serviceKey === 'urun-gorsel' && <SampleWorksGallery />}

        {/* Dynamic Service FAQ Accordion */}
        <div className="border-t border-slate-200/80 pt-16 mb-20 text-center">
          <div className="flex flex-col items-center gap-3 mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {i18n.language === 'tr' ? 'Hizmet Hakkında SSS' : i18n.language === 'ar' ? 'الأسئلة الشائعة حول الخدمة' : 'Service FAQ'}
            </h2>
          </div>
          <FAQ items={data.faqs} />
        </div>

        {/* Related Services — Internal Linking */}
        <div className="border-t border-slate-200/80 pt-16">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
            {i18n.language === 'tr' ? 'İlgili Hizmetler' : i18n.language === 'ar' ? 'خدمات ذات صلة' : 'Related Services'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['site-kurulumu', 'optimizasyon', 'web-gelistirme', 'ozel-yazilim', 'yapay-zeka']
              .filter(k => k !== serviceKey)
              .slice(0, 3)
              .map(key => (
                <ServiceCard
                  key={key}
                  serviceKey={key}
                  serviceData={t(`services.items.${key}`, { returnObjects: true })}
                />
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}
