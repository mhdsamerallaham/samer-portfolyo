/**
 * BlogOptimizer.js — "Update Existing Article" Analysis & Diff Generator
 *
 * Core AutoSEO Engine: Instead of creating duplicate articles, this engine optimizes
 * existing blog posts to capture higher search rankings, featured snippets, and clicks.
 *
 * Capabilities:
 * - Generates structured BEFORE vs AFTER comparison:
 *   - Current Title vs Proposed Title (CTR-optimized)
 *   - Current H1 vs Proposed H1
 *   - Missing Subtopics & Keywords
 *   - Proposed FAQ Section (Schema-ready)
 *   - Proposed Internal Links to related blogs & services
 *   - Content Diff Summary
 * - Resilient: Works with rule-based heuristics if AI is offline, or enhances with LLM if available.
 * - NEVER directly overwrites the DB. Only outputs the diff package for approval.
 */

const createProviderManager = require("../createProviderManager");
const AiCache = require("../ai/AiCache");

class BlogOptimizer {
  constructor(supabaseClient = null) {
    this.supabase = supabaseClient;
    this.aiCache = new AiCache(supabaseClient);
    try {
      this.aiManager = createProviderManager();
    } catch (e) {
      this.aiManager = null;
    }
  }

  /**
   * Generates a complete optimization analysis and diff for a blog post
   * @param {Object} post Existing blog_posts row { id, slug, title_tr, content_tr, seo_title_tr, seo_description_tr }
   * @param {Object} metrics { target_query, position, impressions, ctr, clicks }
   * @param {Array} availableServices List of service pages to link to
   * @param {Array} otherPosts List of other blog posts for internal linking
   */
  async generateOptimizationDiff(post, metrics = {}, availableServices = [], otherPosts = []) {
    const query = metrics.target_query || post.title_tr;
    const currentPosition = metrics.position || 12;
    const currentCtr = metrics.ctr ? `${(metrics.ctr * 100).toFixed(1)}%` : "1.4%";
    const currentImpressions = metrics.impressions || 1500;

    const currentTitle = post.seo_title_tr || post.title_tr;
    const currentDesc = post.seo_description_tr || post.summary_tr || "";
    const currentContent = post.content_tr || "";

    // 1. Rule-based base recommendation (Deterministic fallback)
    const proposedTitle = `${post.title_tr}: ${query.toUpperCase()} Rehberi (2026)`;
    const proposedDesc = `${currentDesc.slice(0, 120)} 2026 güncel ${query} stratejileri, hız ve dönüşüm ipuçlarıyla hemen uygulayın.`;

    const proposedFaq = [
      {
        q: `${query.charAt(0).toUpperCase() + query.slice(1)} nedir ve neden önemlidir?`,
        a: `${query}, e-ticaret mağazanızın arama motorlarında ve AI arama asistanlarında görünürlüğünü doğrudan artıran temel optimizasyon sürecidir.`,
      },
      {
        q: `${query} dönüşüm oranına nasıl katkı sağlar?`,
        a: `Kullanıcı deneyimini ve sayfa hızını iyileştirerek sepet terk etme oranını düşürür ve organik satışları yükseltir.`,
      },
    ];

    const proposedLinks = [
      {
        target_url: "/eticaret-optimizasyon",
        anchor_text: "e-ticaret dönüşüm optimizasyonu",
        reason: "Hedef dönüşüm hizmet sayfasına yetki akışı sağlar.",
      },
      {
        target_url: "/web-tasarim",
        anchor_text: "profesyonel web tasarım",
        reason: "Teknik altyapı hizmetiyle semantik bağ kurar.",
      },
    ];

    const missingSubtopics = [
      `${query.charAt(0).toUpperCase() + query.slice(1)} ile Core Web Vitals İyileştirmesi`,
      `Sık Yapılan 3 Kritik ${query} Hatası ve Çözümü`,
      `Google AI Overviews ve ChatGPT İçin ${query} Standartları`,
    ];

    let aiEnhanced = null;
    const contentHash = AiCache.computeContentHash(post);
    const cacheKey = AiCache.generateCacheKey({
      taskType: "existing_article_optimization",
      articleId: post.id,
      contentHash,
      promptVersion: "v2",
    });

    // 2. Önce Cache Kontrol Et (Mükerrer İstek Engelleme)
    const cachedDiff = await this.aiCache.get(cacheKey);
    if (cachedDiff) {
      console.log(`[BlogOptimizer] ⚡ CACHE HIT! Makale ${post.id} için AI analizi önbellekten çözüldü.`);
      aiEnhanced = cachedDiff;
    } else if (this.aiManager) {
      // 3. Cache Miss ise AI sağlayıcıları ile zenginleştir
      try {
        const prompt = `
          You are a Senior SEO Strategist and Conversion Engineer for samer.life.
          Optimize an EXISTING Turkish blog article to boost its Google ranking for keyword "${query}".
          Current Metrics: Position ${currentPosition}, Impressions ${currentImpressions}, CTR ${currentCtr}.
          
          Current Title: "${currentTitle}"
          Current Description: "${currentDesc}"
          
          Generate a high-CTR, EEAT-rich optimization proposal.
          Respond ONLY with valid JSON:
          {
            "proposed_title": "High CTR title under 60 chars including query",
            "proposed_meta_description": "Compelling meta description 140-155 chars with CTA",
            "proposed_h1": "Strong, natural Turkish H1",
            "missing_subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3"],
            "missing_entities": ["Entity 1", "Entity 2"],
            "new_faq_section": [
              { "q": "Real question", "a": "Direct 2-sentence answer" }
            ],
            "additional_html_content": "<h3>Subtopic Title</h3><p>Insightful 150-word expert explanation with practical advice.</p>"
          }
        `;

        const aiResponse = await this.aiManager.generateJSON(
          prompt,
          "Respond strictly with valid JSON. Do not markdown wrap."
        );

        if (aiResponse && aiResponse.proposed_title) {
          aiEnhanced = aiResponse;
          // Başarılı sonucu önbelleğe kaydet
          await this.aiCache.set({
            cacheKey,
            taskType: "existing_article_optimization",
            articleId: post.id,
            contentHash,
            promptVersion: "v2",
            resultJson: aiResponse,
          });
        }
      } catch (aiErr) {
        console.warn("[BlogOptimizer] AI enrichment skipped or failed, using rule-based diff:", aiErr.message);
      }
    }

    const finalProposedTitle = aiEnhanced?.proposed_title || proposedTitle;
    const finalProposedDesc = aiEnhanced?.proposed_meta_description || proposedDesc;
    const finalProposedH1 = aiEnhanced?.proposed_h1 || post.title_tr;
    const finalMissingSubtopics = aiEnhanced?.missing_subtopics || missingSubtopics;
    const finalMissingEntities = aiEnhanced?.missing_entities || ["Core Web Vitals", "Conversion Rate", "Schema Markup"];
    const finalFaqs = aiEnhanced?.new_faq_section || proposedFaq;

    // Build the enhanced content without destroying existing content
    const faqHtml = `
      <div class="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
        <h3 class="text-xl font-bold text-slate-900 mb-4">Sıkça Sorulan Sorular (${query})</h3>
        ${finalFaqs
          .map(
            (f) => `
          <div class="mb-4">
            <h4 class="font-bold text-teal-800 text-sm mb-1">${f.q}</h4>
            <p class="text-slate-700 text-sm">${f.a}</p>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    const addedContent = aiEnhanced?.additional_html_content || `
      <h3>${finalMissingSubtopics[0]}</h3>
      <p>E-ticaret sitelerinde ${query} çalışmalarının başarıya ulaşması için yalnızca anahtar kelime yerleşimi yeterli değildir. Kullanıcıların arama niyetini (search intent) karşılayan doğrudan yanıt blokları ve hızlı açılan mobil arayüzler sıralamanızı doğrudan ilk 3'e taşır.</p>
    `;

    const proposedContent = `${currentContent}\n\n${addedContent}\n\n${faqHtml}`;

    return {
      post_id: post.id,
      post_slug: post.slug,
      target_query: query,
      metrics: {
        position: currentPosition,
        impressions: currentImpressions,
        ctr: currentCtr,
        clicks: metrics.clicks || 0,
      },
      before: {
        title: currentTitle,
        h1: post.title_tr,
        meta_description: currentDesc,
        content_length: currentContent.length,
      },
      after: {
        title: finalProposedTitle,
        h1: finalProposedH1,
        meta_description: finalProposedDesc,
        proposed_content_html: proposedContent,
        content_length: proposedContent.length,
      },
      diff_elements: {
        missing_subtopics: finalMissingSubtopics,
        missing_entities: finalMissingEntities,
        proposed_faqs: finalFaqs,
        proposed_internal_links: proposedLinks,
        added_html_snippet: `${addedContent}\n${faqHtml}`,
      },
      status: "pending_user_approval",
    };
  }
}

module.exports = BlogOptimizer;
