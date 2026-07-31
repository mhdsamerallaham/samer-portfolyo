/**
 * SchemaEngine — Multi-Nested JSON-LD Structured Data Engine
 *
 * Generates Schema.org compliant structured data graphs for Search Engines (Google)
 * and AI Answer Engines (ChatGPT, Perplexity, Gemini, Claude).
 */

class SchemaEngine {
  static buildArticleSchema({ title, description, slug, date, author = 'Samer Allaham', entities = [] }) {
    const canonicalUrl = `https://www.samer.life/blog/${slug}`;

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': `${canonicalUrl}#article`,
          isPartOf: { '@id': canonicalUrl },
          headline: title,
          description,
          url: canonicalUrl,
          datePublished: date || new Date().toISOString(),
          dateModified: date || new Date().toISOString(),
          author: {
            '@type': 'Person',
            name: author,
            url: 'https://www.samer.life',
            jobTitle: 'E-Ticaret & Senior Software Architect',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Samer Allaham Consulting',
            url: 'https://www.samer.life',
          },
          about: entities.map((ent) => ({
            '@type': ent.schema_type || 'Thing',
            name: ent.name,
            sameAs: ent.official_website || undefined,
          })),
        },
        {
          '@type': 'WebPage',
          '@id': canonicalUrl,
          url: canonicalUrl,
          name: title,
          description,
        },
      ],
    };
  }

  static buildFAQSchema(faqs = []) {
    if (!Array.isArray(faqs) || faqs.length === 0) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.question_tr || item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.short_answer_tr || item.short_answer || item.answer_text,
        },
      })),
    };
  }
}

module.exports = SchemaEngine;
