import React, { useState } from 'react';
import { X, Check, ArrowRight, AlertCircle, Sparkles, RefreshCw, Undo2, ExternalLink } from 'lucide-react';

export default function SeoDiffModal({ isOpen, onClose, diffData, onApplySuccess }) {
  const [isApplying, setIsApplying] = useState(false);
  const [applyResult, setApplyResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen || !diffData) return null;

  const { before, after, diff_elements, metrics, post_id, post_slug, target_query } = diffData;

  const handleApproveAndApply = async () => {
    setIsApplying(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/seo/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'apply',
          post_id,
          post_slug,
          diff_data: diffData,
          applied_by: 'admin_dashboard_user',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Uygulama sırasında hata oluştu.');
      }

      setApplyResult(data);
      if (onApplySuccess) onApplySuccess(data);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sparkles size={12} className="text-teal-600" />
              <span>Assisted Mode — Ön İnceleme & Onay</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Mevcut Blog İçerik Optimizasyonu: <span className="text-teal-600 font-extrabold">{target_query}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
          {/* Performance Summary Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-teal-50/60 border border-teal-100 rounded-2xl">
            <div>
              <span className="text-[11px] text-teal-800 font-bold uppercase mono">Mevcut Sıralama</span>
              <p className="text-lg font-black text-slate-900">Pozisyon {metrics?.position || 12}</p>
            </div>
            <div>
              <span className="text-[11px] text-teal-800 font-bold uppercase mono">Aylık Gösterim</span>
              <p className="text-lg font-black text-slate-900">{(metrics?.impressions || 0).toLocaleString()} impr</p>
            </div>
            <div>
              <span className="text-[11px] text-teal-800 font-bold uppercase mono">Tıklama Oranı (CTR)</span>
              <p className="text-lg font-black text-slate-900">{metrics?.ctr || '1.4%'}</p>
            </div>
            <div>
              <span className="text-[11px] text-teal-800 font-bold uppercase mono">Hedef Sayfa</span>
              <p className="text-xs font-bold text-teal-700 truncate mt-1">/blog/{post_slug}</p>
            </div>
          </div>

          {applyResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-900">
              <div className="flex items-center gap-3">
                <Check size={20} className="text-emerald-600" />
                <div>
                  <h4 className="font-bold">Optimizasyon Başarıyla Yayına Alındı!</h4>
                  <p className="text-xs text-emerald-700">Canlı makale güncellendi ve geri alma yedeği oluşturuldu.</p>
                </div>
              </div>
              <a
                href={`/blog/${post_slug}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-emerald-700"
              >
                Sayfayı Gör <ExternalLink size={12} />
              </a>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. TITLE COMPARISON (BEFORE vs AFTER) */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-xs">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3">1. SEO Meta Title Değişimi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl">
                <span className="text-[10px] font-black uppercase text-rose-700 mono">Eski Title (Before)</span>
                <p className="text-xs font-medium text-slate-800 mt-1 line-through opacity-80">{before?.title}</p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] font-black uppercase text-emerald-700 mono">Önerilen Title (After — High CTR)</span>
                <p className="text-xs font-bold text-slate-900 mt-1">{after?.title}</p>
              </div>
            </div>
          </div>

          {/* 2. H1 & META DESCRIPTION */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-xs">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3">2. Meta Açıklama & H1 Başlık</h3>
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-bold text-slate-500">Önerilen H1:</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{after?.h1}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Önerilen Meta Description ({after?.meta_description?.length || 0} Karakter):</span>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">{after?.meta_description}</p>
              </div>
            </div>
          </div>

          {/* 3. MISSING SUBTOPICS & KEYWORDS */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-xs">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3">3. Eklenecek Eksik Alt Konular (Subtopics)</h3>
            <div className="space-y-2">
              {(diff_elements?.missing_subtopics || []).map((st, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                    +{i + 1}
                  </span>
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. PROPOSED INTERNAL LINKS */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-xs">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3">4. Eklenecek Doğal İç Linkler (Internal Links)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(diff_elements?.proposed_internal_links || []).map((l, i) => (
                <div key={i} className="p-3 bg-teal-50/40 border border-teal-200 rounded-xl">
                  <span className="text-[10px] font-black uppercase text-teal-700 mono">Hedef: {l.target_url}</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">"{l.anchor_text}"</p>
                  <p className="text-[11px] text-slate-500 mt-1">{l.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. ADDED FAQ SECTION */}
          {diff_elements?.proposed_faqs?.length > 0 && (
            <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-xs">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3">5. Eklenecek SSS (FAQ / Schema) Bölümü</h3>
              <div className="space-y-3">
                {diff_elements.proposed_faqs.map((faq, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <h5 className="font-bold text-xs text-teal-900 mb-1">{faq.q}</h5>
                    <p className="text-xs text-slate-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/80">
          <p className="text-xs text-slate-500 hidden sm:block">
            Onaylandığında eski içerik yedeği alınır ve tek tıkla geri alınabilir.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              disabled={isApplying}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Vazgeç
            </button>
            {!applyResult ? (
              <button
                onClick={handleApproveAndApply}
                disabled={isApplying}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isApplying ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Uygulanıyor...
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    Onayla ve Yayına Al (Approve & Apply)
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-black transition-colors"
              >
                Kapat
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
