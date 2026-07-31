/**
 * EntityEngine — Entity Extraction, Normalization & Knowledge Graph Manager
 */

const KNOWN_ENTITIES = [
  { name: 'Shopify', slug: 'shopify', type: 'Platform', website: 'https://www.shopify.com', schema: 'SoftwareApplication' },
  { name: 'İKAS', slug: 'ikas', type: 'Platform', website: 'https://ikas.com', schema: 'SoftwareApplication' },
  { name: 'Core Web Vitals', slug: 'core-web-vitals', type: 'Metric', website: 'https://web.dev/vitals/', schema: 'DefinedTerm' },
  { name: 'Conversion Rate', slug: 'conversion-rate', type: 'Metric', website: null, schema: 'DefinedTerm' },
  { name: 'Next.js', slug: 'nextjs', type: 'Framework', website: 'https://nextjs.org', schema: 'SoftwareApplication' },
  { name: 'React', slug: 'react', type: 'Library', website: 'https://react.dev', schema: 'SoftwareApplication' },
];

class EntityEngine {
  static extractEntitiesFromText(text = '') {
    const found = [];
    const lower = text.toLowerCase();

    for (const entity of KNOWN_ENTITIES) {
      if (lower.includes(entity.name.toLowerCase()) || lower.includes(entity.slug)) {
        found.push(entity);
      }
    }

    return found;
  }
}

module.exports = EntityEngine;
