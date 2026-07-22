import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import AuthorBox from '../components/AuthorBox';
import DirectAnswerBox from '../components/knowledge/DirectAnswerBox';
import KnowledgeGraphViewer from '../components/knowledge/KnowledgeGraphViewer';

export default function Blog() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [activeArticle, setActiveArticle] = useState(null);
  const [dynamicArticles, setDynamicArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const localArticles = t('blog_page.articles', { returnObjects: true }) || [];
  const articles = Array.isArray(dynamicArticles) && dynamicArticles.length > 0 ? dynamicArticles : localArticles;

  useEffect(() => {
    let active = true;
    setIsLoading(true);
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
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [i18n.language]);

  useEffect(() => {
    const postSlug = slug || searchParams.get('post');
    if (postSlug && articles.length > 0) {
      const match = articles.find((a) => a.slug === postSlug || a.id === postSlug);
      if (match) {
        setActiveArticle(match);
      } else {
        setActiveArticle(null);
      }
    } else {
      setActiveArticle(null);
    }
  }, [slug, searchParams, articles]);

  const handleSelectArticle = (article) => {
    navigate(`/blog/${article.slug || article.id}`);
  };

  const handleBackToBlog = () => {
    navigate('/blog');
  };

  if (activeArticle) {
    return (
      <div className="pt-32 pb-24 text-white min-h-screen text-start">
        <SEO
          title={activeArticle.seo_title || activeArticle.title}
          description={activeArticle.seo_description || activeArticle.summary}
          keywords="shopify, ikas, e-ticaret satış artırma, e-ticaret seo"
          article={{
            title: activeArticle.title,
            description: activeArticle.seo_description || activeArticle.summary,
            slug: activeArticle.slug || activeArticle.id,
            date: activeArticle.date
          }}
        />

        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          <button
            onClick={handleBackToBlog}
            className="inline-flex items-center gap-2 text-xs font-black mono text-neutral-400 hover:text-[#ff6b6b] mb-12 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            {t('blog_page.back_to_blog').toUpperCase()}
          </button>

          <header className="mb-8">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-6">
              {activeArticle.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400 mono font-semibold border-b border-white/5 pb-6">
              <span className="flex items-center gap-2">
                <Calendar size={14} />
                {activeArticle.date || new Date().toISOString().split('T')[0]}
              </span>
              <span className="flex items-center gap-2">
                <User size={14} />
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
            className="prose prose-invert max-w-none text-neutral-300 text-sm md:text-base leading-relaxed font-medium space-y-6"
            dangerouslySetInnerHTML={{ __html: activeArticle.content }}
          />

          {/* Author Box */}
          <AuthorBox />

          {/* Knowledge Graph Component */}
          <KnowledgeGraphViewer />

        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 text-white min-h-screen text-start">
      <SEO
        title={t('nav.blog')}
        description={t('blog_page.subtitle')}
        keywords="shopify site kurma, ikas e ticaret sitesi, e ticaret danışmanlığı, e-ticaret blog"
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
            {t('blog_page.title')}
          </h1>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed font-semibold">
            {t('blog_page.subtitle')}
          </p>
        </div>

        {/* Knowledge Graph Component on Blog Hub */}
        <KnowledgeGraphViewer />

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {articles.map((article, idx) => (
            <div
              key={article.id || article.slug || idx}
              onClick={() => handleSelectArticle(article)}
              className="group bg-[#161a20] border border-white/5 hover:border-[#ff6b6b]/30 p-8 rounded-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center gap-3 text-xs text-neutral-400 mono font-semibold mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {article.date || '2026'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-[#ff6b6b] transition-colors mb-4 line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-neutral-400 text-sm line-clamp-3 leading-relaxed font-medium mb-6">
                  {article.summary}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-black mono text-[#ff6b6b]">
                {t('blog_page.read_more')}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
