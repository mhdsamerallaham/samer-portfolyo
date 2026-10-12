/**
 * api/seo.js — Unified SEO & AI Budget Manager Endpoint Dispatcher
 *
 * Consolidates all SEO sub-endpoints into a single Serverless Function
 * to strictly comply with Vercel Hobby plan limits (max 12 functions).
 *
 * Supported Actions:
 *   - /api/seo/dashboard-data   -> Overview & GSC Opportunities
 *   - /api/seo/ai-budget        -> Provider Quotas & AI Settings
 *   - /api/seo/ai-queue-process -> AI Queue Worker
 *   - /api/seo/optimize-blog    -> AI Optimization Diff Generator
 *   - /api/seo/actions          -> Approve & Revert Modifications
 *   - /api/seo/crawl            -> Technical SEO Crawler
 *   - /api/seo/sync-gsc         -> Google Search Console Sync
 */

const actionsHandler = require("./_lib/seo_endpoints/actions");
const aiBudgetHandler = require("./_lib/seo_endpoints/ai-budget");
const aiQueueProcessHandler = require("./_lib/seo_endpoints/ai-queue-process");
const crawlHandler = require("./_lib/seo_endpoints/crawl");
const dashboardDataHandler = require("./_lib/seo_endpoints/dashboard-data");
const optimizeBlogHandler = require("./_lib/seo_endpoints/optimize-blog");
const syncGscHandler = require("./_lib/seo_endpoints/sync-gsc");

const handlers = {
  "actions": actionsHandler,
  "ai-budget": aiBudgetHandler,
  "ai-queue-process": aiQueueProcessHandler,
  "crawl": crawlHandler,
  "dashboard-data": dashboardDataHandler,
  "optimize-blog": optimizeBlogHandler,
  "sync-gsc": syncGscHandler,
};

module.exports = async (req, res) => {
  // CORS support
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Determine sub-action
  let action = "";

  if (req.query && req.query.action) {
    action = String(req.query.action).toLowerCase().trim();
  } else if (req.url) {
    const rawPath = req.url.split("?")[0];
    const match = rawPath.match(/\/api\/seo\/([^/?]+)/i);
    if (match) {
      action = match[1].toLowerCase().trim();
    }
  }

  // TEMP: debug route to check env vars
  if (action === "debug") {
    return res.status(200).json({
      gsc_client_email: process.env.GSC_CLIENT_EMAIL || "(missing)",
      gsc_private_key_length: (process.env.GSC_PRIVATE_KEY || "").length,
      gsc_private_key_starts: (process.env.GSC_PRIVATE_KEY || "").substring(0, 30),
      gsc_site_url: process.env.GSC_SITE_URL || "(missing)",
      has_begin_marker: (process.env.GSC_PRIVATE_KEY || "").includes("BEGIN PRIVATE KEY"),
      node_env: process.env.NODE_ENV,
    });
  }

  const handler = handlers[action];
  if (handler) {
    return handler(req, res);
  }

  return res.status(404).json({
    success: false,
    error: `Unknown SEO action '${action}'. Available actions: ${Object.keys(handlers).join(", ")}`,
  });
};
