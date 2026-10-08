/**
 * api/_lib/seo_endpoints/optimize-blog.js — Generates Before vs After Optimization Diff for Blog / Page
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const BlogOptimizer = require("../seo/BlogOptimizer");

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use POST or GET." });
  }

  const payload = req.method === "POST" ? req.body : req.query;
  const { post_id, post_slug, target_query, position, impressions, ctr, clicks } = payload || {};

  // Clean slug by removing domain, protocols, language prefixes, and blog path
  let cleanSlug = (post_slug || "").trim();
  if (cleanSlug) {
    cleanSlug = cleanSlug.replace(/^https?:\/\/[^/]+/i, "");
    cleanSlug = cleanSlug.replace(/^\/(?:en\/|ar\/)?(?:blog\/)?/i, "");
    cleanSlug = cleanSlug.replace(/\/$/, "").trim();
  }

  try {
    let post = null;

    if (post_id) {
      const { data: byId } = await supabase.from("blog_posts").select("*").eq("id", post_id);
      if (byId && byId.length > 0) post = byId[0];
    }

    if (!post && cleanSlug) {
      const { data: bySlug } = await supabase.from("blog_posts").select("*").eq("slug", cleanSlug);
      if (bySlug && bySlug.length > 0) post = bySlug[0];
    }

    // If still not found by exact slug, try matching by target_query in title
    if (!post && target_query) {
      const queryClean = target_query.split(" ")[0];
      if (queryClean && queryClean.length >= 3) {
        const { data: fuzzy } = await supabase
          .from("blog_posts")
          .select("*")
          .ilike("title_tr", `%${queryClean}%`)
          .limit(1);
        if (fuzzy && fuzzy.length > 0) post = fuzzy[0];
      }
    }

    // If target page is Home Page or static landing page
    if (!post) {
      const isHome = !cleanSlug || cleanSlug === "" || cleanSlug === "/";
      post = {
        id: isHome ? "page_home" : `page_${cleanSlug}`,
        slug: cleanSlug || "ana-sayfa",
        title_tr: isHome
          ? "E-Ticaret Web Tasarım & Geliştirme Uzmanı | Samer"
          : `${target_query || cleanSlug} | Samer Allaham`,
        seo_title_tr: isHome
          ? "E-Ticaret Web Tasarım & Kurulum Uzmanı — Samer Allaham"
          : `${target_query || cleanSlug} — Samer.life`,
        seo_description_tr: isHome
          ? "Shopify & İKAS e-ticaret siteleri, özel yazılım, hız optimizasyonu ve yapay zeka entegrasyonu."
          : `${target_query || cleanSlug} için profesyonel e-ticaret çözümleri ve rehber.`,
        content_tr: isHome
          ? "E-ticaret web tasarım, özel yazılım geliştirme, Shopify kurulum ve optimizasyon hizmetleri."
          : `${target_query || cleanSlug} konusunda kapsamlı teknik rehber ve hizmet detayları.`,
      };
    }

    const optimizer = new BlogOptimizer(supabase);
    const diff = await optimizer.generateOptimizationDiff(
      post,
      {
        target_query: target_query || post.title_tr,
        position: Number(position) || 12.0,
        impressions: Number(impressions) || 1500,
        ctr: Number(ctr) || 0.015,
        clicks: Number(clicks) || 20,
      }
    );

    return res.status(200).json({
      success: true,
      diff,
      matched_target: {
        id: post.id,
        slug: post.slug,
        title: post.title_tr,
      },
    });
  } catch (error) {
    console.error("[OptimizeBlog API] Exception:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
