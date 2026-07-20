import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, ChevronDown, Sparkles, HelpCircle, ArrowRight, CheckCircle2, UserCheck, Zap, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';

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

  const categories = ['All', 'Shopify', 'İKAS', 'UX & Automation', 'AI & Automation'];

  // Construct Schema.org FAQPage JSON-LD for Search Engines & AI Crawlers
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `${item.short_answer} ${item.content ? item.content.replace(/<[^>]*>?/gm, '') : ''}`
      }
    }))
  };

  return (
    <>
      <SEO 
        title="E-Ticaret & Yazılım Çözümleri SSS | GEO & AEO Bilgi Bankası"
        description="Shopify, İKAS, e-ticaret dönüşüm optimizasyonu, UX ve yapay zeka otomasyonları hakkında yapay zeka ve arama motorları için hazırlanmış rehberler."
      />

      {/* Inject Structured FAQPage JSON-LD Schema for ChatGPT, Gemini, Perplexity & Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-[#0d0f12] text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 text-[#ff6b6b] text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              GEO & AEO Knowledge Hub (Yapay Zeka & Arama Uyumlu)
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
              E-Ticaret, Shopify & Otomasyon Rehberi
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Arama motorları ve yapay zeka sistemleri için optimize edilmiş, doğrudan uygulamaya yönelik uzman yanıtları ve adım adım çözümler.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="mb-10 space-y-4">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Bir soru veya konu arayın (örn: Shopify dönüşüm oranı, İKAS SEO, Chatbot)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#161a20] border border-gray-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b6b] transition-all text-sm"
              />
            </div>

            {/* Category Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#ff6b6b] text-white shadow-lg shadow-[#ff6b6b]/25'
                      : 'bg-[#161a20] text-gray-400 hover:text-white border border-gray-800'
                  }`}
                >
                  {cat}
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
                  className="bg-[#161a20] border border-gray-800/80 rounded-2xl overflow-hidden transition-all duration-200 hover:border-gray-700"
                >
                  {/* Question Header */}
                  <button
                    onClick={() => setOpenId(isOpen ? null : itemId)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 focus:outline-none"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-white/5 text-gray-400 text-[11px] font-mono uppercase tracking-wider">
                          {faq.category || 'e-commerce'}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" /> Doğrulanmış Yanıt
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#ff6b6b] transition-colors">
                        {faq.question}
                      </h2>
                    </div>
                    <div className={`p-2 rounded-xl bg-white/5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#ff6b6b]/20 text-[#ff6b6b]' : ''}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  {/* Expanded Body */}
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 space-y-6 border-t border-gray-800/60 pt-5">
                      
                      {/* Short Answer (GEO Direct Answer Box for AI) */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-[#ff6b6b]/10 via-purple-500/5 to-transparent border border-[#ff6b6b]/30">
                        <div className="flex items-center gap-2 text-[#ff6b6b] text-xs font-bold uppercase tracking-wider mb-2">
                          <Zap className="w-4 h-4" />
                          Doğrudan Yanıt (Direct AI & Snippet Answer)
                        </div>
                        <p className="text-gray-200 text-sm sm:text-base font-medium leading-relaxed">
                          {faq.short_answer}
                        </p>
                      </div>

                      {/* Detailed Answer HTML Content */}
                      <div 
                        className="prose prose-invert max-w-none text-gray-300 text-sm sm:text-base leading-relaxed space-y-4"
                        dangerouslySetInnerHTML={{ __html: faq.content }}
                      />

                      {/* Who is this for Section */}
                      {faq.who_is_this_for && (
                        <div className="p-4 rounded-xl bg-[#0d0f12] border border-gray-800 space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <UserCheck className="w-4 h-4 text-emerald-400" />
                            Bu Rehber Kimler İçin?
                          </div>
                          <p className="text-gray-300 text-xs sm:text-sm">
                            {faq.who_is_this_for}
                          </p>
                        </div>
                      )}

                      {/* Call to Action Button & Dedicated Page Link */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-gray-800/50">
                        <Link
                          to={`/faq/${faq.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs text-[#ff6b6b] hover:underline font-semibold"
                        >
                          Müstakil Detay Sayfasında Gör <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        
                        {faq.cta_text && (
                          <button
                            onClick={() => navigate(faq.cta_link || '/contact')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#ff6b6b]/20"
                          >
                            {faq.cta_text}
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12 bg-[#161a20] border border-gray-800 rounded-2xl p-8">
                <HelpCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">Aramanızla Eşleşen Yanıt Bulunamadı</h3>
                <p className="text-gray-400 text-sm mb-4">Farklı anahtar kelimeler deneyebilir veya bizimle doğrudan iletişime geçebilirsiniz.</p>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
                >
                  Bize Soru Sorun
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
