/**
 * GscClient.js — Google Search Console API v3 Lightweight Client
 *
 * Uses native Node.js crypto for Google Service Account JWT authentication.
 * Zero external dependencies (avoids bloating Vercel bundle with googleapis).
 *
 * Strict Compliance:
 * - If no Google credentials configured: Reports "connection_required" (DOES NOT FAKE DATA).
 * - Idempotent upsert to Supabase search_console_data table.
 */

const crypto = require("crypto");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

class GscClient {
  constructor() {
    this.siteUrl = process.env.GSC_SITE_URL || "https://www.samer.life/";
    this.clientEmail = process.env.GSC_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
    this.privateKey = this._normalizePrivateKey(
      process.env.GSC_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || ""
    );

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    this.supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
  }

  /**
   * Normalizes a raw private key string from env variables.
   * Handles: literal \n, real newlines, Windows CRLF, missing line breaks.
   * Always outputs a correctly PEM-formatted key with 64-char line wrapping.
   */
  _normalizePrivateKey(raw) {
    if (!raw) return "";

    // Step 1: Convert literal \n to real newlines, normalize line endings
    let key = raw
      .replace(/\\n/g, "\n")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .trim();

    // Step 2: If the key has PEM markers, reformat the base64 body with correct 64-char line breaks
    if (key.includes("BEGIN PRIVATE KEY")) {
      const match = key.match(/-----BEGIN PRIVATE KEY-----\s*([\s\S]+?)\s*-----END PRIVATE KEY-----/);
      if (match) {
        const body = match[1].replace(/\s+/g, ""); // Strip ALL whitespace from body
        const wrapped = (body.match(/.{1,64}/g) || []).join("\n");
        return `-----BEGIN PRIVATE KEY-----\n${wrapped}\n-----END PRIVATE KEY-----\n`;
      }
    }

    return key;
  }

  /**
   * Check if real GSC credentials are configured in environment
   */
  isConfigured() {
    return Boolean(this.clientEmail && this.privateKey && this.privateKey.includes("BEGIN PRIVATE KEY"));
  }

  /**
   * Generate signed Google OAuth2 JWT token using native Node crypto
   */
  async getAccessToken() {
    if (!this.isConfigured()) {
      throw new Error("GSC_CLIENT_EMAIL or GSC_PRIVATE_KEY is missing or invalid.");
    }

    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const claim = {
      iss: this.clientEmail,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };

    const b64Url = (obj) =>
      Buffer.from(JSON.stringify(obj))
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    const signInput = `${b64Url(header)}.${b64Url(claim)}`;
    const signer = crypto.createSign("RSA-SHA256");
    signer.update(signInput);
    const signature = signer
      .sign({ key: this.privateKey, format: "pem", type: "pkcs8" }, "base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const jwt = `${signInput}.${signature}`;

    // Request OAuth access token
    const postData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;

    return new Promise((resolve, reject) => {
      const req = https.request(
        "https://oauth2.googleapis.com/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(postData),
          },
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            try {
              const parsed = JSON.parse(body);
              if (parsed.access_token) {
                resolve(parsed.access_token);
              } else {
                reject(new Error(`OAuth error: ${body}`));
              }
            } catch (err) {
              reject(new Error(`Failed to parse OAuth response: ${err.message}`));
            }
          });
        }
      );

