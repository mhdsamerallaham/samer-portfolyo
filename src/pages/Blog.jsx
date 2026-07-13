import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';

export default function Blog() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeArticle, setActiveArticle] = useState(null);
  const [dynamicArticles, setDynamicArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const localArticles = t('blog_page.articles', { returnObjects: true }) || [];
  const articles = Array.isArray(dynamicArticles) && dynamicArticles.length > 0 ? dynamicArticles : localArticles;

  // Fetch dynamic articles on mount / language change
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

  // Deep-linking from query parameter ?post=slug
  useEffect(() => {
    const postSlug = searchParams.get('post');
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
  }, [searchParams, articles]);

  const handleSelectArticle = (article) => {
    setSearchParams({ post: article.slug || article.id });
  };

  const handleBackToBlog = () => {
    setSearchParams({});
  };

  if (activeArticle) {
    return (
      <div className="pt-32 pb-24 text-white min-h-screen text-start">
        <SEO
          title={activeArticle.seo_title || activeArticle.title}
          description={activeArticle.seo_description || activeArticle.summary}
          keywords="shopify, ikas, e-ticaret satış artırma, e-ticaret seo"
        />

        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          {/* Back button */}
          <button
            onClick={handleBackToBlog}
            className="inline-flex items-center gap-2 text-xs font-black mono text-neutral-400 hover:text-[#ff6b6b] mb-12 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            {t('blog_page.back_to_blog').toUpperCase()}
          </button>

          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-6">
              {activeArticle.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400 mono font-semibold border-b border-white/5 pb-6">
              <span className="flex items-center gap-2">
                <Calendar size={14} />
                {activeArticle.date}
              </span>
              <span className="flex items-center gap-2">
                <User size={14} />
                Samer Allaham
              </span>
            </div>
          </header>

          {/* Article Body */}
          <article
            className="prose prose-invert max-w-none text-neutral-300 text-sm md:text-base leading-relaxed font-medium space-y-6"
            dangerouslySetInnerHTML={{ __html: activeArticle.content }}
          />

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
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
            {t('blog_page.title')}
          </h1>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed font-semibold">
            {t('blog_page.subtitle')}
          </p>
        </div>

        {/* Loading state indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-[#ff6b6b] animate-spin" />
          </div>
        )}

        {/* Blog Posts Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.isArray(articles) && articles.map((article) => (
              <div
                key={article.id || article.slug}
                className="bg-[#131b2e] border border-white/5 rounded-3xl p-8 flex flex-col justify-between hover:border-white/10 transition-all duration-300 group"
              >
                <div className="flex flex-col gap-4 text-left">
                  {/* Date */}
                  <span className="mono text-[9px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={12} />
                    {article.date}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-[#ff6b6b] transition-colors leading-tight">
                    {article.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-neutral-400 text-xs md:text-sm font-semibold leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                {/* Action */}
                <div className="border-t border-white/5 pt-6 mt-8 flex justify-between items-center">
                  <button
                    onClick={() => handleSelectArticle(article)}
                    className="mono text-[9px] font-black text-neutral-400 hover:text-[#ff6b6b] transition-colors flex items-center gap-2 uppercase cursor-pointer"
                  >
                    <BookOpen size={14} />
                    {t('blog_page.read_more')}
                  </button>
                  <ArrowRight size={14} className="text-neutral-400 group-hover:text-[#ff6b6b] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
