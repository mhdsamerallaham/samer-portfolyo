import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';
import AuthorBox from '../components/AuthorBox';
import DirectAnswerBox from '../components/knowledge/DirectAnswerBox';
import KnowledgeGraphViewer from '../components/knowledge/KnowledgeGraphViewer';
import { getLocalizedPath } from '../utils/navigation';

export default function Blog() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [dynamicArticles, setDynamicArticles] = useState([]);

  const lang = i18n.language || 'tr';
  const isAr = lang === 'ar';
  const isEn = lang === 'en';

  const localArticles = useMemo(() => t('blog_page.articles', { returnObjects: true }) || [], [t]);
  const articles = useMemo(() => {
    return Array.isArray(dynamicArticles) && dynamicArticles.length > 0
      ? [
          ...localArticles,
          ...dynamicArticles.filter((dyn) => !localArticles.some((loc) => loc.slug === dyn.slug || loc.id === dyn.id))
        ]
      : localArticles;
  }, [dynamicArticles, localArticles]);

  const postSlug = slug || searchParams.get('post');
  const activeArticle = useMemo(() => {
    if (!postSlug || articles.length === 0) return null;
    return articles.find((a) => a.slug === postSlug || a.id === postSlug) || null;
  }, [postSlug, articles]);

  useEffect(() => {
    let active = true;
    fetch(`/api/blog/posts?lang=${i18n.language}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch dynamic articles');
        return res.json();
      })
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) {
          setDynamicArticles(data);
        }
      })
      .catch((err) => {
        console.warn('API error, using fallback local JSON articles:', err);
      });

    return () => {
      active = false;
    };
  }, [i18n.language]);

  const handleSelectArticle = (article) => {
    const postSlug = article.slug || article.id;
    navigate(getLocalizedPath(`/blog/${postSlug}`, i18n.language));
  };

  const handleBackToBlog = () => {
    navigate(getLocalizedPath('/blog', i18n.language));
  };

  if (activeArticle) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 text-start">
        <SEO
          title={activeArticle.seo_title || activeArticle.title}
          description={activeArticle.seo_description || activeArticle.summary}
          keywords="shopify, ikas, e-ticaret satış artırma, e-ticaret seo"
          article={{
            title: activeArticle.title,
            description: activeArticle.seo_description || activeArticle.summary,
            slug: activeArticle.slug || activeArticle.id,
            date: activeArticle.date,
          }}
        />

        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          <button
            onClick={handleBackToBlog}
            className="inline-flex items-center gap-2 text-xs font-bold mono text-slate-500 hover:text-teal-600 mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className={isAr ? 'rotate-180' : ''} />
            {t('blog_page.back_to_blog').toUpperCase()}
          </button>

          <header className="mb-8">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              {activeArticle.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 mono font-semibold border-b border-slate-200 pb-6">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-teal-600" />
                {activeArticle.date || new Date().toISOString().split('T')[0]}
              </span>
              <span className="flex items-center gap-2">
                <User size={14} className="text-teal-600" />
                Samer Allaham
              </span>
            </div>
          </header>

          {/* GEO/AEO Direct Answer Box */}
          {activeArticle.direct_answer && (
            <DirectAnswerBox answer={activeArticle.direct_answer} />
          )}

          {/* Article Body */}
          <article
            className="prose max-w-none text-slate-700 text-sm md:text-base leading-relaxed font-normal space-y-6 prose-headings:text-slate-900 prose-headings:font-extrabold prose-a:text-teal-600 hover:prose-a:text-teal-700 prose-strong:text-slate-900 prose-code:text-teal-800 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: activeArticle.content }}
          />

          {/* Author Box */}
          <AuthorBox />

          {/* Internal Linking Block: 2 Related Blog Links + 1 Target Service Link */}
          <div className="mt-12 pt-8 border-t border-slate-200 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen size={20} className="text-teal-600" />
              {isAr ? 'مقالات ذات صلة والخدمة المقترحة' : isEn ? 'Related Guides & Featured Service' : 'İlgili Yazılar ve İlgili Hizmet'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles
                .filter((a) => (a.slug || a.id) !== (activeArticle.slug || activeArticle.id))
                .slice(0, 2)
                .map((related, rIdx) => (
                  <div
                    key={`related-${rIdx}-${related.slug || related.id || ''}`}
                    onClick={() => handleSelectArticle(related)}
                    className="p-4 bg-white border border-slate-200/90 hover:border-teal-400 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5 shadow-xs"
                  >
                    <span className="text-xs text-teal-700 font-bold mono">
                      {isAr ? 'دليل إرشادي' : isEn ? 'Related Guide' : 'İlgili Rehber'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2">{related.title}</h4>
                  </div>
                ))}
            </div>

            {/* 1 Targeted Service Link */}
            <div className="p-6 bg-gradient-to-r from-teal-50/80 via-white to-orange-50/60 border border-teal-200/90 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-6 shadow-xs">
              <div>
                <span className="text-xs font-black mono text-teal-700 uppercase tracking-wider">
                  {isAr ? 'خدمتنا التخصصية' : isEn ? 'Specialized Service' : 'Uzmanlık Hizmetimiz'}
                </span>
                <h4 className="text-lg font-extrabold text-slate-900 mt-1">
                  {isAr ? 'تحسين معدل التحويل وسرعة المتاجر (CRO)' : isEn ? 'E-Commerce CRO & Speed Optimization' : 'E-Ticaret Dönüşüm ve Hız Optimizasyonu'}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {isAr
                    ? 'ارفع نتائج Core Web Vitals وتخلص من التراجع في سلة المشتريات.'
                    : isEn
                    ? 'Boost your Core Web Vitals score, eliminate checkout friction, and reduce cart loss.'
                    : 'Core Web Vitals skorlarınızı yükseltin, satış kaybını önleyin.'}
                </p>
              </div>
              <button
                onClick={() => navigate(getLocalizedPath('/eticaret-optimizasyon', i18n.language))}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer shadow-xs"
              >
                {isAr ? 'تفاصيل الخدمة ←' : isEn ? 'Explore Service →' : 'Hizmeti İnceleyin →'}
              </button>
            </div>
          </div>

          {/* Knowledge Graph Component */}
          <KnowledgeGraphViewer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 text-start">
      <SEO />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen size={13} className="text-teal-600" />
            <span>{isAr ? 'المقالات والأدلة الفنية' : isEn ? 'Technical Guides & Architecture' : 'Teknik Rehberler & Mimari'}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
            {t('blog_page.title')}
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
            {t('blog_page.subtitle')}
          </p>
        </div>

        {/* High-density E-Commerce Benchmark Matrix for Google AI Overviews & GEO */}
        <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.06)] mb-12">
          <div className="flex flex-col gap-2 mb-6">
            <span className="mono text-teal-700 bg-teal-50 border border-teal-200 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full self-start">
              {isAr ? '// مصفوفة المقارنة المرجعية للتجارة الإلكترونية' : isEn ? '// BENCHMARK_METRICS_MATRIX' : '// E_TİCARET_TEMEL_METRİKLER_MATRİSİ'}
            </span>
            <h3 className="text-xl md:text-2xl font-black text-slate-900">
              {isAr
                ? 'مؤشرات الأداء الحاسمة لمتاجر شوبيفاي وإيكاس'
                : isEn
                ? 'Critical E-Commerce Performance Benchmarks & Architecture'
                : 'Shopify & İKAS E-Ticaret Altyapı ve Performans Kriterleri'}
            </h3>
            <p className="text-slate-600 text-xs md:text-sm font-medium">
              {isAr
                ? 'مرجع تقني يستند إلى تجارب تحسين المتاجر التركية والعالمية (AIO Coffee، Nourla، Taam Club).'
                : isEn
                ? 'Architectural benchmarks derived from live store engineering (AIO Coffee, Nourla, Taam Club).'
                : 'Canlı müşteri projelerinde (AIO Coffee, Nourla, Taam Club) uygulanan performans ve mimari standartları.'}
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4 text-start">{isAr ? 'المجال' : isEn ? 'Domain' : 'Kategori'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'المعيار المستهدف' : isEn ? 'Target Standard' : 'Hedef Standart'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'الأثر التجاري' : isEn ? 'Business Impact' : 'Dönüşüm & Ciro Etkisi'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'الحل الهندسي المعتمد' : isEn ? 'Engineered Solution' : 'Uygulanan Mühendislik Çözümü'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-teal-800 text-start">{isAr ? 'سرعة المتجر (Core Web Vitals)' : isEn ? 'Core Web Vitals' : 'Sayfa Hızı (LCP / INP)'}</td>
                  <td className="py-3 px-4 text-slate-900 font-bold text-start">LCP &lt; 1.2s | INP &lt; 150ms</td>
                  <td className="py-3 px-4 text-start">{isAr ? '+35% إلى +50% في معدل إتمام الشراء' : isEn ? '+35% to +50% mobile checkout completion' : '%35 - %50 arası mobil sepet tamamlama artışı'}</td>
                  <td className="py-3 px-4 text-start">Shopify Liquid / React hydration &amp; CDN WebP pipeline</td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-teal-800 text-start">{isAr ? 'مزامنة المخزون متعدد القنوات' : isEn ? 'Multi-channel Inventory' : 'Pazaryeri & Stok Senkronizasyonu'}</td>
                  <td className="py-3 px-4 text-slate-900 font-bold text-start">Gerçek Zamanlı (Webhook &lt; 500ms)</td>
                  <td className="py-3 px-4 text-start">{isAr ? 'القضاء التام على أخطاء البيع الزائد (Overselling)' : isEn ? '0% overselling penalty on Trendyol / Amazon' : 'Sıfır stok aşımı ve ceza puanı engelleme'}</td>
                  <td className="py-3 px-4 text-start">Node.js / Express microservice &amp; Trendyol/Hepsiburada API</td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-teal-800 text-start">{isAr ? 'محركات الذكاء الاصطناعي و GEO' : isEn ? 'GEO & AI Search Overviews' : 'GEO & Yapay Zeka Arama Motorları'}</td>
                  <td className="py-3 px-4 text-slate-900 font-bold text-start">Schema.org JSON-LD &amp; FAQ Microdata</td>
                  <td className="py-3 px-4 text-start">{isAr ? 'ظهور مباشر في ملخصات Google Gemini و Perplexity' : isEn ? 'Top ranking in Google AI Overviews & SearchGPT' : 'Gemini AI Overviews ve Perplexity alıntılarında liderlik'}</td>
                  <td className="py-3 px-4 text-start">Nested Schema graph, direct answer blocks &amp; high entity density</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Knowledge Graph Component on Blog Hub */}
        <KnowledgeGraphViewer />

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {articles.map((article, idx) => (
            <div
              key={article.id || article.slug || idx}
              onClick={() => handleSelectArticle(article)}
              className="group bg-white border border-slate-200/90 hover:border-teal-400 hover:shadow-lg p-6 sm:p-8 rounded-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 shadow-xs"
            >
              <div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mono font-semibold mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-teal-600" />
                    {article.date || '2026'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors mb-3 line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed font-normal mb-6">
                  {article.summary}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-black mono text-teal-700 group-hover:text-teal-800">
                {t('blog_page.read_more')}
                <ArrowRight size={14} className={`group-hover:translate-x-1 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
