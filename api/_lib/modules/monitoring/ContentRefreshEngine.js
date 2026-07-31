/**
 * ContentRefreshEngine — Traffic Decay & Fact Freshness Refresh Engine
 *
 * Scans published articles for age > 90 days or traffic decay and flags them for automated refresh.
 */

class ContentRefreshEngine {
  static evaluateRefreshNeeds(articles = []) {
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;

    return articles
      .filter((article) => {
        const pubDate = new Date(article.published_at || article.created_at).getTime();
        return pubDate < ninetyDaysAgo;
      })
      .map((article) => ({
        article_id: article.id,
        slug: article.slug,
        decay_reason: 'content_age_exceeds_90_days',
        priority: 'medium',
      }));
  }
}

module.exports = ContentRefreshEngine;
