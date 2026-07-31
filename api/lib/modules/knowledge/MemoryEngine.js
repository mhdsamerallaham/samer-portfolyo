/**
 * MemoryEngine — Historical Content Memory & Anti-Duplication Engine
 *
 * Checks historical knowledge chunks and published articles to prevent
 * repeating identical explanations across multiple posts.
 */

class MemoryEngine {
  static checkMemory(topicTitle = '', existingArticles = []) {
    const titleLower = topicTitle.toLowerCase();
    const duplicates = existingArticles.filter(
      (article) => (article.title_tr || '').toLowerCase() === titleLower
    );

    return {
      isDuplicate: duplicates.length > 0,
      existingCount: existingArticles.length,
      recommendation: duplicates.length > 0 ? 'Skip synthesis or update existing article' : 'Proceed with fresh synthesis',
    };
  }
}

module.exports = MemoryEngine;
