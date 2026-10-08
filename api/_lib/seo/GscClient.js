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
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

class GscClient {
  constructor() {
    this.siteUrl = process.env.GSC_SITE_URL || "https://www.samer.life/";
    this.clientEmail = process.env.GSC_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
    this.privateKey = (process.env.GSC_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || "")
      .replace(/\\n/g, "\n");

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    this.supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
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
      .sign(this.privateKey, "base64")
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

    const encodedSite = encodeURIComponent(this.siteUrl);
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
              if (data.error) {
                resolve({
                  configured: true,
                  status: "api_error",
                  error: data.error.message,
                  rows: [],
                });
              } else {
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

                resolve({
                  configured: true,
                  status: "success",
                  rowCount: formattedRows.length,
                  rows: formattedRows,
                });
              }
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
