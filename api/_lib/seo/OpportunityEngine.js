/**
 * OpportunityEngine.js — Deterministic, Rule-Based Keyword Opportunity Engine
 *
 * Evaluates Search Console performance rows and maps them against live blog posts
 * and site URLs to detect actionable optimization opportunities WITHOUT requiring AI.
 *
 * Rules:
 * 1. Position 1-3 + Low CTR -> TITLE_META_OPPORTUNITY (Title & Meta Tag CTR Booster)
 * 2. Position 4-10 + Good Impression -> HIGH_PRIORITY_OPPORTUNITY (First Page Boost)
 * 3. Position 11-20 + Good Impression -> CONTENT_ONPAGE_OPPORTUNITY (Page 2 to Page 1)
 * 4. Multiple URLs ranking for same query -> KEYWORD_CANNIBALIZATION
 * 5. High Impression query without focused content -> NEW_KEYWORD_OPPORTUNITY
 *
 * STRICT GOAL: Prioritize "UPDATE EXISTING ARTICLE" over creating new articles.
 */

class OpportunityEngine {
  /**
   * Analyzes GSC rows and compares against existing blog posts
   * @param {Array} gscRows [{ query, page, clicks, impressions, ctr, position }]
   * @param {Array} existingPosts [{ slug, title_tr, content_tr }]
   */
  static analyzeOpportunities(gscRows = [], existingPosts = []) {
    if (!Array.isArray(gscRows) || gscRows.length === 0) {
      return {
        summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0, cannibalizationCount: 0 },
        opportunities: [],
        cannibalizations: [],
      };
    }

    // 1. Group & aggregate rows by query + page so metrics represent overall performance
    const queryMap = new Map(); // For cannibalization detection
    const pageQueryAgg = new Map(); // For per-URL opportunity scoring

    for (const row of gscRows) {
      const q = (row.query || "").trim().toLowerCase();
      if (!q) continue;

      if (!queryMap.has(q)) {
        queryMap.set(q, []);
      }
      queryMap.get(q).push(row);

      const pageKey = `${q}::${row.page || ""}`;
      if (!pageQueryAgg.has(pageKey)) {
        pageQueryAgg.set(pageKey, {
          query: row.query,
          page: row.page || "",
          clicks: 0,
          impressions: 0,
          weightedPosSum: 0,
          is_demo: Boolean(row.is_demo),
        });
      }
      const agg = pageQueryAgg.get(pageKey);
      agg.clicks += (row.clicks || 0);
      agg.impressions += (row.impressions || 0);
      agg.weightedPosSum += (row.position || 0) * (row.impressions || 1);
    }

    // 2. Detect Cannibalization
    const cannibalizations = [];
    for (const [query, rows] of queryMap.entries()) {
      if (rows.length > 1) {
        const uniquePages = [...new Set(rows.map((r) => r.page).filter(Boolean))];
        if (uniquePages.length > 1) {
          const totalImpressions = rows.reduce((s, r) => s + (r.impressions || 0), 0);
          cannibalizations.push({
            query,
            pages: uniquePages,
            totalImpressions,
            severity: totalImpressions > 500 ? "high" : "medium",
            recommendation: `Bu arama sorgusunda birden fazla sayfa sıralama rekabetine giriyor (${uniquePages.join(" vs ")}). Tek bir ana sayfayı kanonik veya 301 yönlendirmesiyle yetkilendirin.`,
          });
        }
      }
    }

    // 3. Flatten aggregated query-page pairs
    const aggregatedRows = Array.from(pageQueryAgg.values()).map((agg) => {
      const impressions = agg.impressions;
      const clicks = agg.clicks;
      const position = impressions > 0 ? Number((agg.weightedPosSum / impressions).toFixed(1)) : 0;
      const ctr = impressions > 0 ? Number((clicks / impressions).toFixed(4)) : 0;
      return {
        query: agg.query,
        page: agg.page,
        clicks,
        impressions,
        ctr,
        position,
        is_demo: agg.is_demo,
      };
    });

    // 4. Score opportunities for each aggregated row
    const opportunities = [];

