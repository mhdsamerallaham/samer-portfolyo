/**
 * api/seo/sync-gsc.js — Manual & Cron Triggerable GSC Sync Endpoint
 */

const GscClient = require("../_lib/seo/GscClient");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET");

  const client = new GscClient();

  if (!client.isConfigured()) {
    return res.status(200).json({
      success: false,
      status: "connection_required",
      message: "Google Search Console bağlantısı henüz yapılandırılmamış. GSC_CLIENT_EMAIL ve GSC_PRIVATE_KEY ortam değişkenleri bekleniyor.",
      synced_rows: 0,
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
