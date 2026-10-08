/**
 * CronJobLock.js — Dağıtık ve Idempotent Cron Kilit Yöneticisi
 *
 * Sorumluluklar:
 *   - Vercel Cron veya Admin tarafından aynı anda iki kez tetiklenen
 *     görevlerin çakışmasını engeller.
 *   - Lock alamazsa işlemi güvenli bir şekilde atlar.
 *   - Zaman aşımına uğramış kilitleri otomatik temizler.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

class CronJobLock {
  /**
   * @param {import('@supabase/supabase-js').SupabaseClient} [supabaseClient]
   */
  constructor(supabaseClient = null) {
    this.supabase = supabaseClient;
    this.memoryLocks = new Map(); // lockKey -> expiresAt
  }

  _getLockFilePath(lockKey) {
    const safeKey = String(lockKey).replace(/[^a-zA-Z0-9_-]/g, "_");
    return path.join(os.tmpdir(), `autoseo_lock_${safeKey}.json`);
  }

  /**
   * Kilit almaya çalışır
   *
   * @param {string} lockKey
   * @param {number} [ttlSeconds=60] Kilidin geçerlilik süresi (saniye)
   * @returns {Promise<boolean>} Kilit alındıysa true, alınamadıysa false
   */
  async acquire(lockKey = "autoseo_queue_lock", ttlSeconds = 60) {
    const now = Date.now();
    const expiresAt = new Date(now + ttlSeconds * 1000).toISOString();

    // 1. Supabase ile atomik kilit
    if (this.supabase) {
      try {
        // Kontrol et: Supabase'de aktif (süresi dolmamış) kilit var mı?
        const { data: activeLocks, error: selectErr } = await this.supabase
          .from("ai_cron_locks")
          .select("*")
          .eq("lock_key", lockKey)
          .gt("expires_at", new Date(now).toISOString())
          .limit(1);

        if (!selectErr && Array.isArray(activeLocks) && activeLocks.length > 0) {
          // Gerçekten veritabanında aktif bir kilit var! Başka bir worker çalışıyor.
          return false;
        }

        // Eski zaman aşımına uğramış kilitleri silmeyi dene
        await this.supabase
          .from("ai_cron_locks")
          .delete()
          .eq("lock_key", lockKey)
          .lt("expires_at", new Date(now).toISOString());

        // Yeni kilidi eklemeyi dene
        const { error: insertErr } = await this.supabase.from("ai_cron_locks").insert({
          lock_key: lockKey,
          locked_at: new Date(now).toISOString(),
          locked_by: `process_${process.pid || "node"}`,
          expires_at: expiresAt,
        });

        if (!insertErr) {
          return true; // DB kilidi başarıyla alındı
        }

        // Eğer hata sadece benzersiz anahtar çakışması (duplicate key) ise:
        if (insertErr.code === "23505") {
          return false; // Başka bir işlem tam bu anda kilidi kaptı
        }

        // DB tablosu yoksa (42P01) veya RLS anon izni yoksa (42501),
        // hata fırlatıp işlemi kilitlemek yerine yerel/dosya kilit sistemine güvenle devam et.
      } catch (err) {
        // Fallback
      }
    }

    // 2. Dosya bazlı kilit kontrolü (/tmp/autoseo_lock_*.json - Serverless/Container uyumlu)
    const lockFilePath = this._getLockFilePath(lockKey);
    try {
      if (fs.existsSync(lockFilePath)) {
        const raw = fs.readFileSync(lockFilePath, "utf-8");
        const lockData = JSON.parse(raw);
        if (lockData && lockData.expires_at && lockData.expires_at > now) {
          return false; // Dosya kilidi aktif, duplicate çağrıyı engelle
        }
      }
      fs.writeFileSync(
        lockFilePath,
        JSON.stringify({
          lock_key: lockKey,
          locked_at: now,
          expires_at: now + ttlSeconds * 1000,
          locked_by: `process_${process.pid || "node"}`,
        }),
        "utf-8"
      );
      return true;
    } catch (fsErr) {
      // In-memory fallback
    }

    // 3. In-memory kilit kontrolü
    const existingExpiry = this.memoryLocks.get(lockKey);
    if (existingExpiry && existingExpiry > now) {
      return false; // Kilit meşgul
    }

    this.memoryLocks.set(lockKey, now + ttlSeconds * 1000);
    return true;
  }

  /**
   * Kilidi serbest bırak
   * @param {string} lockKey
   */
  async release(lockKey = "autoseo_queue_lock") {
    if (this.supabase) {
      try {
        await this.supabase.from("ai_cron_locks").delete().eq("lock_key", lockKey);
      } catch (err) {
        // Sessizce geç
      }
    }

    // Dosya kilidini temizle
    try {
      const lockFilePath = this._getLockFilePath(lockKey);
      if (fs.existsSync(lockFilePath)) {
        fs.unlinkSync(lockFilePath);
      }
    } catch (fsErr) {
      // Sessizce geç
    }

    this.memoryLocks.delete(lockKey);
  }
}

module.exports = CronJobLock;
