const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async (req, res) => {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method !== "GET") {
    return res.status(451).json({ error: "Method not allowed" });
  }

  const { lang = "tr", slug } = req.query;
  const targetLang = ["tr", "en", "ar"].includes(lang.toLowerCase()) ? lang.toLowerCase() : "tr";

  try {
    let query = supabase.from("blog_posts").select("*");

    if (slug) {
      query = query.eq("slug", slug);
    } else {
      query = query.order("published_at", { ascending: false });
    }

    const { data: posts, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    if (slug && (!posts || posts.length === 0)) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Dynamic date formatter helper
    const formatBlogDate = (dateStr, language) => {
      try {
        const date = new Date(dateStr);
        const locale = language === "tr" ? "tr-TR" : language === "ar" ? "ar-EG" : "en-US";
        return new Intl.DateTimeFormat(locale, {
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(date);
      } catch (e) {
        return dateStr;
      }
    };

    // Project and translate fields dynamically for the frontend client
    const formattedPosts = posts.map(post => ({
      id: post.id,
      slug: post.slug,
      date: formatBlogDate(post.published_at, targetLang),
      title: post[`title_${targetLang}`] || post.title_tr,
      summary: post[`summary_${targetLang}`] || post.summary_tr,
      content: post[`content_${targetLang}`] || post.content_tr,
      seo_title: post[`seo_title_${targetLang}`] || post.seo_title_tr,
      seo_description: post[`seo_description_${targetLang}`] || post.seo_description_tr
    }));

    if (slug) {
      return res.status(200).json(formattedPosts[0]);
    }

    return res.status(200).json(formattedPosts);

  } catch (error) {
    console.error("Fetch Posts Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
