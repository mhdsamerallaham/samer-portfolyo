import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search,
  Sparkles,
  RefreshCw,
  Sliders,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  FileText,
  Link2,
  GitPullRequest,
  Database,
  Cpu,
  Zap,
  RotateCcw,
  Play,
  Calendar,
  Layers,
  Settings,
  Server,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import SeoDiffModal from '../../components/admin/SeoDiffModal';

export default function SeoDashboard() {
  const [activeTab, setActiveTab] = useState('genel-bakis');
  const [dashboardData, setDashboardData] = useState(null);
  const [aiBudgetData, setAiBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiBudgetLoading, setAiBudgetLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('today'); // 'today' | 'this_week' | 'this_month'
  const [actionFeedback, setActionFeedback] = useState(null);
  const [selectedDiff, setSelectedDiff] = useState(null);
  const [optimizingSlug, setOptimizingSlug] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [revertingId, setRevertingId] = useState(null);

  // Bütçe ayarları form state
  const [settingsForm, setSettingsForm] = useState({
    safetyMarginPercent: 80,
    maxTasksPerDay: 20,
    maxTokensPerDay: 150000,
    maxNewArticlesPerDay: 2,
    maxOptimizationsPerDay: 6,
    isAiEnabled: true,
  });

  // 1. Dashboard Genel Verilerini Çek
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/seo/dashboard-data?demo=true');
      const json = await res.json();
      if (json.success) {
        setDashboardData(json);
      }
    } catch (err) {
      console.error('[SeoDashboard] Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. AI Bütçe ve Kota Verilerini Çek
  const fetchAiBudgetData = useCallback(async () => {
    try {
      setAiBudgetLoading(true);
      const res = await fetch('/api/seo/ai-budget');
      const json = await res.json();
      if (json.success && json.data) {
        setAiBudgetData(json.data);
        if (json.data.settings) {
          setSettingsForm({
            safetyMarginPercent: json.data.settings.safetyMarginPercent ?? 80,
            maxTasksPerDay: json.data.settings.maxTasksPerDay ?? 20,
            maxTokensPerDay: json.data.settings.maxTokensPerDay ?? 150000,
            maxNewArticlesPerDay: json.data.settings.maxNewArticlesPerDay ?? 2,
            maxOptimizationsPerDay: json.data.settings.maxOptimizationsPerDay ?? 6,
            isAiEnabled: json.data.settings.isAiEnabled ?? true,
          });
        }
      }
    } catch (err) {
      console.error('[SeoDashboard] AI Budget fetch error:', err);
    } finally {
      setAiBudgetLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchAiBudgetData();
  }, [fetchDashboardData, fetchAiBudgetData]);

  // Ayarları Kaydet
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setActionFeedback(null);
    try {
      const res = await fetch('/api/seo/ai-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_settings',
          settings: settingsForm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionFeedback({ type: 'success', message: 'AI Bütçe ve Güvenlik Ayarları başarıyla güncellendi.' });
        fetchAiBudgetData();
      } else {
        throw new Error(data.error || 'Ayarlar kaydedilemedi.');
      }
    } catch (err) {
      setActionFeedback({ type: 'error', message: err.message });
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Sağlayıcı Denetimi Çalıştır (Audit Rerun)
  const handleRunAudit = async () => {
    setIsAuditing(true);
    setActionFeedback(null);
    try {
      const res = await fetch('/api/seo/ai-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run_audit' }),
      });
      const data = await res.json();
      if (data.success) {
        setActionFeedback({
          type: 'success',
          message: `Canlı Sağlayıcı Denetimi Tamamlandı: ${data.auditResults?.length || 0} sağlayıcı test edildi.`,
        });
        fetchAiBudgetData();
      } else {
        throw new Error(data.error || 'Denetim başarısız.');
      }
    } catch (err) {
      setActionFeedback({ type: 'error', message: err.message });
    } finally {
      setIsAuditing(false);
    }
  };

  // Kuyruğu Şimdi Tetikle (Process Queue Batch)
  const handleProcessQueue = async () => {
    setIsProcessingQueue(true);
    setActionFeedback(null);
    try {
      const res = await fetch('/api/seo/ai-queue-process');
      const data = await res.json();
      if (data.success) {
        setActionFeedback({
          type: 'success',
          message: `Kuyruk işlendi: ${data.processedCount} görev tamamlandı / değerlendirildi.`,
        });
        fetchAiBudgetData();
      } else {
        throw new Error(data.message || data.error || 'Kuyruk işlenemedi.');
      }
    } catch (err) {
      setActionFeedback({ type: 'error', message: err.message });
    } finally {
      setIsProcessingQueue(false);
    }
  };

  // Blog Optimizasyon Diff'i Oluştur ve Modalı Aç
  const handleOpenOptimization = async (opportunity) => {
    const targetSlug = opportunity.target_page
      ? opportunity.target_page.replace(/^\/blog\//, '').replace(/^\//, '')
      : null;

    if (!targetSlug) {
      setActionFeedback({ type: 'error', message: 'Bu fırsat için geçerli bir blog URL bulunamadı.' });
      return;
    }

    setOptimizingSlug(targetSlug);
    setActionFeedback(null);

    try {
      const res = await fetch('/api/seo/optimize-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_slug: targetSlug,
          target_query: opportunity.target_query,
          position: opportunity.current_position,
          impressions: opportunity.impressions,
          ctr: opportunity.ctr,
          clicks: opportunity.clicks,
        }),
      });

      const data = await res.json();
      if (data.success && data.diff) {
        setSelectedDiff(data.diff);
      } else {
        throw new Error(data.error || 'Optimizasyon analizi oluşturulamadı.');
      }
    } catch (err) {
      setActionFeedback({ type: 'error', message: err.message });
    } finally {
      setOptimizingSlug(null);
    }
  };

  // Değişikliği Geri Al (1-Click Revert)
  const handleRevertChange = async (changeId) => {
    if (!window.confirm('Bu optimizasyon değişikliğini geri almak ve orijinal içeriğe dönmek istediğinize emin misiniz?')) {
      return;
    }

    setRevertingId(changeId);
    setActionFeedback(null);

    try {
      const res = await fetch('/api/seo/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'revert',
          change_id: changeId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionFeedback({ type: 'success', message: 'Değişiklik başarıyla geri alındı (Reverted).' });
        fetchDashboardData();
      } else {
        throw new Error(data.error || 'Geri alma işlemi başarısız.');
      }
    } catch (err) {
      setActionFeedback({ type: 'error', message: err.message });
    } finally {
      setRevertingId(null);
    }
  };

  const overview = dashboardData?.overview || {};
  const providers = aiBudgetData?.providers || [];
  const queueStats = aiBudgetData?.queueStats || { pending: 0, processing: 0, completed: 0, deferred: 0, failed: 0 };
  const usageHistory = aiBudgetData?.usageHistory || {};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      {/* ── ÜST BAR & BAŞLIK ────────────────────────────────────────────── */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/20">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">AutoSEO & AI Budget Manager</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase tracking-widest">
                  Enterprise v3.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Samer.life Otonom Arama Motoru Optimizasyonu ve Çoklu-Sağlayıcı AI Kota Kontrol Paneli
              </p>
            </div>
          </div>

          {/* Durum Rozetleri ve Hızlı Aksiyonlar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Assisted Mode</span>
              <span className="text-slate-500 text-[10px]">(Onay Korumalı)</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
              <Shield size={13} className="text-teal-400" />
              <span className="text-slate-300 font-medium">%80 Safe Limit</span>
            </div>

            <button
              onClick={() => {
                fetchDashboardData();
                fetchAiBudgetData();
              }}
              disabled={loading || aiBudgetLoading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors disabled:opacity-50"
              title="Yenile"
            >
              <RefreshCw size={15} className={loading || aiBudgetLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* ── SEKME MENÜSÜ (7 SEKME) ────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-2">
            {[
              { id: 'genel-bakis', label: 'Genel Bakış', icon: Activity },
              {
                id: 'firsatlar',
                label: 'Anahtar Kelime Fırsatları',
                icon: TrendingUp,
                badge: dashboardData?.opportunities?.length,
              },
              {
                id: 'kanibalizasyon',
                label: 'Kanibalizasyon',
                icon: AlertTriangle,
                badge: dashboardData?.cannibalizations?.length,
              },
              { id: 'ic-linkler', label: 'İç Linkler', icon: Link2, badge: dashboardData?.internal_links?.length },
              {
                id: 'degisiklikler',
                label: 'Değişiklik Günlüğü & Revert',
                icon: GitPullRequest,
                badge: dashboardData?.recent_changes?.length,
              },
              { id: 'teknik-seo', label: 'Teknik SEO Denetimi', icon: Server },
              {
                id: 'ai-budget',
                label: 'AI Bütçesi & Kullanım',
                icon: Cpu,
                highlight: true,
                badge: queueStats.pending ? `${queueStats.pending} bekliyor` : null,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? tab.highlight
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md shadow-teal-500/20'
                        : 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                      : tab.highlight
                      ? 'text-teal-400 hover:bg-slate-900 border border-teal-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge !== null && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        isActive
                          ? tab.highlight
                            ? 'bg-slate-950/20 text-slate-950'
                            : 'bg-teal-500/20 text-teal-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── BİLDİRİM BANNER'I ─────────────────────────────────────────── */}
      {actionFeedback && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-medium animate-fade-in ${
              actionFeedback.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                : 'bg-rose-950/60 border-rose-800 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{actionFeedback.message}</span>
            </div>
            <button
              onClick={() => setActionFeedback(null)}
              className="text-slate-400 hover:text-white text-xs underline ml-4"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* ── ANA İÇERİK ALANI ─────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ============================================================== */}
        {/* SEKME 1: GENEL BAKIŞ                                           */}
        {/* ============================================================== */}
        {activeTab === 'genel-bakis' && (
          <div className="space-y-6">
            {/* KPI Kartları Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                {
                  label: 'Toplam Tıklama',
                  val: (overview.total_clicks || 0).toLocaleString(),
                  sub: 'GSC Organik',
                  icon: TrendingUp,
                  color: 'text-teal-400',
                },
                {
                  label: 'Toplam Gösterim',
                  val: (overview.total_impressions || 0).toLocaleString(),
                  sub: 'Son 28 gün',
                  icon: Search,
                  color: 'text-emerald-400',
                },
                {
                  label: 'Ortalama Sıra',
                  val: overview.average_position || '12.4',
                  sub: 'Anahtar kelimeler',
                  icon: Sliders,
                  color: 'text-cyan-400',
                },
                {
                  label: 'Ortalama CTR',
                  val: overview.average_ctr || '1.8%',
                  sub: 'Tıklama oranı',
                  icon: Activity,
                  color: 'text-amber-400',
                },
                {
                  label: 'Aktif Fırsatlar',
                  val: overview.active_opportunities || 0,
                  sub: `${overview.critical_opportunities || 0} Kritik P0`,
                  icon: Sparkles,
                  color: 'text-purple-400',
                },
                {
                  label: 'SEO Sağlık Skoru',
                  val: `${overview.seo_health_score || 94}/100`,
                  sub: 'Teknik denetim',
                  icon: Shield,
                  color: 'text-teal-300',
                },
              ].map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-[11px] font-medium uppercase tracking-wider">{kpi.label}</span>
                      <Icon size={14} className={kpi.color} />
                    </div>
                    <div className="text-xl font-black text-white tracking-tight">{kpi.val}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{kpi.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* Hızlı Eylemler & En Yüksek Fırsatlar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sol: Öncelikli P0/P1 Fırsatlar */}
              <div className="lg:col-span-2 rounded-3xl bg-slate-900/60 border border-slate-800/80 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Sparkles size={16} className="text-teal-400" />
                      Öncelikli Büyüme Fırsatları (P0 & P1)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pozisyon 4-10 ve düşük CTR'a sahip blog sayfaları için tek tıkla optimizasyon
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('firsatlar')}
                    className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
                  >
                    Tümünü Gör <ChevronRight size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {(dashboardData?.opportunities || []).slice(0, 4).map((opp, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-slate-700 transition-all"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                              opp.priority === 'critical'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                            }`}
                          >
                            {opp.priority === 'critical' ? 'P0 Kritik' : 'P1 Yüksek'}
                          </span>
                          <span className="text-xs font-bold text-white truncate">{opp.target_query}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          Hedef: <span className="text-slate-300">{opp.target_page}</span> • Pozisyon:{' '}
                          <span className="text-teal-300 font-mono font-bold">{opp.current_position}</span> • Gösterim:{' '}
                          <span className="font-mono text-slate-300">{(opp.impressions || 0).toLocaleString()}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleOpenOptimization(opp)}
                        disabled={optimizingSlug !== null}
                        className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shadow-md shadow-teal-500/10"
                      >
                        <Sparkles size={12} />
                        <span>İncele & Optimize Et</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sağ: Sistem ve Güvenlik Durumu */}
              <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Shield size={16} className="text-teal-400" />
                  Sistem Güvenlik Garantileri
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white">Sıfır Doğrudan Yayın (Zero Direct Publish)</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        AI çıktıları asla doğrulanmadan DB'ye yazılmaz; önce Before/After diff paketine dönüştürülür.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white">1-Click Geri Alma (Revert Snapshot)</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Her uygulanan değişiklik öncesi tam içerik snapshot'ı alınır ve tek tıkla geri alınabilir.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white">%80 Güvenli Kapasite Tavanı</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Sağlayıcı limitlerinin %80'ine ulaşıldığında görevler ertesi güne ertelenir (DEFERRED).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('ai-budget')}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-bold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Cpu size={14} />
                    <span>AI Bütçe ve Sayaç Paneline Git</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SEKME 2: ANAHTAR KELİME FIRSATLARI                             */}
        {/* ============================================================== */}
        {activeTab === 'firsatlar' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-3xl bg-slate-900/60 border border-slate-800">
              <div>
                <h2 className="text-sm font-black text-white">Google Search Console Büyüme Fırsatları</h2>
                <p className="text-xs text-slate-400">
                  Pozisyon 4-10 (P0) ve Düşük CTR (P1) fırsatları otomatik olarak tespit edildi.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Toplam Fırsat:</span>
                <span className="px-2 py-0.5 rounded-lg bg-teal-500/10 text-teal-400 text-xs font-bold font-mono">
                  {dashboardData?.opportunities?.length || 0}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(dashboardData?.opportunities || []).map((opp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          opp.priority === 'critical'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : opp.priority === 'high'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        }`}
                      >
                        {opp.priority === 'critical' ? 'P0 Kritik' : opp.priority === 'high' ? 'P1 Yüksek' : 'P2 Normal'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Skor: {opp.opportunity_score}/100</span>
                    </div>

                    <h3 className="text-sm font-black text-white tracking-tight">{opp.target_query}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{opp.reason}</p>

                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Sıra</span>
                        <span className="font-bold text-teal-300 font-mono">{opp.current_position}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Gösterim</span>
                        <span className="font-bold text-slate-200 font-mono">
                          {(opp.impressions || 0).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">CTR</span>
                        <span className="font-bold text-amber-300 font-mono">
                          {typeof opp.ctr === 'number' ? `${(opp.ctr * 100).toFixed(1)}%` : opp.ctr}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Tıklama</span>
                        <span className="font-bold text-slate-200 font-mono">{opp.clicks || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <span className="text-[11px] text-slate-500 truncate max-w-[200px]">{opp.target_page}</span>
                    <button
                      onClick={() => handleOpenOptimization(opp)}
                      disabled={optimizingSlug !== null}
                      className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-colors shadow-md shadow-teal-500/10"
                    >
                      <Sparkles size={12} />
                      <span>{optimizingSlug === opp.target_page ? 'Analiz Yapılıyor...' : 'İncele & Optimize Et'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SEKME 3: KANİBALİZASYON ANALİZİ                                */}
        {/* ============================================================== */}
        {activeTab === 'kanibalizasyon' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800">
              <h2 className="text-sm font-black text-white">Anahtar Kelime Kanibalizasyon Tespiti</h2>
              <p className="text-xs text-slate-400 mt-1">
                Aynı sorgu için arama motorlarında birbiriyle yarışan ve gösterimleri bölen blog sayfaları.
              </p>
            </div>

            <div className="space-y-3">
              {(dashboardData?.cannibalizations || []).length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs bg-slate-900/40 rounded-3xl border border-slate-800">
                  Harika! Şu anda tespit edilen kritik bir kanibalizasyon bulunmuyor.
                </div>
              ) : (
                dashboardData.cannibalizations.map((can, i) => (
                  <div key={i} className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-amber-400" />
                        <h3 className="text-sm font-black text-white">{can.query}</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {can.competing_pages?.length || 2} Yarışan Sayfa
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">{can.recommendation}</p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      {(can.competing_pages || []).map((page, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/60 border border-slate-800/40"
                        >
                          <span className="text-slate-300 font-mono text-[11px] truncate">{page.page}</span>
                          <span className="text-slate-400 text-[10px]">
                            Pozisyon: <strong className="text-teal-400">{page.position}</strong> • Gösterim:{' '}
                            {page.impressions}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SEKME 4: İÇ LİNKLEME ÖNERİLERİ                                 */}
        {/* ============================================================== */}
        {activeTab === 'ic-linkler' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800">
              <h2 className="text-sm font-black text-white">Anlamsal İç Linkleme Grafiği</h2>
              <p className="text-xs text-slate-400 mt-1">
                Yetki (PageRank) akışını güçlendirmek için metin içinde doğal olarak eklenebilecek iç link önerileri.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(dashboardData?.internal_links || []).map((link, idx) => (
                <div key={idx} className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                      <Link2 size={13} />
                      {link.anchor_text}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Uygunluk: %{Math.round((link.relevance_score || 1) * 100)}</span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-slate-400 text-[11px]">
                      Kaynak: <span className="text-slate-300 font-mono">{link.source_slug || link.source_url}</span>
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Hedef: <span className="text-teal-300 font-mono font-bold">{link.target_url}</span>
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/40">
                    "{link.context_sentence || link.reason}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SEKME 5: DEĞİŞİKLİK GÜNLÜĞÜ VE GERİ ALMA (1-CLICK REVERT)       */}
        {/* ============================================================== */}
        {activeTab === 'degisiklikler' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-white">Uygulanan Değişiklikler ve Güvenli Geri Alma</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Assisted mode ile uygulanan her içerik paketi orijinal yedeğiyle (snapshot) saklanır.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {(dashboardData?.recent_changes || []).length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs bg-slate-900/40 rounded-3xl border border-slate-800">
                  Henüz kaydedilmiş bir değişiklik kaydı bulunmuyor.
                </div>
              ) : (
                dashboardData.recent_changes.map((ch, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            ch.status === 'applied'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-700/40 text-slate-400'
                          }`}
                        >
                          {ch.status === 'applied' ? 'Yayında' : 'Geri Alındı'}
                        </span>
                        <span className="font-bold text-white">{ch.page_url}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{ch.change_reason}</p>
                      <p className="text-slate-500 text-[10px]">
                        Tarih: {new Date(ch.created_at || ch.applied_at).toLocaleString('tr-TR')} • Onaylayan:{' '}
                        {ch.applied_by}
                      </p>
                    </div>

                    {ch.status === 'applied' && (
                      <button
                        onClick={() => handleRevertChange(ch.id)}
                        disabled={revertingId === ch.id}
                        className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <RotateCcw size={13} className={revertingId === ch.id ? 'animate-spin' : ''} />
                        <span>1-Click Geri Al (Revert)</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SEKME 6: TEKNİK SEO DENETİMİ                                   */}
        {/* ============================================================== */}
        {activeTab === 'teknik-seo' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800">
              <h2 className="text-sm font-black text-white">Teknik SEO & Taramalı Sağlık Raporu</h2>
              <p className="text-xs text-slate-400 mt-1">
                Sayfa içi SEO, meta etiketler, Core Web Vitals, canonical ve robots standartları denetimi.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Taranan Sayfalar', val: dashboardData?.technical_seo?.total_pages || 11 },
                { label: 'Sağlıklı Sayfalar', val: dashboardData?.technical_seo?.healthy_pages || 9 },
                { label: 'Uyarı Alanlar', val: dashboardData?.technical_seo?.pages_with_warnings || 2 },
                { label: 'Kritik Hatalar', val: dashboardData?.technical_seo?.pages_with_errors || 0 },
              ].map((s, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">{s.label}</span>
                  <span className="text-2xl font-black text-white mt-1 block">{s.val}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Taranan Çekirdek Sayfalar</h3>
              <div className="space-y-2">
                {(dashboardData?.technical_seo?.audited_urls || []).map((r, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{r.title || r.url}</span>
                      <span className="text-slate-500 text-[10px] font-mono">{r.url}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-teal-500/10 text-teal-400 font-bold font-mono">
                      {r.score}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SEKME 7: AI BÜTÇESİ & KULLANIM YÖNETİCİSİ                       */}
        {/* ============================================================== */}
        {activeTab === 'ai-budget' && (
          <div className="space-y-6 animate-fade-in">
            {/* Üst İstatistik Sayaçları Barı */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Bugün İstekler</span>
                  <Activity size={14} className="text-teal-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {usageHistory?.today?.requests || 0}{' '}
                  <span className="text-xs text-slate-500 font-normal">/ {settingsForm.maxTasksPerDay} tavan</span>
                </div>
                <div className="text-[10px] text-teal-400 mt-1 font-bold">Güvenli Kota Altında</div>
              </div>

              <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Bugün Token</span>
                  <Zap size={14} className="text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {(usageHistory?.today?.tokens || 0).toLocaleString()}{' '}
                  <span className="text-xs text-slate-500 font-normal">
                    / {settingsForm.maxTokensPerDay.toLocaleString()}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  Kalan: {Math.max(0, settingsForm.maxTokensPerDay - (usageHistory?.today?.tokens || 0)).toLocaleString()} token
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Güvenlik Payı</span>
                  <Shield size={14} className="text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400">%{settingsForm.safetyMarginPercent}</div>
                <div className="text-[10px] text-slate-400 mt-1">Kapasite dolunca ertesi güne devreder</div>
              </div>

              <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Kuyruk Durumu</span>
                  <Layers size={14} className="text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {queueStats.pending || 0}{' '}
                  <span className="text-xs text-slate-500 font-normal">bekleyen / {queueStats.deferred || 0} ertelenen</span>
                </div>
                <div className="text-[10px] text-cyan-400 mt-1 font-bold">P0 & P1 Öncelikli Sıralama</div>
              </div>
            </div>

            {/* Hızlı Aksiyon & Filtre Butonları */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Zaman Filtresi:</span>
                {['today', 'this_week', 'this_month'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeRange(t)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      timeRange === t
                        ? 'bg-teal-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t === 'today' ? 'Bugün' : t === 'this_week' ? 'Bu Hafta' : 'Bu Ay'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunAudit}
                  disabled={isAuditing}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={13} className={isAuditing ? 'animate-spin' : ''} />
                  <span>{isAuditing ? 'Denetleniyor...' : 'Canlı Sağlayıcı Denetimi (Run Audit)'}</span>
                </button>

                <button
                  onClick={handleProcessQueue}
                  disabled={isProcessingQueue}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-md shadow-teal-500/10"
                >
                  <Play size={13} />
                  <span>{isProcessingQueue ? 'İşleniyor...' : 'Kuyruğu Şimdi Çalıştır'}</span>
                </button>
              </div>
            </div>

            {/* 6 AI Sağlayıcı Sağlık ve Discovery Kartları Grid */}
            <div>
              <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                <Server size={16} className="text-teal-400" />
                AI Sağlayıcı Sağlık, Model ve Header Durumları (6 Sağlayıcı)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {providers.map((prov) => {
                  const isHealthy = prov.health === 'HEALTHY';
                  const isBlocked = prov.statusBadge === 'BLOCKED' || prov.inCooldown;
                  const isPaused = prov.statusBadge === 'PAUSED';

                  return (
                    <div
                      key={prov.providerKey}
                      className={`p-4 rounded-3xl border transition-all ${
                        isPaused
                          ? 'bg-slate-900/40 border-slate-800 opacity-75'
                          : isBlocked
                          ? 'bg-rose-950/20 border-rose-900/40'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              isPaused
                                ? 'bg-amber-500'
                                : isBlocked
                                ? 'bg-rose-500 animate-ping'
                                : 'bg-emerald-400'
                            }`}
                          />
                          <h4 className="text-sm font-black text-white">{prov.displayName}</h4>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isPaused
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : isBlocked
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : prov.statusBadge === 'WARNING'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {prov.statusBadge || prov.health}
                        </span>
                      </div>

                      <div className="text-xs space-y-1 mb-3">
                        <p className="text-slate-400 text-[11px]">
                          Model: <span className="text-slate-200 font-mono font-medium">{prov.model}</span>
                        </p>
                        <p className="text-slate-500 text-[10px]">
                          Karakteristik:{' '}
                          {prov.providerKey === 'groq'
                            ? 'LPU Ultra Hız (x-ratelimit-* aktif)'
                            : prov.providerKey === 'mistral'
                            ? 'Çok Dilli (Dakikalık token başlığı aktif)'
                            : prov.providerKey === 'openrouter'
                            ? '/auth/key Günlük 50 İstek Takibi'
                            : prov.providerKey === 'gemini'
                            ? 'Konservatif DB Ledger Modu (10 RPM / 250 RPD)'
                            : '402 Kredi Yetersizliği (Otomatik Paused)'}
                        </p>
                      </div>

                      {/* Kota Çubuğu */}
                      <div className="space-y-1 pt-2 border-t border-slate-800/80">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-400">Doluluk Oranı</span>
                          <span className={prov.usagePercent >= 75 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                            %{prov.usagePercent || 0}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              prov.usagePercent >= 80
                                ? 'bg-rose-500'
                                : prov.usagePercent >= 60
                                ? 'bg-amber-400'
                                : 'bg-teal-400'
                            }`}
                            style={{ width: `${Math.min(100, prov.usagePercent || 0)}%` }}
                          />
                        </div>
                      </div>

                      {/* Detay Metrikler */}
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono">
                        <div>
                          <span className="text-slate-500 block">Kalan Güvenli RPM</span>
                          <span className="text-slate-200 font-bold">
                            {prov.safeRpmCapacity} / {prov.rpmLimit}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Kalan Güvenli RPD</span>
                          <span className="text-slate-200 font-bold">
                            {prov.safeRpdCapacity} / {prov.rpdLimit}
                          </span>
                        </div>
                      </div>

                      {prov.inCooldown && (
                        <div className="mt-2 p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-300 text-center font-bold">
                          Cooldown Devrede: {prov.cooldownRemainingSeconds}s kaldı
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detaylı Kota ve Limit Takip Tablosu */}
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Sliders size={16} className="text-teal-400" />
                Gerçek Zamanlı AI Kota, TPM, RPD ve Güvenli Kapasite Tablosu
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                      <th className="py-2.5 px-3">Sağlayıcı</th>
                      <th className="py-2.5 px-3">Model</th>
                      <th className="py-2.5 px-3">Sağlık</th>
                      <th className="py-2.5 px-3">Bugün İstek</th>
                      <th className="py-2.5 px-3">Bugün Token</th>
                      <th className="py-2.5 px-3">Güvenli RPM</th>
                      <th className="py-2.5 px-3">Güvenli TPM</th>
                      <th className="py-2.5 px-3">Güvenli RPD</th>
                      <th className="py-2.5 px-3">Güvenli TPD</th>
                      <th className="py-2.5 px-3">Doluluk</th>
                      <th className="py-2.5 px-3">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {providers.map((p) => (
                      <tr key={p.providerKey} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-2.5 px-3 font-sans font-bold text-white flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.statusBadge === 'SAFE'
                                ? 'bg-emerald-400'
                                : p.statusBadge === 'WARNING'
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                          />
                          {p.displayName}
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-300">{p.model}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              p.health === 'HEALTHY'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : p.health === 'INSUFFICIENT_CREDITS'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {p.health}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">{p.requestsToday || 0}</td>
                        <td className="py-2.5 px-3 text-slate-300">{(p.tokensToday || 0).toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-teal-300 font-bold">{p.safeRpmCapacity}</td>
                        <td className="py-2.5 px-3 text-teal-300 font-bold">{p.safeTpmCapacity?.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-teal-300 font-bold">{p.safeRpdCapacity}</td>
                        <td className="py-2.5 px-3 text-teal-300 font-bold">{p.safeTpdCapacity?.toLocaleString()}</td>
                        <td className="py-2.5 px-3">
                          <span className={p.usagePercent >= 75 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                            %{p.usagePercent}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.statusBadge === 'SAFE'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : p.statusBadge === 'PAUSED'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {p.statusBadge}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bütçe ve Güvenlik Ayarları Formu */}
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Settings size={16} className="text-teal-400" />
                    AI Güvenlik ve Tavan Bütçe Ayarları
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Bu ayarlar küresel güvenlik tavanını belirler; sağlayıcının gerçek güvenli kapasitesini asla aşamaz.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Güvenlik Eşiği Payı (% Safe Margin)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="95"
                      value={settingsForm.safetyMarginPercent}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, safetyMarginPercent: parseInt(e.target.value, 10) })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-teal-500 focus:outline-none font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Önerilen: %80 (Kalan %20'de kilitlenir)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Günlük Maksimum AI Görevi</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={settingsForm.maxTasksPerDay}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, maxTasksPerDay: parseInt(e.target.value, 10) })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-teal-500 focus:outline-none font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Örnek: 20 görev / gün</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Günlük Maksimum Token Tavanı</label>
                    <input
                      type="number"
                      min="10000"
                      max="1000000"
                      step="5000"
                      value={settingsForm.maxTokensPerDay}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, maxTokensPerDay: parseInt(e.target.value, 10) })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-teal-500 focus:outline-none font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Örnek: 150,000 token / gün</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Günlük Yeni Makale Limiti</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={settingsForm.maxNewArticlesPerDay}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, maxNewArticlesPerDay: parseInt(e.target.value, 10) })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-teal-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Günlük Makale İyileştirme Limiti
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={settingsForm.maxOptimizationsPerDay}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, maxOptimizationsPerDay: parseInt(e.target.value, 10) })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-teal-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsForm.isAiEnabled}
                        onChange={(e) => setSettingsForm({ ...settingsForm, isAiEnabled: e.target.checked })}
                        className="w-4 h-4 rounded text-teal-500 focus:ring-teal-500"
                      />
                      <span>AI Motoru Aktif (Açık/Kapalı)</span>
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black flex items-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-teal-500/20"
                  >
                    <Check size={14} />
                    <span>{isSavingSettings ? 'Kaydediliyor...' : 'Bütçe Ayarlarını Kaydet'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ── SEO DIFF MODALI (ASSISTED APPROVAL MODAL) ──────────────────── */}
      {selectedDiff && (
        <SeoDiffModal
          isOpen={Boolean(selectedDiff)}
          onClose={() => setSelectedDiff(null)}
          diffData={selectedDiff}
          onApplySuccess={() => {
            setActionFeedback({
              type: 'success',
              message: 'Optimizasyon paketi başarıyla onaylandı ve blog güncellendi!',
            });
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
}