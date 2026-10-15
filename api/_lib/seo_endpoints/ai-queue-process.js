/**
 * api/_lib/seo_endpoints/ai-queue-process.js — AutoSEO Otonom Görev Kuyruğu İşleyicisi
 *
 * Cron (08:00 UTC) veya Admin tarafından tetiklenir:
 *   1. CronJobLock ile kilit alır (Aynı anda iki çağrıyı engeller).
 *   2. Ertelenen görevlerin tarihini kontrol eder ve kuyruğu canlandırır.
 *   3. Kuyruk boşsa, GSC verilerinden en kritik fırsatları (P0/P1) otomatik keşfeder ve kuyruğa ekler.
 *   4. Otonom SEO optimizasyonu görevlerini AI ile üretir ve ActionManager ile doğrudan canlıya uygular.
 *   5. Her değişiklik için tam BEFORE/AFTER yedeği oluşturur (Panelden 1 tıkla geri alınabilir).
 *   6. Güvenli AI bütçe ve kota limitlerini korur.
 *   7. Kilidi serbest bırakır.
 */

const { createClient } = require("@supabase/supabase-js");
const AiBudgetManager = require("../ai/AiBudgetManager");
const AiTaskQueue = require("../ai/AiTaskQueue");
const AiCache = require("../ai/AiCache");
const AiRouter = require("../ai/AiRouter");
const CronJobLock = require("../ai/CronJobLock");
const OpportunityEngine = require("../seo/OpportunityEngine");
const GscClient = require("../seo/GscClient");
const BlogOptimizer = require("../seo/BlogOptimizer");
const ActionManager = require("../seo/ActionManager");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const budgetManager = new AiBudgetManager(supabase);
const taskQueue = new AiTaskQueue(supabase);
const aiCache = new AiCache(supabase);
const aiRouter = new AiRouter({ budgetManager, taskQueue, aiCache });
const cronLock = new CronJobLock(supabase);

/**
 * GSC verilerinden en kritik arama fırsatlarını tespit edip kuyruğa ekler
 */
