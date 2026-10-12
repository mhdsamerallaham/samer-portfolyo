/**
 * api/_lib/seo_endpoints/sync-gsc.js — Manual & Cron Triggerable GSC Sync Endpoint
 */

const GscClient = require("../seo/GscClient");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET");

  const client = new GscClient();

  // --- TEMP DEBUG (remove after fix) ---
  const debugInfo = {
    has_client_email: Boolean(process.env.GSC_CLIENT_EMAIL),
    client_email_value: process.env.GSC_CLIENT_EMAIL || "(missing)",
    has_private_key: Boolean(process.env.GSC_PRIVATE_KEY),
    private_key_length: (process.env.GSC_PRIVATE_KEY || "").length,
    private_key_starts: (process.env.GSC_PRIVATE_KEY || "").substring(0, 30),
    has_begin_marker: (process.env.GSC_PRIVATE_KEY || "").includes("BEGIN PRIVATE KEY"),
    is_configured: client.isConfigured(),
  };
  // --- END TEMP DEBUG ---

  if (!client.isConfigured()) {
    return res.status(200).json({
      success: false,
      status: "connection_required",
      message: "Google Search Console bağlantısı henüz yapılandırılmamış. GSC_CLIENT_EMAIL ve GSC_PRIVATE_KEY ortam değişkenleri bekleniyor.",
      synced_rows: 0,
      _debug: debugInfo,
    });
  }

  try {
    const analytics = await client.querySearchAnalytics();
    if (analytics.status === "success" && analytics.rows.length > 0) {
      const syncResult = await client.syncToDatabase(analytics.rows);
      return res.status(200).json({
        success: true,
        status: "synced",
        rows_fetched: analytics.rows.length,
        db_sync: syncResult,
      });
    }

    return res.status(200).json({
      success: false,
      status: analytics.status,
      message: analytics.error || "No rows returned from GSC.",
      rows_fetched: 0,
    });
  } catch (err) {
    console.error("[SyncGSC API] Exception:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
