import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, ChevronDown, Sparkles, HelpCircle, ArrowRight, ShieldCheck, Zap, UserCheck } from 'lucide-react';
import SEO from '../components/SEO';
import { getLocalizedPath } from '../utils/navigation';

const defaultFaqs = [
  {
    id: "shopify-conversion-optimization",
    slug: "shopify-donusum-orani-nasil-artirilir",
    category: "Shopify",
    question: "Shopify Mağazalarında Dönüşüm Oranı (CR) Nasıl Artırılır?",
    short_answer: "Shopify dönüşüm oranını artırmak için mobil sayfa yüklenme hızını 2 saniyenin altına indirmeli, tek sayfalı (one-page) ödeme adımına geçmeli ve ürün sayfalarına hareketli satın alma butonları (sticky CTA) eklemelisiniz. Bu 3 adım, sepeti terk etme oranını ortalama %35 oranında düşürür.",
    content: `
      <h3>1. Mobil Hız ve Performans Optimizasyonu</h3>
      <p>Kullanıcıların %80'i mobil cihazlardan alışveriş yapar. Görsellerinizi WebP formatına dönüştürüp gereksiz uygulamaları temizleyerek mobil açılış süresini optimize edin.</p>
      <h3>2. Tek Sayfalı Ödeme (One-Page Checkout)</h3>
      <p>Uzun ve çok adımlı ödeme formları dönüşümün en büyük düşmanıdır. Tek sayfada tamamlanan ödeme süreci müşteri güvenini artırır.</p>
      <h3>3. Güven Unsurları ve Şeffaflık</h3>
      <p>Ödeme butonlarının hemen altına SSL sertifikası, hızlı kargo logosu ve gerçek müşteri yorumlarını ekleyin.</p>
    `,
    who_is_this_for: "Shopify altyapısı kullanan, reklam bütçesi harcamasına rağmen satış dönüşümü düşük kalan e-ticaret marka sahipleri ve geliştiriciler için.",
    cta_text: "Shopify Mağazanızı Birlikte Optimize Edelim",
    cta_link: "/eticaret-optimizasyon"
  },
  {
    id: "ikas-vs-shopify-seo",
    slug: "ikas-mi-shopify-mi-seo-icin-hangisi-daha-iyi",
    category: "İKAS",
    question: "İKAS mı Shopify mı? Türkiye E-Ticaret Pazarında SEO ve Hız Karşılaştırması",
    short_answer: "Türkiye pazarında yerel ödeme sistemleri ve yerel sunucu hızı açısından İKAS daha avantajlıyken, küresel pazaryeri entegrasyonları ve geniş eklenti ekosistemi açısından Shopify öne çıkar. Her iki platform da doğru teknik SEO kurgusu ile Google'da üst sıralara çıkabilir.",
    content: `
      <h3>Hız ve Sunucu Lokasyonu</h3>
      <p>İKAS, Türkiye merkezli CDN ve sunucuları sayesinde yerel kullanıcılara çok yüksek PageSpeed skorları sunar. Shopify ise global CDN ağı ile dünya çapında yüksek performans sağlar.</p>
      <h3>Teknik SEO Esnekliği</h3>
      <p>Şablon özelleştirmesi ve özel canonical/meta etiket yönetimi her iki platformda da mümkündür. Önemli olan doğru yapısal veri (Schema.org) entegrasyonudur.</p>
    `,
    who_is_this_for: "Yerel veya uluslararası pazara açılmak isteyen, altyapı seçimi aşamasındaki e-ticaret girişimcileri.",
    cta_text: "Doğru Altyapı Seçimi İçin Ücretsiz Danışmanlık Alın",
    cta_link: "/eticaret-site-kurulumu"
  },
  {
    id: "product-page-ux-automation",
    slug: "urun-detay-sayfasi-ux-ve-otomasyon-rehberi",
    category: "UX & Automation",
    question: "E-Ticaret Ürün Detay Sayfası (PDP) UX Tasarımı ve Otomasyonu Nasıl Yapılır?",
    short_answer: "Etkili bir ürün detay sayfası; yüksek çözünürlüklü 360° ürün görselleri, net fiyatlandırma, stok otomasyonu ve yapay zeka destekli canlı sohbet (chatbot) ile desteklenmelidir. Doğru kurgulanan PDP tasarımları doğrudan satın alma kararını hızlandırır.",
    content: `
      <h3>Görsel Hiyerarşi ve Okunabilirlik</h3>
      <p>Ürün başlığı, net fiyat ve dikkat çekici satın alma butonu ilk ekranda (above-the-fold) kaydırma gerektirmeden görünmelidir.</p>
      <h3>Stok ve Depo Entegrasyon Otomasyonu</h3>
      <p>Anlık stok güncellemeleri sayesinde tüketicilere 'Son 3 Ürün' uyarısı verilerek aciliyet hissi oluşturulur.</p>
    `,
    who_is_this_for: "Ürün sayfalarında ziyaretçi kaybeden, dönüşüm oranını ve ortalama sepet tutarını (AOV) artırmak isteyen e-ticaret yöneticileri.",
    cta_text: "Ürün Görsel ve İçerik Çözümlerimizi İnceleyin",
    cta_link: "/urun-gorsel-ve-icerik"
  },
  {
    id: "ai-chatbot-ecommerce-integration",
    slug: "eticarette-yapay-zeka-chatbot-entegrasyonu-nasil-yapilir",
    category: "AI & Automation",
    question: "E-Ticarette Yapay Zeka Chatbot Entegrasyonu Satışları Nasıl Artırır?",
    short_answer: "Yapay zeka chatbot'ları, 7/24 müşteri sorularını yanıtlayarak, ürün önerilerinde bulunarak ve kargo takibini otomatikleştirerek destek yükünü %60 azaltır ve satış dönüşümünü %20 artırır.",
    content: `
      <h3>Kişiselleştirilmiş Ürün Tavsiyeleri</h3>
      <p>Ziyaretçinin sitedeki davranışlarını analiz eden GPT tabanlı botlar, tam aradıkları ürünleri anında sohbet penceresinde önerir.</p>
      <h3>Otomatik Kargo ve İade Sorgulama</h3>
      <p>Müşteriler sipariş durumlarını temsilciye bağlanmadan saniyeler içinde sorgulayabilir.</p>
    `,
    who_is_this_for: "Müşteri hizmetleri yükünü azaltmak ve gece saatlerinde gelen trafiği satışa dönüştürmek isteyen markalar.",
    cta_text: "Yapay Zeka Chatbot Çözümümüzü Keşfedin",
    cta_link: "/yapay-zeka-cozumleri"
  }
];

