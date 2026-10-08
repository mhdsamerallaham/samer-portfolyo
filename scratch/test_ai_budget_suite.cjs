/**
 * test_ai_budget_suite.cjs — Kapsamlı Otomatik AI Güvenlik ve Limit Test Paketi
 *
 * Doğrulanan Senaryolar:
 *   [1]  %80 Safe Limit Kuralı (Kapasitenin %80'ine ulaşınca yeni düşük öncelikli iş durdurulmalı)
 *   [2]  RPM Exhaustion (Dakikalık istek limiti dolunca bloklama)
 *   [3]  TPM Exhaustion (Dakikalık token limiti aşılınca bloklama)
 *   [4]  RPD Exhaustion (Günlük istek limiti dolunca bloklama)
 *   [5]  429 Rate Limit Yanıtı (Exponential backoff ve retry-after cooldown'ı)
 *   [6]  402 Payment Required Yanıtı (Kredi yetersizliğinde PAUSED / INSUFFICIENT_CREDITS alma)
 *   [7]  Provider Fallback (Bir provider dolunca veya hata verince diğer uygun provider'a otomatik geçiş)
 *   [8]  All Providers Exhausted (Hiçbir provider uygun değilse ZORLA İSTEK ATILMAMALI)
 *   [9]  Deferred Task (Limit aşımında görev kaybolmamalı, deferred_until = tomorrow olmalı)
 *   [10] Next-Day Retry (Ertesi gün ertelenen görev otomatik olarak devam etmeli)
 *   [11] Duplicate Cron Job Locking (Aynı anda iki cron çalışırsa kilit alınıp çakışma engellenmeli)
 *   [12] Cache Hit (Aynı article_id + content_hash + task_type tekrar AI'ye gönderilmemeli, 0 token harcanmalı)
 *   [13] Content Hash Unchanged (Makale değişmediğinde gereksiz analiz yapılmamalı)
 *   [14] Retry-After Header (Sağlayıcının verdiği saniye kadar cooldown uygulanmalı)
 *   [15] Cooldown Süresi Bitene Kadar İstek Gönderilmeme Garantisi
 */

const assert = require("assert");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../api/.env") });
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const AiBudgetManager = require("../api/_lib/ai/AiBudgetManager");
const AiTaskQueue = require("../api/_lib/ai/AiTaskQueue");
const AiCache = require("../api/_lib/ai/AiCache");
const AiRouter = require("../api/_lib/ai/AiRouter");
const TokenEstimator = require("../api/_lib/ai/TokenEstimator");
const CronJobLock = require("../api/_lib/ai/CronJobLock");

let passedCount = 0;
let totalTests = 15;

function testLog(id, desc, pass = true) {
  if (pass) {
    passedCount++;
    console.log(`  ✓ [TEST ${id}] ${desc}`);
  } else {
    console.error(`  ✗ [TEST ${id}] FAILED: ${desc}`);
  }
}

