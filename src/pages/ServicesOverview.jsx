import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Layers, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import ServiceCard from '../components/ServiceCard';
import { getLocalizedPath } from '../utils/navigation';

export default function ServicesOverview() {
  const { t, i18n } = useTranslation();
  const servicesKeys = ['site-kurulumu', 'optimizasyon', 'geo-optimizasyon', 'urun-gorsel', 'stok-depo', 'aylik-yonetim', 'web-gelistirme', 'ozel-yazilim', 'yapay-zeka'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 text-start">
      {/* SEO metadata for services page */}
      <SEO
        title={t('nav.services')}
        description={t('services.subtitle')}
        keywords="shopify site kurma, ikas e ticaret sitesi, e ticaret danışmanlığı, ürün fotoğraf düzenleme, web tasarım hizmetleri"
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-start">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Layers size={13} className="text-teal-600" />
            <span>{i18n.language === 'tr' ? 'TÜM HİZMETLER' : i18n.language === 'ar' ? 'كافة الخدمات' : 'ALL SERVICES'}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            {t('services.title')}
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {servicesKeys.map((key) => (
            <ServiceCard
              key={key}
              serviceKey={key}
              serviceData={t(`services.items.${key}`, { returnObjects: true })}
              recommended={key === 'site-kurulumu'}
            />
          ))}
        </div>

        {/* High-Density GEO / AI Overview Service Deliverables Matrix */}
        <div className="mb-20 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="mb-6 text-start">
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
              {i18n.language === 'tr' ? 'HİZMET VE TESLİMAT MATRİSİ' : i18n.language === 'ar' ? 'مصفوفة الخدمات ومخرجات العمل' : 'SERVICES & DELIVERABLES MATRIX'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              {i18n.language === 'tr' 
                ? 'Hizmet Kapsamı, Süre ve Hedef Kitle Tablosu' 
                : i18n.language === 'ar' 
                ? 'جدول نطاق الخدمات والمدد الزمنية والمخرجات' 
                : 'Service Scope, Timelines & Deliverables Overview'}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700">
                  <th className="p-3.5 font-bold">{i18n.language === 'tr' ? 'Hizmet Alanı' : i18n.language === 'ar' ? 'الخدمة' : 'Service'}</th>
                  <th className="p-3.5 font-bold">{i18n.language === 'tr' ? 'Altyapı & Teknoloji' : i18n.language === 'ar' ? 'التقنية' : 'Tech Stack'}</th>
                  <th className="p-3.5 font-bold">{i18n.language === 'tr' ? 'Teslim Süresi' : i18n.language === 'ar' ? 'المدة' : 'Timeline'}</th>
                  <th className="p-3.5 font-bold">{i18n.language === 'tr' ? 'Temel Çıktılar' : i18n.language === 'ar' ? 'المخرجات' : 'Key Deliverables'}</th>
                  <th className="p-3.5 font-bold">{i18n.language === 'tr' ? 'Kimler İçin Uygun' : i18n.language === 'ar' ? 'الفئة المستهدفة' : 'Ideal For'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {i18n.language === 'tr' ? 'E-Ticaret Site Kurulumu' : i18n.language === 'ar' ? 'إنشاء متجر إلكتروني' : 'E-Commerce Store Setup'}
                  </td>
                  <td className="p-3.5 text-teal-700 font-semibold">Shopify / İKAS</td>
                  <td className="p-3.5 font-semibold text-slate-800">3 - 7 {i18n.language === 'tr' ? 'Gün' : i18n.language === 'ar' ? 'أيام' : 'Days'}</td>
                  <td className="p-3.5 text-slate-600">
                    {i18n.language === 'tr' ? 'Özel tema, ödeme altyapısı, kargo ve SEO ayarları' : i18n.language === 'ar' ? 'قالب مخصص، بوابات دفع، ربط الشحن وتهيئة SEO' : 'Custom theme, payment gateways, shipping & SEO setup'}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {i18n.language === 'tr' ? 'Yeni başlayanlar ve platform taşıyan markalar' : i18n.language === 'ar' ? 'المتاجر الجديدة والناقلة لمنصة أفضل' : 'New ventures & migrating stores'}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {i18n.language === 'tr' ? 'Dönüşüm & Hız (CRO)' : i18n.language === 'ar' ? 'تحسين التحويل والسرعة' : 'Conversion Rate & Speed (CRO)'}
                  </td>
                  <td className="p-3.5 text-teal-700 font-semibold">Liquid / WebP / CDN</td>
                  <td className="p-3.5 font-semibold text-slate-800">5 - 10 {i18n.language === 'tr' ? 'Gün' : i18n.language === 'ar' ? 'أيام' : 'Days'}</td>
                  <td className="p-3.5 text-slate-600">
                    {i18n.language === 'tr' ? '90+ Core Web Vitals skoru, tek sayfa ödeme akışı' : i18n.language === 'ar' ? 'مؤشر أداء 90+، تسريع الدفع وتبسيط الشراء' : '90+ Core Web Vitals, one-page checkout flow'}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {i18n.language === 'tr' ? 'Reklam bütçesi olan ancak satış dönüşümü düşük markalar' : i18n.language === 'ar' ? 'المتاجر ذات الزيارات العالية والتحويل المنخفض' : 'High traffic stores with low conversion'}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {i18n.language === 'tr' ? 'GEO & Yapay Zeka Optimizasyonu' : i18n.language === 'ar' ? 'تحسين محركات الذكاء الاصطناعي (GEO)' : 'Generative Engine Optimization (GEO)'}
                  </td>
                  <td className="p-3.5 text-teal-700 font-semibold">Schema.org / JSON-LD / llms.txt</td>
                  <td className="p-3.5 font-semibold text-slate-800">5 - 10 {i18n.language === 'tr' ? 'Gün' : i18n.language === 'ar' ? 'أيام' : 'Days'}</td>
                  <td className="p-3.5 text-slate-600">
                    {i18n.language === 'tr' ? 'Gemini, ChatGPT ve Perplexity aramalarında marka önerisi ve atıf altyapısı' : i18n.language === 'ar' ? 'تصدر نتائج محركات الذكاء الاصطناعي والاستشهاد بالعلامة التجارية' : 'Direct AI citations, knowledge graph schema, brand recommendation'}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {i18n.language === 'tr' ? 'Klasik SEO ötesinde AI arama çağına lider girmek isteyen markalar' : i18n.language === 'ar' ? 'العلامات التجارية الساعية للريادة في عصر محركات الذكاء الاصطناعي' : 'Forward-thinking brands targeting modern AI search authority'}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {i18n.language === 'tr' ? 'Web Tasarım & Geliştirme' : i18n.language === 'ar' ? 'تصميم وتطوير المواقع' : 'Web Design & React Development'}
                  </td>
                  <td className="p-3.5 text-teal-700 font-semibold">React / Next.js / Tailwind</td>
                  <td className="p-3.5 font-semibold text-slate-800">2 - 3 {i18n.language === 'tr' ? 'Hafta' : i18n.language === 'ar' ? 'أسابيع' : 'Weeks'}</td>
                  <td className="p-3.5 text-slate-600">
                    {i18n.language === 'tr' ? 'Mobile-first kurumsal tasarım, headless mimari' : i18n.language === 'ar' ? 'تصميم شركات للهواتف أولاً، وبنية Headless' : 'Mobile-first corporate design, headless frontend'}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {i18n.language === 'tr' ? 'Kurumsal şirketler ve prestij odaklı işletmeler' : i18n.language === 'ar' ? 'الشركات والمؤسسات الباحثة عن حضور قوي' : 'Corporate brands seeking modern UX'}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {i18n.language === 'tr' ? 'Stok & API Entegrasyonu' : i18n.language === 'ar' ? 'مزامنة المخزون والـ API' : 'Inventory & Marketplace API'}
                  </td>
                  <td className="p-3.5 text-teal-700 font-semibold">Node.js / REST / Webhook</td>
                  <td className="p-3.5 font-semibold text-slate-800">1 - 2 {i18n.language === 'tr' ? 'Hafta' : i18n.language === 'ar' ? 'أسابيع' : 'Weeks'}</td>
                  <td className="p-3.5 text-slate-600">
                    {i18n.language === 'tr' ? 'Trendyol, Hepsiburada ve ERP otomatik senkron' : i18n.language === 'ar' ? 'مزامنة آلية بين المنصات وERP والمنظومات' : 'Automated bi-directional ERP & marketplace sync'}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {i18n.language === 'tr' ? 'Çok kanallı satış yapan ve manuel hataları bitirmek isteyenler' : i18n.language === 'ar' ? 'التجار متعددو القنوات لتفادي الأخطاء اليدوية' : 'Omnichannel merchants ending manual work'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Shopify vs İKAS Comparison Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs">
          
          <div className="lg:col-span-7 flex flex-col gap-5 text-start">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {i18n.language === 'tr' 
                ? 'Shopify mı İKAS mı? Hangisini Seçmelisiniz?' 
                : i18n.language === 'ar' 
                ? 'شوبيفاي أم إيكاس؟ أيهما تختار لمتجرك؟' 
                : 'Shopify or İKAS? Which to Choose?'}
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal">
              {i18n.language === 'tr' 
                ? 'E-ticarette en önemli adım doğru altyapı seçimidir. Shopify ile küresel pazarlara açılabilir ve devasa entegrasyon havuzundan faydalanabilirsiniz. İKAS ise Türkiye pazarında inanılmaz yüksek hızlar, sıfır işlem komisyonu ve yerleşik yerel entegrasyonlar sunar. Hangisinin işletmeniz için doğru karar olduğunu detaylı analiz edip seçiyoruz.'
                : i18n.language === 'ar'
                ? 'اختيار منصة التجارة الإلكترونية المناسبة يحدد سرعة نموك. يوفر شوبيفاي قابلية توسع عالمية ودعم متعدد العملات، بينما تقدم إيكاس في تركيا سرعات استثنائية وبدون عمولات على المعاملات مع بوابات دفع محلية مدمجة. نحلل متطلباتك وننفذ الخيار الأنسب لعملك.'
                : 'Choosing the right engine dictates your growth. Shopify delivers global scaling with multi-currency checkout, while Turkish domestic performer İKAS provides blistering speeds, zero fees, and built-in local integration templates. We map out and implement the ideal choice for your business.'}
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 size={16} className="text-teal-600" />
                <span>Shopify: Global Scalability & Apps</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 size={16} className="text-teal-600" />
                <span>İKAS: Turbo Speed & Turkey Ready</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 flex flex-col gap-4 bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200 w-full text-start">
            <ul className="flex flex-col gap-3 text-xs leading-relaxed text-slate-700 font-medium">
              <li className="flex gap-2">
                <span className="text-teal-600 font-bold">&gt;</span>
                <span>
                  {i18n.language === 'tr' 
                    ? 'Hedef Pazarınız Türkiye ise: İKAS' 
                    : i18n.language === 'ar' 
                    ? 'إذا كان سوقك المستهدف تركيا: إيكاس' 
                    : 'Turkish Domestic Target: İKAS'}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-teal-600 font-bold">&gt;</span>
                <span>
                  {i18n.language === 'tr' 
                    ? 'Hedef Pazarınız Küresel ise: Shopify' 
                    : i18n.language === 'ar' 
                    ? 'إذا كان سوقك المستهدف عالمياً: شوبيفاي' 
                    : 'Global Export Target: Shopify'}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-teal-600 font-bold">&gt;</span>
                <span>
                  {i18n.language === 'tr' 
                    ? 'Kararsızsanız: Birlikte Ücretsiz Analiz Edelim' 
                    : i18n.language === 'ar' 
                    ? 'غير متأكد؟ دعنا نحلل مشروعك مجاناً' 
                    : 'Unsure? Let\'s analyze it together for free'}
                </span>
              </li>
            </ul>
            <Link
              to={getLocalizedPath('/iletisim?service=site-kurulumu', i18n.language)}
              className="mt-4 py-3.5 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold text-center rounded-2xl text-xs tracking-wide shadow-md shadow-orange-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{i18n.language === 'tr' ? 'Ücretsiz Yol Haritası Alın' : i18n.language === 'ar' ? 'احصل على خارطة طريق مجانية' : 'Get Free Project Roadmap'}</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

