/**
 * KnowledgeEngine — Atomic Knowledge Chunk Extractor & Normalizer
 *
 * Normalizes facts into reusable knowledge chunks linked to Entities.
 */

class KnowledgeEngine {
  static normalizeKnowledge(rawFacts = [], entity = null) {
    return rawFacts.map((fact) => ({
      fact_statement: fact,
      entity_slug: entity ? entity.slug : 'general',
      verifiability_score: 0.95,
      source_type: 'official_doc',
      created_at: new Date().toISOString(),
    }));
  }
}

module.exports = KnowledgeEngine;