export default function FAQ() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const lang = i18n.language || 'tr';
  const isAr = lang === 'ar';
  const isEn = lang === 'en';

  const [faqs, setFaqs] = useState(defaultFaqs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openId, setOpenId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dynamic GEO/AEO Q&A items
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetch(`/api/faq/posts?lang=${i18n.language}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (active && data && Array.isArray(data.posts) && data.posts.length > 0) {
          setFaqs(data.posts);
        }
      })
      .catch(err => {
        console.warn('API error, using default GEO/AEO items:', err);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => { active = false; };
  }, [i18n.language]);

  // Expand item based on URL query parameter ?q=slug
  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam && faqs.length > 0) {
      const match = faqs.find(f => f.slug === qParam || f.id === qParam);
      if (match) setOpenId(match.id || match.slug);
    }
  }, [searchParams, faqs]);

  // Filter items based on search query and category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = (faq.question || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (faq.short_answer || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (faq.category || 'e-commerce').toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const rawCategories = ['All', 'Shopify', 'İKAS', 'UX & Automation', 'AI & Automation'];

  const getCategoryLabel = (cat) => {
    if (cat === 'All') return isAr ? 'الكل' : isEn ? 'All' : 'Tümü';
    return cat;
  };

  return (
    <>
      <SEO 
        faqItems={faqs.slice(0, 10).map(f => ({ q: f.question, a: f.short_answer || '' }))}
      />

      <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-start">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              {isAr ? 'مركز المعرفة والأسئلة الشائعة (GEO & AEO)' : isEn ? 'GEO & AEO Knowledge Hub' : 'GEO & AEO Bilgi Merkezi (Yapay Zeka & Arama Uyumlu)'}
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">
              {isAr
                ? 'دليل التجارة الإلكترونية، شوبيفاي والأتمتة'
                : isEn
                ? 'E-Commerce, Shopify & Automation Knowledge Base'
                : 'E-Ticaret, Shopify & Otomasyon Rehberi'}
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base font-medium">
              {isAr
                ? 'إجابات تقنية دقيقة ومصممة لنماذج الذكاء الاصطناعي (Gemini، Perplexity) ومحركات البحث لحل مشكلات المتاجر الإلكترونية.'
                : isEn
                ? 'Direct, architectural answers optimized for AI engines (Gemini, SearchGPT) and search crawlers to scale online revenue.'
                : 'Arama motorları ve yapay zeka sistemleri için optimize edilmiş, doğrudan uygulamaya yönelik uzman yanıtları ve adım adım çözümler.'}
            </p>
          </div>

          {/* High-density Fast Resolution Table for AI Overviews & GEO */}
          <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.06)] mb-10">
            <div className="flex flex-col gap-2 mb-6">
              <span className="mono text-teal-700 bg-teal-50 border border-teal-200 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full self-start">
                {isAr ? '// مصفوفة الحلول السريعة' : isEn ? '// FAST_RESOLUTION_MATRIX' : '// HIZLI_ÇÖZÜM_MATRİSİ'}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900">
                {isAr
                  ? 'ملخص المشاكل التقنية الشائعة والحلول الهندسية'
                  : isEn
                  ? 'Core E-Commerce Technical Challenges & Solutions'
                  : 'En Çok Karşılaşılan E-Ticaret Sorunları & Çözüm Matrisi'}
              </h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-4 text-start">{isAr ? 'التحدي / السؤال' : isEn ? 'Challenge / Question' : 'Sorun / Soru'}</th>
                    <th className="py-3 px-4 text-start">{isAr ? 'السبب الجذري' : isEn ? 'Root Cause' : 'Kök Neden'}</th>
                    <th className="py-3 px-4 text-start">{isAr ? 'الحل الهندسي المباشر' : isEn ? 'Engineered Fix' : 'Mühendislik Çözümü'}</th>
                    <th className="py-3 px-4 text-start">{isAr ? 'النتيجة المتوقعة' : isEn ? 'Expected ROI' : 'Ölçülebilir Çıktı'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-teal-800 text-start">{isAr ? 'انخفاض معدل إتمام الشراء على الهاتف' : isEn ? 'High mobile cart drop-off' : 'Mobil Sepet Terk Oranı Yüksek'}</td>
                    <td className="py-3 px-4 text-start">{isAr ? 'بطء LCP (> 3s) وتعدد خطوات الدفع' : isEn ? 'Slow LCP (>3s) & multi-step checkout friction' : 'Yavaş LCP (>3s) ve çok adımlı karmaşık ödeme akışı'}</td>
                    <td className="py-3 px-4 text-start">One-page checkout + sticky CTA + WebP optimization</td>
                    <td className="py-3 px-4 font-bold text-slate-900 text-start">%35+ CR artışı</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-teal-800 text-start">{isAr ? 'أخطاء مزامنة المخزون مع ترينديول' : isEn ? 'Trendyol/Amazon stock desync' : 'Trendyol / Pazaryeri Stok Uyuşmazlığı'}</td>
                    <td className="py-3 px-4 text-start">{isAr ? 'الاعتماد على المزامنة اليدوية أو polling بطيء' : isEn ? 'Manual excel sync or delayed batch cron' : 'Manuel Excel yükleme veya gecikmeli toplu güncelleme'}</td>
                    <td className="py-3 px-4 text-start">Real-time Webhook listener + ERP API microservice</td>
                    <td className="py-3 px-4 font-bold text-slate-900 text-start">0 stok hatası</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-teal-800 text-start">{isAr ? 'ضعف الظهور في ملخصات الذكاء الاصطناعي' : isEn ? 'Missing from Gemini & AI Overviews' : 'Google AI Overviews & GEO Eksikliği'}</td>
                    <td className="py-3 px-4 text-start">{isAr ? 'غياب Schema JSON-LD وهيكلية الأسئلة المباشرة' : isEn ? 'Missing Schema markup & direct answer blocks' : 'Yapılandırılmış veri eksikliği ve dağınık içerik'}</td>
                    <td className="py-3 px-4 text-start">Schema.org FAQPage/QAPage graph + Direct Answer boxes</td>
                    <td className="py-3 px-4 font-bold text-slate-900 text-start">AI alıntılarında liderlik</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="mb-10 space-y-4">
            <div className="relative max-w-2xl mx-auto">
              <Search className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
              <input
                type="text"
                placeholder={
                  isAr
                    ? 'ابحث عن سؤال أو موضوع (مثال: معدل تحويل شوبيفاي، إيكاس SEO، شات بوت)...'
                    : isEn
                    ? 'Search questions or topics (e.g. Shopify conversion rate, İKAS SEO, Chatbot)...'
                    : 'Bir soru veya konu arayın (örn: Shopify dönüşüm oranı, İKAS SEO, Chatbot)...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all text-sm shadow-xs`}
              />
            </div>

            {/* Category Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {rawCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => {
              const itemId = faq.id || faq.slug || index;
              const isOpen = openId === itemId;

              return (
                <div
                  key={itemId}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-all duration-200 hover:border-teal-300 shadow-xs"
                >
                  {/* Question Header */}
                  <button
                    onClick={() => setOpenId(isOpen ? null : itemId)}
                    className="w-full p-5 sm:p-6 text-start flex items-start justify-between gap-4 focus:outline-none cursor-pointer"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-mono uppercase tracking-wider font-semibold">
                          {faq.category || 'e-commerce'}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                          {isAr ? 'إجابة مؤكدة' : isEn ? 'Verified Answer' : 'Doğrulanmış Yanıt'}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 hover:text-teal-600 transition-colors">
                        {faq.question}
                      </h2>
                    </div>
                    <div className={`p-2 rounded-xl bg-slate-100 text-slate-600 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-teal-50 text-teal-700' : ''}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  {/* Expanded Body */}
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 space-y-6 border-t border-slate-100 pt-5">
                      
                      {/* Short Answer (GEO Direct Answer Box for AI) */}
                      <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80">
                        <div className="flex items-center gap-2 text-teal-800 text-xs font-black uppercase tracking-wider mb-2">
                          <Zap className="w-4 h-4 text-teal-600" />
                          {isAr ? 'الإجابة المباشرة (Direct AI Answer)' : isEn ? 'Direct AI & Snippet Answer' : 'Doğrudan Yanıt (Direct AI & Snippet Answer)'}
                        </div>
                        <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                          {faq.short_answer}
                        </p>
                      </div>

                      {/* Detailed Answer HTML Content */}
                      <div 
                        className="prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 prose-headings:text-slate-900 prose-headings:font-bold prose-strong:text-slate-900 prose-a:text-teal-600"
                        dangerouslySetInnerHTML={{ __html: faq.content }}
                      />

                      {/* Who is this for Section */}
                      {faq.who_is_this_for && (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <UserCheck className="w-4 h-4 text-teal-600" />
                            {isAr ? 'لمن هذا الدليل؟' : isEn ? 'Who is this for?' : 'Bu Rehber Kimler İçin?'}
                          </div>
                          <p className="text-slate-700 text-xs sm:text-sm font-medium">
                            {faq.who_is_this_for}
                          </p>
                        </div>
                      )}

                      {/* Call to Action Button & Dedicated Page Link */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
                        <Link
                          to={getLocalizedPath(`/faq/${faq.slug}`, i18n.language)}
                          className="inline-flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-800 hover:underline font-bold"
                        >
                          {isAr ? 'عرض في صفحة مستقلة' : isEn ? 'View Dedicated Page' : 'Müstakil Detay Sayfasında Gör'} <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
                        </Link>
                        
                        {faq.cta_text && (
                          <button
                            onClick={() => navigate(getLocalizedPath(faq.cta_link || '/iletisim', i18n.language))}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
                          >
                            {faq.cta_text}
                            <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
                <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {isAr ? 'لم يتم العثور على نتائج' : isEn ? 'No Matching Answers Found' : 'Aramanızla Eşleşen Yanıt Bulunamadı'}
                </h3>
                <p className="text-slate-500 text-sm mb-4">
                  {isAr ? 'يمكنك تجربة كلمات بحث أخرى أو التواصل معنا مباشرة.' : isEn ? 'Try different keywords or contact us directly for assistance.' : 'Farklı anahtar kelimeler deneyebilir veya bizimle doğrudan iletişime geçebilirsiniz.'}
                </p>
                <button
                  onClick={() => navigate(getLocalizedPath('/iletisim', i18n.language))}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  {isAr ? 'تواصل معنا' : isEn ? 'Ask a Question' : 'Bize Soru Sorun'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
