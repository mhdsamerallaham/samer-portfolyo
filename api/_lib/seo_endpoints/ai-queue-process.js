/**
 * api/_lib/seo_endpoints/ai-queue-process.js — AutoSEO Görev Kuyruğu İşleyicisi
 *
 * Cron veya Admin tarafından tetiklenir:
 *   1. CronJobLock ile kilit alır (Aynı anda iki çağrıyı engeller).
 *   2. Bütçe ve ertelenen görevleri kontrol eder.
 *   3. En yüksek öncelikli görevleri (P0 > P1 > P2 > P3) sırayla alır.
 *   4. AiRouter üzerinden kota aşımı olmadan çalıştırır.
 *   5. Güvenli limit dolduğunda kalan görevleri yarına erteler (DEFERRED).
 *   6. Kilidi serbest bırakır.
 */

const { createClient } = require("@supabase/supabase-js");
const AiBudgetManager = require("../ai/AiBudgetManager");
const AiTaskQueue = require("../ai/AiTaskQueue");
const AiCache = require("../ai/AiCache");
const AiRouter = require("../ai/AiRouter");
const CronJobLock = require("../ai/CronJobLock");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
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

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  // 1. Kilit Al (Job Locking)
  const lockAcquired = await cronLock.acquire("autoseo_queue_lock", 120);
  if (!lockAcquired) {
    return res.status(429).json({
      success: false,
      message: "İşlem zaten devam ediyor (Lock meşgul). Duplicate çağrı engellendi.",
    });
  }

  try {
    const processedTasks = [];
    const maxTasksPerBatch = 5; // Tek cron çalışmasında tüm bütçeyi tüketmeme kuralı

    for (let i = 0; i < maxTasksPerBatch; i++) {
      const task = await taskQueue.pickNextTask();
      if (!task) {
        break; // Kuyrukta bekleyen görev yok
      }

      console.log(`[QueueWorker] Görev işleniyor: ${task.id} (${task.task_type}, Priority: ${task.priority})`);
      const execResult = await aiRouter.executeTask(task);
      processedTasks.push({ taskId: task.id, ...execResult });

      if (execResult.deferred) {
        // Kota dolduğu için ertelendi, sonraki görevleri de zorlama
        console.log("[QueueWorker] Güvenli AI bütçesi doldu. Batch durduruluyor.");
        break;
      }
    }

    return res.status(200).json({
      success: true,
      processedCount: processedTasks.length,
      tasks: processedTasks,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[QueueWorker] Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  } finally {
    await cronLock.release("autoseo_queue_lock");
  }
};