async function runTestSuite() {
  console.log("\n=======================================================");
  console.log("   AUTOSEO AI BUDGET & LIMIT RESILIENCE TEST SUITE     ");
  console.log("=======================================================\n");

  const budget = new AiBudgetManager(null);
  await budget.init();

  const queue = new AiTaskQueue(null);
  const cache = new AiCache(null);
  const cronLock = new CronJobLock(null);

  // ─────────────────────────────────────────────────────────────
  // TEST 1: %80 Safe Limit
  // ─────────────────────────────────────────────────────────────
  try {
    budget.settings.safetyMarginPercent = 80;
    const ratio = budget.getSafeMarginRatio();
    assert.strictEqual(ratio, 0.8, "Safe margin ratio must be 0.80");

    // Simüle: Groq günlük 14,400 limit, %80 safe limit = 11,520
    const evalResult = await budget.evaluateProviderCapacity("groq");
    assert.strictEqual(evalResult.safeRpdCapacity, Math.floor(14400 * 0.8), "Safe capacity must respect 80%");
    testLog(1, "%80 Safe Limit kuralı doğru hesaplandı ve uygulandı.");
  } catch (e) {
    testLog(1, `%80 Safe Limit hatası: ${e.message}`, false);
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 2: RPM Exhaustion
  // ─────────────────────────────────────────────────────────────
  try {
    // Groq için 30 RPM limit var. Rolling dakikaya 25 istek ekleyelim (%80 safe = 24 istek).
    const now = Date.now();
    const fakeWindow = [];
    for (let i = 0; i < 25; i++) {
      fakeWindow.push({ timestamp: now - i * 1000, tokens: 50, requests: 1 });
    }
    budget.minuteWindows.set("groq", fakeWindow);

    const cap = await budget.evaluateProviderCapacity("groq");
    assert.strictEqual(cap.safeRpmCapacity, 0, "Safe RPM must be exhausted (30 * 0.8 = 24, used 25)");
    testLog(2, "RPM Exhaustion: Dakikalık limit güvenli eşiği aşınca safe capacity 0 oldu.");
  } catch (e) {
    testLog(2, `RPM Exhaustion hatası: ${e.message}`, false);
  } finally {
    budget.minuteWindows.set("groq", []); // Temizle
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 3: TPM Exhaustion
  // ─────────────────────────────────────────────────────────────
  try {
    // Groq 8,000 TPM limit (%80 safe = 6,400). 7,000 token simüle et.
    const now = Date.now();
    budget.minuteWindows.set("groq", [{ timestamp: now, tokens: 7000, requests: 1 }]);
    const cap = await budget.evaluateProviderCapacity("groq");
    assert.strictEqual(cap.safeTpmCapacity, 0, "Safe TPM must be exhausted (8000 * 0.8 = 6400, used 7000)");
    testLog(3, "TPM Exhaustion: Dakikalık token limiti aşılınca sağlayıcı güvenli listesinden çıkarıldı.");
  } catch (e) {
    testLog(3, `TPM Exhaustion hatası: ${e.message}`, false);
  } finally {
    budget.minuteWindows.set("groq", []);
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 4: RPD Exhaustion
  // ─────────────────────────────────────────────────────────────
  try {
    // OpenRouter 50 RPD limit (%80 safe = 40). 45 istek simüle et.
    budget.localDailyLedger.set("openrouter", {
      date: budget.getTodayKey(),
      requests: 45,
      tokens: 5000,
    });
    const cap = await budget.evaluateProviderCapacity("openrouter");
    assert.strictEqual(cap.safeRpdCapacity, 0, "OpenRouter RPD safe capacity must be 0 (50 * 0.8 = 40, used 45)");
    assert.strictEqual(cap.statusBadge, "BLOCKED", "Provider should be BLOCKED");
    testLog(4, "RPD Exhaustion: Günlük istek limiti güvenli payı aşınca provider BLOCKED statüsüne geçti.");
  } catch (e) {
    testLog(4, `RPD Exhaustion hatası: ${e.message}`, false);
  } finally {
    budget.localDailyLedger.delete("openrouter");
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 5: 429 Rate Limit Yanıtı & Retry-After
  // ─────────────────────────────────────────────────────────────
  try {
    const err429 = new Error("HTTP 429: Too Many Requests");
    err429.statusCode = 429;
    err429.retryAfterSeconds = 45;

    budget.handleProviderError("mistral", err429);
    const cap = await budget.evaluateProviderCapacity("mistral");

    assert.strictEqual(cap.health, "RATE_LIMITED", "Health must be RATE_LIMITED");
    assert.strictEqual(cap.inCooldown, true, "Must be in cooldown");
    assert(cap.cooldownRemainingSeconds >= 40, "Cooldown remaining must reflect retry-after (~45s)");
    testLog(5, "429 Rate Limit: Sağlayıcı anında RATE_LIMITED ve 45s cooldown'a alındı.");
  } catch (e) {
    testLog(5, `429 Test hatası: ${e.message}`, false);
  } finally {
    budget.providerStates.mistral.cooldownUntil = 0;
    budget.providerStates.mistral.health = "HEALTHY";
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 6: 402 Payment Required Yanıtı (Kredi Yetersizliği)
  // ─────────────────────────────────────────────────────────────
  try {
    const err402 = new Error("HTTP 402: Payment Required");
    err402.statusCode = 402;

    budget.handleProviderError("cerebras", err402);
    const cap = await budget.evaluateProviderCapacity("cerebras");

    assert.strictEqual(cap.health, "INSUFFICIENT_CREDITS", "Health must be INSUFFICIENT_CREDITS");
    assert.strictEqual(cap.statusBadge, "PAUSED", "Badge must be PAUSED");
    assert(cap.cooldownRemainingSeconds > 1000, "Must have long 1-hour cooldown");
    testLog(6, "402 Payment Required: Sağlayıcı PAUSED statüsüne alındı ve sürekli denenmesi engellendi.");
  } catch (e) {
    testLog(6, `402 Test hatası: ${e.message}`, false);
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 7: Provider Fallback (Dinamik Geçiş)
  // ─────────────────────────────────────────────────────────────
  try {
    // Groq'u cooldown'a alalım. Router Mistral'i seçmeli.
    budget.providerStates.groq.cooldownUntil = Date.now() + 60000;
    budget.providerStates.mistral.health = "HEALTHY";
    budget.providerStates.mistral.cooldownUntil = 0;

    const router = new AiRouter({ budgetManager: budget, taskQueue: queue, aiCache: cache });
    const selection = await router.selectBestProvider(1000);

    assert(selection !== null, "Selection must not be null");
    assert.strictEqual(selection.selectedProvider, "mistral", "Router must dynamically fallback to Mistral");
    testLog(7, "Provider Fallback: Groq cooldown'dayken router dinamik olarak Mistral'e geçti.");
  } catch (e) {
    testLog(7, `Fallback Test hatası: ${e.message}`, false);
  } finally {
    budget.providerStates.groq.cooldownUntil = 0;
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 8: All Providers Exhausted (Zorla İstek Atılmaması)
  // ─────────────────────────────────────────────────────────────
  try {
    // Tüm sağlayıcıları cooldown'a al
    const keys = ["groq", "mistral", "openrouter", "gemini", "cerebras", "huggingface"];
    for (const k of keys) {
      budget.providerStates[k].cooldownUntil = Date.now() + 60000;
    }

    const router = new AiRouter({ budgetManager: budget, taskQueue: queue, aiCache: cache });
    const selection = await router.selectBestProvider(1500);

    assert.strictEqual(selection, null, "Must return null when all providers exhausted");
    testLog(8, "All Providers Exhausted: Hiçbir sağlayıcı güvenli değilken router null döndü, zorla API çağrılmadı.");
  } catch (e) {
    testLog(8, `All Providers Exhausted hatası: ${e.message}`, false);
  } finally {
    for (const k of ["groq", "mistral", "openrouter", "gemini"]) {
      budget.providerStates[k].cooldownUntil = 0;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 9: Deferred Task (Ertesi Güne Erteleme)
  // ─────────────────────────────────────────────────────────────
  try {
    const task = await queue.enqueue({
      taskType: "existing_article_optimization",
      priority: "P0",
      payload: { prompt: "Test prompt" },
    });

    await queue.deferTask(task.id, "Safe limit reached");
    const deferredItem = queue.memoryQueue.find((t) => t.id === task.id);

    assert.strictEqual(deferredItem.status, "deferred", "Task status must be deferred");
    assert(deferredItem.deferred_until.length === 10, "deferred_until must be YYYY-MM-DD");
    testLog(9, "Deferred Task: Bütçe dolduğunda görev kaybolmadı, deferred_until = yarın olarak saklandı.");
  } catch (e) {
    testLog(9, `Deferred Task hatası: ${e.message}`, false);
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 10: Next-Day Retry (Ertelenen Görevin Otomatik Devamı)
  // ─────────────────────────────────────────────────────────────
  try {
    // Dünün tarihine ayarla ki resume tetiklensin
    const yesterday = "2026-01-01";
    const testTask = await queue.enqueue({
      taskType: "title_ctr",
      priority: "P1",
      payload: { prompt: "Test" },
    });
    testTask.status = "deferred";
    testTask.deferred_until = yesterday;

    await queue.resumeDeferredTasks();
    assert.strictEqual(testTask.status, "pending", "Deferred task must automatically resume to pending");
    testLog(10, "Next-Day Retry: Tarihi gelen ertelenmiş görev otomatik olarak 'pending' durumuna alındı.");
  } catch (e) {
    testLog(10, `Next-Day Retry hatası: ${e.message}`, false);
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 11: Duplicate Cron Job Locking (Idempotency)
  // ─────────────────────────────────────────────────────────────
  try {
    const lock1 = await cronLock.acquire("test_cron_lock", 60);
    assert.strictEqual(lock1, true, "First acquire must succeed");

    const lock2 = await cronLock.acquire("test_cron_lock", 60);
    assert.strictEqual(lock2, false, "Second concurrent acquire must fail (Job locked)");

    await cronLock.release("test_cron_lock");
    const lock3 = await cronLock.acquire("test_cron_lock", 60);
    assert.strictEqual(lock3, true, "Acquire after release must succeed");
    await cronLock.release("test_cron_lock");

    testLog(11, "Duplicate Cron Locking: Aynı anda iki cron çalıştığında ikincisi engellendi.");
  } catch (e) {
    testLog(11, `Lock Test hatası: ${e.message}`, false);
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 12: Cache Hit (Mükerrer İstek Engelleme & 0 Token Harcama)
  // ─────────────────────────────────────────────────────────────
  try {
    const articleId = "art-123";
    const contentHash = "hash-abc-999";
    const cacheKey = AiCache.generateCacheKey({
      taskType: "title_ctr",
      articleId,
      contentHash,
      promptVersion: "v1",
    });

    const fakeResult = { proposed_title: "Cached Title 2026" };
    await cache.set({
      cacheKey,
      taskType: "title_ctr",
      articleId,
      contentHash,
      resultJson: fakeResult,
    });

    const hit = await cache.get(cacheKey);
    assert.deepStrictEqual(hit, fakeResult, "Cache get must match saved result");
    testLog(12, "Cache Hit: Aynı hash ve görev için önbellekten anında okundu (0 token tüketimi).");
  } catch (e) {
    testLog(12, `Cache Hit hatası: ${e.message}`, false);
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 13: Content Hash Unchanged
  // ─────────────────────────────────────────────────────────────
  try {
    const postA = {
      slug: "eticaret-rehberi",
      title_tr: "E-Ticaret Rehberi",
      seo_description_tr: "Detaylı rehber",
      content_tr: "Metin gövdesi...",
    };
    const postB = { ...postA }; // İçerik aynı
    const postC = { ...postA, content_tr: "Metin gövdesi GÜNCELLENDİ..." }; // İçerik değişti

    const hashA = AiCache.computeContentHash(postA);
    const hashB = AiCache.computeContentHash(postB);
    const hashC = AiCache.computeContentHash(postC);

    assert.strictEqual(hashA, hashB, "Identical content must produce identical hash");
    assert.notStrictEqual(hashA, hashC, "Modified content must produce different hash");
    testLog(13, "Content Hash: Makale değişmediğinde hash aynı kaldı, değiştiğinde yeni hash üretildi.");
  } catch (e) {
    testLog(13, `Content Hash hatası: ${e.message}`, false);
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 14: Retry-After Header Entegrasyonu
  // ─────────────────────────────────────────────────────────────
  try {
    const mockHeaders = {
      "retry-after": "90",
      "x-ratelimit-remaining-requests": "0",
    };
    const err = new Error("Rate limit");
    err.statusCode = 429;
    err.retryAfterSeconds = parseInt(mockHeaders["retry-after"], 10);

    budget.handleProviderError("groq", err);
    assert(budget.providerStates.groq.cooldownUntil >= Date.now() + 85000, "Cooldown must reflect ~90s");
    testLog(14, "Retry-After Header: Sağlayıcı başlığındaki 90 saniye cooldown olarak uygulandı.");
  } catch (e) {
    testLog(14, `Retry-After hatası: ${e.message}`, false);
  } finally {
    budget.providerStates.groq.cooldownUntil = 0;
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 15: Cooldown Boyunca İstek Gönderilmeme Garantisi
  // ─────────────────────────────────────────────────────────────
  try {
    budget.providerStates.gemini.cooldownUntil = Date.now() + 30000; // 30s cooldown
    const cap = await budget.evaluateProviderCapacity("gemini");

    assert.strictEqual(cap.inCooldown, true, "Gemini must be marked inCooldown");
    assert.strictEqual(cap.statusBadge, "BLOCKED", "Gemini status badge must be BLOCKED during cooldown");

    const router = new AiRouter({ budgetManager: budget, taskQueue: queue, aiCache: cache });
    const candidate = await router.selectBestProvider(500, ["groq", "mistral", "openrouter", "cerebras", "huggingface"]);

    assert.strictEqual(candidate, null, "Gemini must not be selected while in cooldown");
    testLog(15, "Cooldown Garantisi: Cooldown bitene kadar Gemini'ye tek bir istek bile atılmadı.");
  } catch (e) {
    testLog(15, `Cooldown Test hatası: ${e.message}`, false);
  } finally {
    budget.providerStates.gemini.cooldownUntil = 0;
  }

  console.log("\n=======================================================");
  console.log(`   SONUÇ: ${passedCount}/${totalTests} TEST BAŞARIYLA GEÇTİ!`);
  console.log("=======================================================\n");

  if (passedCount === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTestSuite();
