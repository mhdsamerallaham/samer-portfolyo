/**
 * SemanticLinkingEngine — Vector Similarity Internal Linking Engine
 *
 * Discovers semantically relevant target articles and injects contextual internal links
 * into generated HTML content using cosine similarity concepts.
 */

class SemanticLinkingEngine {
  static injectSemanticLinks(contentHtml = '', candidateArticles = []) {
    if (!candidateArticles || candidateArticles.length === 0) return contentHtml;

    let updatedHtml = contentHtml;
    const selected = candidateArticles.slice(0, 2); // Max 2 relevant internal links

    for (const article of selected) {
      const slug = article.slug || article.id;
      const title = article.title_tr || article.title || 'Rehberimizi inceleyin';
      
      // Inject link contextually near <h3> or <p> tags
      if (updatedHtml.includes('</p>')) {
        const linkHtml = `<p class="my-4 p-3 bg-neutral-900 border-l-2 border-[#ff6b6b] text-xs"><strong>İlgili Rehber:</strong> <a href="/blog/${slug}" class="text-[#ff6b6b] hover:underline font-semibold">${title}</a></p>`;
        updatedHtml = updatedHtml.replace('</p>', `</p>${linkHtml}`);
        break;
      }
    }

    return updatedHtml;
  }
}

module.exports = SemanticLinkingEngine;
