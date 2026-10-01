import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, ChevronRight, ArrowRight, UserCheck, Zap, ShieldCheck, Share2, CheckCircle, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';
import AuthorBox from '../components/AuthorBox';
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

  const lang = i18n.language || 'tr';
  const isAr = lang === 'ar';
  const isEn = lang === 'en';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {isAr ? 'لم يتم العثور على السؤال' : isEn ? 'Question Not Found' : 'Soru Bulunamadı'}
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            {isAr
              ? 'قد يكون تم تعديل أو نقل هذا السؤال إلى عنوان آخر.'
              : isEn
              ? 'The requested FAQ may have been updated or moved.'
              : 'Aradığınız soru kaldırılmış veya adresi değişmiş olabilir.'}
          </p>
          <Link
            to={getLocalizedPath('/faq', i18n.language)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            {isAr ? 'العودة إلى الأسئلة الشائعة' : isEn ? 'Back to Knowledge Base' : 'Tüm SSS & Rehberlere Dön'}
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
      "upvoteCount": 42,
      "datePublished": faq.published_at || "2026-07-27",
      "author": {
        "@type": "Person",
        "name": "Samer Allaham",
        "url": "https://www.samer.life/hakkimda"
      },
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `${faq.short_answer || ''} ${faq.content ? faq.content.replace(/<[^>]*>?/gm, '') : ''}`,
        "upvoteCount": 42,
        "datePublished": faq.published_at || "2026-07-27",
        "url": typeof window !== 'undefined' ? window.location.href : `https://www.samer.life/faq/${faq.slug}`,
        "author": {
          "@type": "Person",
          "name": "Samer Allaham",
          "url": "https://www.samer.life/hakkimda"
        }
      }
    }
  };

  return (
    <>
      <SEO
        title={`${faq.question} | Samer`}
        description={faq.short_answer}
        schema={qnaSchema}
      />

      <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-start">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap py-1">
            <Link to={getLocalizedPath('/', i18n.language)} className="hover:text-teal-600 transition-colors font-medium">
              {t('nav.home')}
            </Link>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 ${isAr ? 'rotate-180' : ''}`} />
            <Link to={getLocalizedPath('/faq', i18n.language)} className="hover:text-teal-600 transition-colors font-medium">
              {isAr ? 'الأسئلة الشائعة' : isEn ? 'FAQ & Knowledge Base' : 'SSS & Bilgi Bankası'}
            </Link>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 ${isAr ? 'rotate-180' : ''}`} />
            <span className="text-teal-700 font-bold truncate max-w-[200px] sm:max-w-xs">{faq.question}</span>
          </nav>

          {/* Back Button */}
          <Link
            to={getLocalizedPath('/faq', i18n.language)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            {isAr ? 'العودة لجميع الأسئلة' : isEn ? 'Back to All Questions' : 'Tüm Sorulara Dön'}
          </Link>

          {/* Article Header Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-bold uppercase tracking-wider">
                {faq.category || 'e-commerce'}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200 font-bold">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                {isAr ? 'إجابة موثقة للذكاء الاصطناعي (GEO / AEO)' : isEn ? 'AEO / GEO Verified Answer' : 'AEO / GEO Doğrulanmış Yanıt'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight text-slate-900">
              {faq.question}
            </h1>

            {/* GEO Direct Answer Box (Google Featured Snippet & AI Answer) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2">
              <div className="flex items-center gap-2 text-teal-800 text-xs font-black uppercase tracking-wider">
                <Zap className="w-4 h-4 text-teal-600" />
                {isAr ? 'الإجابة المباشرة (Direct AI & Snippet Answer)' : isEn ? 'Direct AI & Snippet Answer' : 'Öne Çıkan Doğrudan Yanıt (Direct AI & Snippet Answer)'}
              </div>
              <p className="text-slate-800 text-base sm:text-lg font-medium leading-relaxed">
                {faq.short_answer}
              </p>
            </div>

            {/* Detailed Answer HTML Content */}
            <div 
              className="prose max-w-none text-slate-700 text-base leading-relaxed space-y-4 pt-4 border-t border-slate-100 prose-headings:text-slate-900 prose-headings:font-bold prose-strong:text-slate-900 prose-a:text-teal-600"
              dangerouslySetInnerHTML={{ __html: faq.content }}
            />

            {/* Who is this for Section */}
            {faq.who_is_this_for && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <UserCheck className="w-4 h-4 text-teal-600" />
                  {isAr ? 'لمن هذا الدليل والحل؟' : isEn ? 'Who is this solution for?' : 'Bu Rehber ve Çözüm Kimler İçin?'}
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                  {faq.who_is_this_for}
                </p>
              </div>
            )}

            {/* E-E-A-T Author Box */}
            <AuthorBox />

            {/* CTA Box */}
            {faq.cta_text && (
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                <div className="text-start space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    {isAr ? 'هل تحتاج إلى استشارة خاصة لمتجرك؟' : isEn ? 'Need a Custom Architecture or Integration?' : 'Özel Bir Entegrasyona mı İhtiyacınız Var?'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {isAr
                      ? 'يمكنني تصميم خطة مخصصة لمتجرك على شوبيفاي أو إيكاس لتحسين الأداء والمبيعات.'
                      : isEn
                      ? 'Get a tailored e-commerce, CRO, and API automation blueprint for your brand.'
                      : 'Projenize özel SEO, e-ticaret ve otomasyon kurgusu hazırlayabilirim.'}
                  </p>
                </div>
                <button
                  onClick={() => navigate(getLocalizedPath(faq.cta_link || '/iletisim', i18n.language))}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
                >
                  {faq.cta_text}
                  <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
          </div>

          {/* Related Q&A Section (Internal Linking for Page Rank Multiplier) */}
          {relatedFaqs.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                {isAr ? 'أسئلة واستشارات ذات صلة' : isEn ? 'Related Questions & Solutions' : 'İlgili Diğer Soru ve Yanıtlar'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedFaqs.map(rel => (
                  <Link
                    key={rel.id || rel.slug}
                    to={getLocalizedPath(`/faq/${rel.slug}`, i18n.language)}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-400 transition-all space-y-2 flex flex-col justify-between group shadow-xs hover:-translate-y-0.5"
                  >
                    <span className="text-[10px] font-mono text-teal-700 font-bold uppercase">{rel.category || 'e-commerce'}</span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2">
                      {rel.question}
                    </h4>
                    <span className="text-xs text-slate-400 inline-flex items-center gap-1 group-hover:text-teal-700 pt-2 font-medium">
                      {isAr ? 'قراءة الإجابة' : isEn ? 'Read Answer' : 'İncele'} <ArrowRight className={`w-3 h-3 ${isAr ? 'rotate-180' : ''}`} />
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
