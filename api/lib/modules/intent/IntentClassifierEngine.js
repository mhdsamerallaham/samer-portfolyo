/**
 * IntentClassifierEngine — Search Intent & Content Layout Classification
 *
 * Classifies topics into 5 core search intent categories:
 * - informational
 * - commercial
 * - troubleshooting
 * - definition (GEO/AEO FAQ)
 * - comparison
 */

class IntentClassifierEngine {
  static classifyIntent(title = '') {
    const text = title.toLowerCase();

    if (text.includes('vs') || text.includes('kıyas') || text.includes('karşılaştırma') || text.includes('or')) {
      return {
        intent: 'comparison',
        contentType: 'Comparison',
        targetLayout: 'comparison',
        recommendedSchema: 'ItemPage',
      };
    }

    if (text.includes('nasıl') || text.includes('hata') || text.includes('düşürme') || text.includes('çözüm') || text.includes('how to')) {
      return {
        intent: 'troubleshooting',
        contentType: 'Tutorial',
        targetLayout: 'guide',
        recommendedSchema: 'HowTo',
      };
    }

    if (text.includes('nedir') || text.includes('ne demek') || text.includes('what is') || text.includes('?')) {
      return {
        intent: 'definition',
        contentType: 'FAQ',
        targetLayout: 'faq',
        recommendedSchema: 'DefinedTerm',
      };
    }

    if (text.includes('en iyi') || text.includes('fiyat') || text.includes('seçimi') || text.includes('best')) {
      return {
        intent: 'commercial',
        contentType: 'Guide',
        targetLayout: 'article',
        recommendedSchema: 'Product',
      };
    }

    return {
      intent: 'informational',
      contentType: 'Guide',
      targetLayout: 'article',
      recommendedSchema: 'Article',
    };
  }
}

module.exports = IntentClassifierEngine;