async function harvestTopOpportunities(supabaseClient, queue) {
  if (!supabaseClient) return [];

  try {
    // 1. Son Search Console verilerini çek
    let gscRows = [];
    const { data: dbRows } = await supabaseClient
      .from("search_console_data")
      .select("*")
      .order("date", { ascending: false })
      .limit(300);

    if (dbRows && dbRows.length > 0) {
      gscRows = dbRows;
    } else {
      const gscClient = new GscClient();
      if (gscClient.isConfigured()) {
        const liveGsc = await gscClient.querySearchAnalytics();
        if (liveGsc.status === "success") gscRows = liveGsc.rows;
      }
    }

    if (!gscRows || gscRows.length === 0) {
      return [];
    }

    // 2. Yayındaki blog makalelerini çek
    const { data: posts } = await supabaseClient
      .from("blog_posts")
      .select("id, slug, title_tr, content_tr, published_at, seo_title_tr, seo_description_tr")
      .order("published_at", { ascending: false });

    // 3. Fırsat analiz motorunu çalıştır
    const analysis = OpportunityEngine.analyzeOpportunities(gscRows, posts || []);
    if (!analysis.opportunities || analysis.opportunities.length === 0) {
      return [];
    }

    // 4. Son 14 günde zaten optimize edilmiş sorguları tespit et (Mükerrer engelleme)
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const actionManager = new ActionManager();
    const recentChanges = await actionManager.listChanges(50);
    const optimizedQueries = new Set(
      recentChanges
        .filter((c) => c.status === "applied" && new Date(c.applied_at || 0) > new Date(fourteenDaysAgo))
        .map((c) => (c.diff_summary?.target_query || "").trim().toLowerCase())
        .filter(Boolean)
    );

    // 5. Yalnızca kritik, yüksek potansiyelli veya skoru 75+ olanları seç
    const candidates = analysis.opportunities.filter((opp) => {
      const q = (opp.target_query || "").trim().toLowerCase();
      if (!q) return false;
      if (optimizedQueries.has(q)) return false;
      return (
        opp.priority === "critical" ||
        opp.priority === "high" ||
        (opp.opportunity_score || 0) >= 75
      );
    });

    if (candidates.length === 0) {
      return [];
    }

    // 6. En yüksek skorlu ilk 1-2 fırsatı kuyruğa ekle
    const topCandidates = candidates.slice(0, 2);
    const enqueued = [];

    for (const opp of topCandidates) {
      const enqueuedTask = await queue.enqueue({
        taskType: "autonomous_seo_optimization",
        priority: opp.priority === "critical" ? "P0" : "P1",
        articleId: opp.matched_post_slug || null,
        opportunityId: null,
        payload: {
          target_query: opp.target_query,
          target_page: opp.target_page,
          matched_post_slug: opp.matched_post_slug,
          matched_post_title: opp.matched_post_title,
          current_position: opp.current_position,
          impressions: opp.impressions,
          ctr: opp.ctr,
          clicks: opp.clicks,
          opportunity_score: opp.opportunity_score,
          opportunity_type: opp.opportunity_type,
        },
        estimatedTokens: 2000,
      });

      if (enqueuedTask) enqueued.push(enqueuedTask);
    }

    return enqueued;
  } catch (err) {
    console.warn("[QueueWorker] Auto-harvesting non-fatal notice:", err.message);
    return [];
  }
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 1. Kilit Al (Job Locking)
  if (req.query && req.query.force === "true") {
    await cronLock.release("autoseo_queue_lock");
  }

  const lockAcquired = await cronLock.acquire("autoseo_queue_lock", 60);
  if (!lockAcquired) {
    return res.status(429).json({
      success: false,
      message: "İşlem zaten devam ediyor (Kilit meşgul). Lütfen birkaç saniye sonra tekrar deneyin.",
    });
  }

  try {
    // 2. Ertelenmiş görevleri canlandır
    await taskQueue.resumeDeferredTasks();

    // 3. Kuyruk boşsa canlı GSC verilerinden otomatik fırsat hasat et
    const queueStats = await taskQueue.getQueueStats();
    if (queueStats.pending === 0) {
      const harvested = await harvestTopOpportunities(supabase, taskQueue);
      if (harvested.length > 0) {
        console.log(`[QueueWorker] ${harvested.length} adet yeni fırsat kuyruğa eklendi.`);
      }
    }

    const processedTasks = [];
    const maxTasksPerBatch = 3; // Otonom çalışma güvenliği için tek seferde en fazla 3 iş

    for (let i = 0; i < maxTasksPerBatch; i++) {
      const task = await taskQueue.pickNextTask();
      if (!task) {
        break; // Kuyrukta bekleyen görev kalmadı
      }

      // CASE A: Otonom SEO Optimizasyon Görevi
      if (task.task_type === "autonomous_seo_optimization") {
        console.log(`[QueueWorker] 🚀 Otonom SEO Optimizasyonu yürütülüyor: "${task.payload.target_query}"`);

        try {
          let post = null;
          const targetSlug = task.payload.matched_post_slug;

          // 1. Slug ile makaleyi bul
          if (targetSlug && supabase) {
            const { data: bySlug } = await supabase
              .from("blog_posts")
              .select("*")
              .eq("slug", targetSlug)
              .maybeSingle();
            if (bySlug) post = bySlug;
          }

          // 2. Başlık kelimeleriyle eşleşen en alakalı makaleyi bul
          if (!post && supabase && task.payload.target_query) {
            const words = task.payload.target_query.split(" ").filter((w) => w.length >= 4);
            for (const word of words) {
              const { data: fuzzy } = await supabase
                .from("blog_posts")
                .select("*")
                .ilike("title_tr", `%${word}%`)
                .limit(1);
              if (fuzzy && fuzzy.length > 0) {
                post = fuzzy[0];
                break;
              }
            }
          }

          // 3. Makale yoksa ana sayfa veya hedef sayfa temsilini oluştur
          if (!post) {
            const isHome =
              !targetSlug ||
              targetSlug === "ana-sayfa" ||
              targetSlug === "/" ||
              !task.payload.target_page ||
              task.payload.target_page.endsWith("/");

            post = {
              id: isHome ? "page_home" : `page_${targetSlug || "landing"}`,
              slug: targetSlug || "ana-sayfa",
              title_tr: isHome
                ? "E-Ticaret Web Tasarım & Geliştirme Uzmanı | Samer"
                : `${task.payload.target_query} | Samer Allaham`,
              seo_title_tr: isHome
                ? "E-Ticaret Web Tasarım & Kurulum Uzmanı — Samer Allaham"
                : `${task.payload.target_query} — Samer.life`,
              seo_description_tr: isHome
                ? "Shopify & İKAS e-ticaret siteleri, özel yazılım, hız optimizasyonu ve yapay zeka entegrasyonu."
                : `${task.payload.target_query} için profesyonel e-ticaret çözümleri ve rehber.`,
              content_tr: isHome
                ? "E-ticaret web tasarım, özel yazılım geliştirme, Shopify kurulum ve optimizasyon hizmetleri."
                : `${task.payload.target_query} konusunda kapsamlı teknik rehber ve hizmet detayları.`,
            };
          }

          // 4. BlogOptimizer ile AI zenginleştirmeli Diff oluştur
          const optimizer = new BlogOptimizer(supabase);
          const diff = await optimizer.generateOptimizationDiff(post, {
            target_query: task.payload.target_query,
            position: task.payload.current_position,
            impressions: task.payload.impressions,
            ctr: task.payload.ctr,
            clicks: task.payload.clicks,
          });

          // 5. Otonom olarak canlıya uygula (Full Audit & Rollback desteğiyle)
          const actionManager = new ActionManager();
          const applyResult = await actionManager.applyOptimization({
            post_id: post.id,
            post_slug: post.slug,
            diff_data: diff,
            applied_by: "autonomous_cron",
          });

          // 6. Görevi tamamlandı olarak işaretle
          await taskQueue.completeTask(
            task.id,
            applyResult,
            1500,
            "autonomous_engine",
            "ai-optimizer"
          );

          processedTasks.push({
            taskId: task.id,
            type: "autonomous_seo_optimization",
            query: task.payload.target_query,
            target: post.slug,
            ...applyResult,
          });

          console.log(
            `[QueueWorker] ✓ Otonom optimizasyon başarıyla uygulandı: "${task.payload.target_query}" -> ${post.slug}`
          );
        } catch (taskErr) {
          console.error(`[QueueWorker] Otonom görev hatası (ID: ${task.id}):`, taskErr);
          await taskQueue.failOrRetryTask(task.id, taskErr.message);
          processedTasks.push({ taskId: task.id, error: taskErr.message });
        }
      } else {
        // CASE B: Standart AI Görevi (AiRouter ile yürüt)
        console.log(`[QueueWorker] Görev işleniyor: ${task.id} (${task.task_type}, Priority: ${task.priority})`);
        const execResult = await aiRouter.executeTask(task);
        processedTasks.push({ taskId: task.id, ...execResult });

        if (execResult.deferred) {
          console.log("[QueueWorker] Güvenli AI bütçesi doldu. Batch durduruluyor.");
          break;
        }
      }
    }

    return res.status(200).json({
      success: true,
      processedCount: processedTasks.length,
      tasks: processedTasks,
      message:
        processedTasks.length > 0
          ? `Otonom döngü tamamlandı: ${processedTasks.length} görev işlendi ve uygulandı.`
          : "Kuyrukta bekleyen görev bulunmuyor (Tüm fırsatlar güncel).",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[QueueWorker] Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  } finally {
    await cronLock.release("autoseo_queue_lock");
  }
};