    for (const row of aggregatedRows) {
      const { query, page, clicks, impressions, ctr, position } = row;
      const cleanPage = page || "";

      // Find matching existing blog post if any
      const matchingPost = existingPosts.find((p) => {
        if (!p || !p.slug) return false;
        return (
          cleanPage.includes(p.slug) ||
          query.toLowerCase().includes((p.slug || "").replace(/-/g, " ").toLowerCase()) ||
          (p.title_tr || "").toLowerCase().includes(query.toLowerCase())
        );
      });

      let opp = null;

      // RULE 1: Position 1-3 & Low CTR -> Title / Meta Opportunity
      if (position >= 1.0 && position <= 3.9 && impressions >= 5 && ctr < 0.05) {
        const score = Math.min(95, Math.round(75 + Math.min(20, (impressions / 100) * 20)));
        opp = {
          opportunity_type: "title_ctr",
          priority: score >= 85 ? "high" : "medium",
          opportunity_score: score,
          target_query: query,
          target_page: cleanPage,
          current_position: position,
          impressions,
          clicks,
          ctr,
          action_type: matchingPost ? "update_existing_article" : "title_meta_only",
          reason: `Zirve sıralamada (Pozisyon ${position}) yer alıyor fakat tıklama oranı düşük. Kullanıcılar başlığa veya meta açıklamaya tıklamadan geçiyor.`,
          recommendation_summary: "Meta Title ve Description etiketini ilgi çekici, harekete geçirici (CTR booster) ifadelerle yenileyin.",
          matched_post_slug: matchingPost ? matchingPost.slug : null,
          matched_post_title: matchingPost ? matchingPost.title_tr : null,
        };
      }
      // RULE 2: Position 4-10 + Good Impressions -> HIGH/CRITICAL PRIORITY (First Page Boost)
      else if (position >= 4.0 && position <= 10.9 && impressions >= 20) {
        const score = Math.min(98, Math.round(82 + Math.min(16, (impressions / 200) * 16)));
        opp = {
          opportunity_type: "position_4_10",
          priority: "critical",
          opportunity_score: score,
          target_query: query,
          target_page: cleanPage,
          current_position: position,
          impressions,
          clicks,
          ctr,
          action_type: "update_existing_article",
          reason: `Sayfa 1'de üst sıralara tırmanma aşamasında (Pozisyon ${position}, ${impressions} gösterim). Mevcut içerik zenginleştirilip iç link takviyesi yapılırsa ilk 3'e sıçrayarak organik trafiği katlayabilir.`,
          recommendation_summary: matchingPost
            ? `Mevcut "${matchingPost.title_tr}" yazısına bu sorguya özel H2 alt başlık, doğrudan yanıt kutusu ve 2 adet iç link ekleyin.`
            : "İlgili ana sayfa veya hizmet sayfasına bu konuya yönelik net açıklamalar, alt başlık ve iç link ekleyin.",
          matched_post_slug: matchingPost ? matchingPost.slug : null,
          matched_post_title: matchingPost ? matchingPost.title_tr : null,
        };
      }
      // RULE 3: Position 11-20 -> Page 2 Breakthrough Opportunity
      else if (position >= 11.0 && position <= 20.9 && impressions >= 10) {
        const score = Math.min(88, Math.round(65 + Math.min(23, (impressions / 150) * 23)));
        opp = {
          opportunity_type: "position_11_20",
          priority: "high",
          opportunity_score: score,
          target_query: query,
          target_page: cleanPage,
          current_position: position,
          impressions,
          clicks,
          ctr,
          action_type: "update_existing_article",
          reason: `Sayfa 2'de yer alıyor (Pozisyon ${position}). Google bu sorguyu sitenizle ilişkilendiriyor, içerik güçlendirilirse Sayfa 1'e girebilir.`,
          recommendation_summary: "Mevcut yazıyı eksik alt başlıklar, kullanıcı soruları ve teknik detaylarla güncelleyin.",
          matched_post_slug: matchingPost ? matchingPost.slug : null,
          matched_post_title: matchingPost ? matchingPost.title_tr : null,
        };
      }
      // RULE 4: Beyond Page 2 but good impressions -> Content Gap or New Keyword
      else if (impressions >= 30 && position > 20.0 && !matchingPost) {
        opp = {
          opportunity_type: "new_keyword",
          priority: "medium",
          opportunity_score: 65,
          target_query: query,
          target_page: cleanPage,
          current_position: position,
          impressions,
          clicks,
          ctr,
          action_type: "new_article",
          reason: `Sitede bu sorguyu derinlemesine işleyen özel bir makale bulunmuyor ancak Google sitenizi bu konuyla ilişkilendiriyor (${impressions} gösterim).`,
          recommendation_summary: "Bu sorgu için hedeflenmiş yeni bir rehber makale taslağı hazırlayın.",
          matched_post_slug: null,
          matched_post_title: null,
        };
      }

      if (opp) {
        opportunities.push(opp);
      }
    }

    // Sort opportunities descending by score
    opportunities.sort((a, b) => b.opportunity_score - a.opportunity_score);

    const summary = {
      total: opportunities.length,
      critical: opportunities.filter((o) => o.priority === "critical").length,
      high: opportunities.filter((o) => o.priority === "high").length,
      medium: opportunities.filter((o) => o.priority === "medium").length,
      low: opportunities.filter((o) => o.priority === "low").length,
      cannibalizationCount: cannibalizations.length,
    };

    return {
      summary,
      opportunities,
      cannibalizations,
    };
  }
}

module.exports = OpportunityEngine;
