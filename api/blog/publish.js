const https = require("https");
const http = require("http");
require("dotenv").config();

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const sitemapUrl = "https://www.samer.life/sitemap.xml";
  const results = {
    google_ping: false,
    bing_ping: false,
    google_indexing_api: "skipped_no_credentials"
  };

  try {
    // 1. Ping Google Sitemap Endpoint
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    await new Promise((resolve) => {
      https.get(googlePingUrl, (response) => {
        results.google_ping = response.statusCode === 200;
        resolve();
      }).on("error", () => resolve());
    });

    // 2. Ping Bing Sitemap Endpoint
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    await new Promise((resolve) => {
      https.get(bingPingUrl, (response) => {
        results.bing_ping = response.statusCode === 200;
        resolve();
      }).on("error", () => resolve());
    });

    return res.status(200).json({
      success: true,
      message: "Automated search engine indexing ping triggered successfully",
      details: results,
      sitemap: sitemapUrl
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
