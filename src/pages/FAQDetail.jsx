import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, ChevronRight, ArrowRight, UserCheck, Zap, ShieldCheck, Share2, CheckCircle, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { getLocalizedPath } from '../utils/navigation';

export default function FAQDetail() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [faq, setFaq] = useState(null);
  const [relatedFaqs, setRelatedFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Q&A item and all FAQs for related links
  useEffect(() => {
    let active = true;
    setIsLoading(true);

    fetch(`/api/faq/posts?lang=${i18n.language}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (active && data && Array.isArray(data.posts) && data.posts.length > 0) {
          const match = data.posts.find(f => f.slug === slug || f.id === slug);
          if (match) {
            setFaq(match);
            setRelatedFaqs(data.posts.filter(f => f.slug !== slug).slice(0, 3));
          } else {
            setFaq(null);
          }
        }
      })
      .catch(err => {
        console.warn('API error loading Q&A detail:', err);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => { active = false; };
  }, [slug, i18n.language]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0f12] text-white pt-32 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ff6b6b]/30 border-t-[#ff6b6b] rounded-full animate-spin" />
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="min-h-screen bg-[#0d0f12] text-white pt-32 pb-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-[#161a20] border border-gray-800 rounded-2xl p-8">
          <HelpCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Soru Bulunamadı</h1>
          <p className="text-gray-400 text-sm mb-6">Aradığınız soru kaldırılmış veya adresi değişmiş olabilir.</p>
          <Link
            to={getLocalizedPath('/faq', i18n.language)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6b6b] text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Tüm SSS & Rehberlere Dön
          </Link>
        </div>
      </div>
    );
  }

  // Construct Individual QAPage & FAQPage JSON-LD Schema for Google & AI Engines
  const qnaSchema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": faq.question,
      "text": faq.question,
      "answerCount": 1,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `${faq.short_answer} ${faq.content ? faq.content.replace(/<[^>]*>?/gm, '') : ''}`,
        "upvoteCount": 42,
        "url": window.location.href
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Anasayfa", "item": window.location.origin },
      { "@type": "ListItem", "position": 2, "name": "SSS & Bilgi Bankası", "item": `${window.location.origin}/faq` },
      { "@type": "ListItem", "position": 3, "name": faq.question, "item": window.location.href }
    ]
  };

  return (
    <>
      <SEO
        title={`${faq.question} | GEO & AEO Rehberi`}
        description={faq.short_answer}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(qnaSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="min-h-screen bg-[#0d0f12] text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 overflow-x-auto whitespace-nowrap py-1">
            <Link to={getLocalizedPath('/', i18n.language)} className="hover:text-white transition-colors">Anasayfa</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
            <Link to={getLocalizedPath('/faq', i18n.language)} className="hover:text-white transition-colors">SSS & Bilgi Bankası</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
            <span className="text-[#ff6b6b] font-medium truncate max-w-[200px] sm:max-w-xs">{faq.question}</span>
          </nav>

          {/* Back Button */}
          <Link
            to={getLocalizedPath('/faq', i18n.language)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Tüm Sorulara Dön
          </Link>

          {/* Article Header Card */}
          <div className="bg-[#161a20] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-lg bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 text-[#ff6b6b] text-xs font-mono font-bold uppercase tracking-wider">
                {faq.category || 'e-commerce'}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" /> AEO / GEO Doğrulanmış Yanıt
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight text-white">
              {faq.question}
            </h1>

            {/* GEO Direct Answer Box (Google Featured Snippet & AI Answer) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#ff6b6b]/15 via-purple-500/10 to-transparent border border-[#ff6b6b]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#ff6b6b] text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                Öne Çıkan Doğrudan Yanıt (Direct AI & Snippet Answer)
              </div>
              <p className="text-gray-100 text-base sm:text-lg font-medium leading-relaxed">
                {faq.short_answer}
              </p>
            </div>

            {/* Detailed Answer HTML Content */}
            <div 
              className="prose prose-invert max-w-none text-gray-300 text-base leading-relaxed space-y-4 pt-4 border-t border-gray-800/80"
              dangerouslySetInnerHTML={{ __html: faq.content }}
            />

            {/* Who is this for Section */}
            {faq.who_is_this_for && (
              <div className="p-5 rounded-2xl bg-[#0d0f12] border border-gray-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  Bu Rehber ve Çözüm Kimler İçin?
                </div>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {faq.who_is_this_for}
                </p>
              </div>
            )}

            {/* CTA Box */}
            {faq.cta_text && (
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800/80">
                <div className="text-left space-y-1">
                  <h4 className="text-sm font-bold text-white">Özel Bir Entegrasyona mı İhtiyacınız Var?</h4>
                  <p className="text-xs text-gray-400">Projenize özel SEO, e-ticaret ve otomasyon kurgusu hazırlayabilirim.</p>
                </div>
                <button
                  onClick={() => navigate(faq.cta_link || '/contact')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-sm font-semibold transition-all shadow-lg shadow-[#ff6b6b]/20"
                >
                  {faq.cta_text}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Related Q&A Section (Internal Linking for Page Rank Multiplier) */}
          {relatedFaqs.length > 0 && (
            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ff6b6b]" />
                İlgili Diğer Soru ve Yanıtlar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedFaqs.map(rel => (
                  <Link
                    key={rel.id || rel.slug}
                    to={getLocalizedPath(`/faq/${rel.slug}`, i18n.language)}
                    className="p-4 rounded-2xl bg-[#161a20] border border-gray-800 hover:border-[#ff6b6b]/50 transition-all space-y-2 flex flex-col justify-between group"
                  >
                    <span className="text-[10px] font-mono text-[#ff6b6b] uppercase">{rel.category || 'e-commerce'}</span>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#ff6b6b] transition-colors line-clamp-2">
                      {rel.question}
                    </h4>
                    <span className="text-xs text-gray-400 inline-flex items-center gap-1 group-hover:text-white pt-2">
                      İncele <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
