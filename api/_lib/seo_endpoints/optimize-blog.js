/**
 * api/_lib/seo_endpoints/optimize-blog.js — Generates Before vs After Optimization Diff for a Blog
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
  res.setHeader("Access-Control-Allow-Methods", "POST, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const payload = req.method === "POST" ? req.body : req.query;
  const { post_id, post_slug, target_query, position, impressions, ctr, clicks } = payload || {};

  if (!post_id && !post_slug) {
    return res.status(400).json({ error: "post_id or post_slug is required." });
  }

  try {
    let query = supabase.from("blog_posts").select("*");
    if (post_id) {
      query = query.eq("id", post_id);
    } else {
      query = query.eq("slug", post_slug);
    }

    const { data: posts, error: postErr } = await query;
    if (postErr || !posts || posts.length === 0) {
      return res.status(404).json({ error: "Blog post not found." });
    }

    const post = posts[0];
    const optimizer = new BlogOptimizer();

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
    });
  } catch (error) {
    console.error("[OptimizeBlog API] Exception:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