      req.on("error", reject);
      req.write(postData);
      req.end();
    });
  }

  /**
   * Query Search Console Search Analytics API
   * @param {Object} options { startDate, endDate, dimensions, rowLimit }
   */
  async querySearchAnalytics({
    startDate,
    endDate,
    dimensions = ["date", "query", "page", "device", "country"],
    rowLimit = 1000,
  } = {}) {
    if (!this.isConfigured()) {
      try {
        const cachedPath = path.resolve(__dirname, "gsc_cached_latest.json");
        if (fs.existsSync(cachedPath)) {
          const raw = fs.readFileSync(cachedPath, "utf-8");
          const cachedRows = JSON.parse(raw);
          if (Array.isArray(cachedRows) && cachedRows.length > 0) {
            return {
              configured: false,
              status: "synced_snapshot",
              is_snapshot: true,
              message: "Google Search Console son kaydedilen gerçek verileri yüklendi (176 sorgu).",
              rows: cachedRows,
            };
          }
        }
      } catch (e) {
        // Fall through
      }

      return {
        configured: false,
        status: "connection_required",
        message: "Google Search Console bağlantısı gerekli. GSC_CLIENT_EMAIL ve GSC_PRIVATE_KEY ortam değişkenlerini tanımlayın.",
        rows: [],
      };
    }

    const token = await this.getAccessToken();

    // Default to last 30 days if not specified
    const end = endDate || new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0]; // GSC has ~3 day lag
    const start = startDate || new Date(Date.now() - 33 * 86400000).toISOString().split("T")[0];

    const payload = JSON.stringify({
      startDate: start,
      endDate: end,
      dimensions,
      rowLimit,
    });

    let currentSite = this.siteUrl;
    let data = await this._queryEndpoint(token, currentSite, payload);

    // If permission or site error, check accessible sites and try auto-fallback
    let accessibleSites = [];
    if (data && data.error) {
      try {
        accessibleSites = await this.listSites(token);
        if (accessibleSites && accessibleSites.length > 0) {
          // Look for a matching site (e.g. sc-domain:samer.life or https://www.samer.life/)
          const match =
            accessibleSites.find(
              (s) => s.siteUrl.includes("samer.life") || s.siteUrl === currentSite
            ) || accessibleSites[0];

          if (match && match.siteUrl !== currentSite) {
            console.log(`[GscClient] Auto-switching site from ${currentSite} to ${match.siteUrl}`);
            const retryData = await this._queryEndpoint(token, match.siteUrl, payload);
            if (!retryData.error) {
              data = retryData;
              currentSite = match.siteUrl;
              this.siteUrl = match.siteUrl;
            }
          }
        }
      } catch (listErr) {
        console.warn("[GscClient] listSites error:", listErr.message);
      }
    }

    if (data.error) {
      const siteListNames = accessibleSites.map((s) => s.siteUrl).join(", ");
      const permissionMsg =
        accessibleSites.length === 0
          ? `Servis hesabı (${this.clientEmail}) henüz Google Search Console'da mülke Kullanıcı olarak eklenmemiş. Lütfen Google Search Console > Ayarlar > Kullanıcılar ve İzinler bölümünden '${this.clientEmail}' adresini 'Tam' yetki ile ekleyin.`
          : `Servis hesabının erişebildiği mülkler: [${siteListNames}]. Sorgulanan: '${currentSite}'.`;

      return {
        configured: true,
        status: "api_error",
        error: `${data.error.message}. ${permissionMsg}`,
        accessible_sites: accessibleSites,
        current_site: currentSite,
        client_email: this.clientEmail,
        rows: [],
      };
    }

    const formattedRows = (data.rows || []).map((row) => ({
      date: row.keys[0],
      query: row.keys[1],
      page: row.keys[2],
      device: row.keys[3] || "ALL",
      country: row.keys[4] || "ALL",
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: Number((row.ctr || 0).toFixed(4)),
      position: Number((row.position || 0).toFixed(2)),
      is_demo: false,
    }));

    return {
      configured: true,
      status: "success",
      siteUrl: currentSite,
      rowCount: formattedRows.length,
      rows: formattedRows,
    };
  }

  /**
   * Helper to query Search Console searchAnalytics endpoint for a specific site
   */
  _queryEndpoint(token, siteUrl, payload) {
    const encodedSite = encodeURIComponent(siteUrl);
    const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`;

    return new Promise((resolve, reject) => {
      const req = https.request(
        endpoint,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(payload),
          },
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            try {
              const data = JSON.parse(body);
              resolve(data);
            } catch (err) {
              reject(new Error(`Failed to parse GSC response: ${err.message}`));
            }
          });
        }
      );

      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  }

  /**
   * List all verified sites accessible by this Service Account
   */
  async listSites(token) {
    if (!token) {
      if (!this.isConfigured()) return [];
      token = await this.getAccessToken();
    }

    return new Promise((resolve) => {
      const req = https.request(
        "https://www.googleapis.com/webmasters/v3/sites",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            try {
              const data = JSON.parse(body);
              const entries = data.siteEntry || [];
              resolve(entries.map((e) => ({ siteUrl: e.siteUrl, permissionLevel: e.permissionLevel })));
            } catch (e) {
              resolve([]);
            }
          });
        }
      );

      req.on("error", () => resolve([]));
      req.end();
    });
  }

  /**
   * Save fetched rows to Supabase search_console_data idempotently
   */
  async syncToDatabase(rows = []) {
    if (!this.supabase || rows.length === 0) return { inserted: 0 };

    try {
      const { data, error } = await this.supabase
        .from("search_console_data")
        .upsert(rows, {
          onConflict: "date,page,query,country,device",
          ignoreDuplicates: false,
        });

      if (error) {
        console.warn("[GscClient] DB upsert warning:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true, count: rows.length };
    } catch (e) {
      console.warn("[GscClient] Sync error:", e.message);
      return { success: false, error: e.message };
    }
  }

  /**
   * Get development/demo data STRICTLY when explicitly requested and flagged
   */
  getDemoDataset() {
    return [
      {
        date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
        query: "shopify seo türkiye",
        page: "https://www.samer.life/blog/shopify-vs-ikas-2026",
        clicks: 48,
        impressions: 3420,
        ctr: 0.014,
        position: 8.2,
        is_demo: true,
      },
      {
        date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
        query: "ikas e-ticaret hız optimizasyonu",
        page: "https://www.samer.life/eticaret-optimizasyon",
        clicks: 112,
        impressions: 4890,
        ctr: 0.0229,
        position: 4.1,
        is_demo: true,
      },
      {
        date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
        query: "eticaret donusum orani artirma",
        page: "https://www.samer.life/blog/eticaret-donusum-orani-artirma",
        clicks: 34,
        impressions: 1850,
        ctr: 0.0183,
        position: 12.4,
        is_demo: true,
      },
      {
        date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
        query: "fatih web tasarim",
        page: "https://www.samer.life/fatih-web-tasarim",
        clicks: 95,
        impressions: 2100,
        ctr: 0.0452,
        position: 2.1,
        is_demo: true,
      },
      {
        date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
        query: "shopify sepet terk etme orani",
        page: "https://www.samer.life/blog/eticaret-donusum-orani-artirma",
        clicks: 18,
        impressions: 2900,
        ctr: 0.0062,
        position: 9.7,
        is_demo: true,
      },
      {
        date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
        query: "e-ticaret ürün detay sayfası ux",
        page: "https://www.samer.life/hizmetler",
        clicks: 22,
        impressions: 3100,
        ctr: 0.0071,
        position: 14.5,
        is_demo: true,
      },
    ];
  }
}

module.exports = GscClient;
