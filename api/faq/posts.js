const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async (req, res) => {
  // Set CORS headers for API accessibility
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const lang = (req.query.lang || "tr").toLowerCase();
    const { data: posts, error } = await supabase
      .from("faq_posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) {
      // If table doesn't exist yet, return empty list gracefully
      console.warn("[FAQ API] Database error or table missing:", error.message);
      return res.status(200).json({ success: true, posts: [], count: 0 });
    }

    // Format fields according to requested language with fallback to TR
    const formatted = (posts || []).map(p => ({
      id: p.id,
      slug: p.slug,
      category: p.category || 'e-commerce',
      published_at: p.published_at,
      question: p[`question_${lang}`] || p.question_tr,
      short_answer: p[`short_answer_${lang}`] || p.short_answer_tr,
      content: p[`content_${lang}`] || p.content_tr,
      who_is_this_for: p[`who_is_this_for_${lang}`] || p.who_is_this_for_tr,
      cta_text: p[`cta_text_${lang}`] || p.cta_text_tr || "Hizmetlerimizi İnceleyin",
      cta_link: p[`cta_link_${lang}`] || p.cta_link_tr || "/#services"
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      posts: formatted
    });
  } catch (err) {
    console.error("[FAQ API] Exception:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
