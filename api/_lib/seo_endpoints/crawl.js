/**
 * api/_lib/seo_endpoints/crawl.js — On-Demand & Scheduled Technical SEO Crawler API
 */

const TechnicalCrawler = require("../seo/TechnicalCrawler");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const crawler = new TechnicalCrawler();

  try {
    const auditResult = await crawler.runAudit();
    return res.status(200).json(auditResult);
  } catch (error) {
    console.error("[SeoCrawl API] Exception:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
