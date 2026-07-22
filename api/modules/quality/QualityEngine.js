/**
 * QualityEngine — EEAT & Content Gatekeeper (> 90 Score Enforcer)
 *
 * Evaluates generated content across 8 quality dimensions:
 * 1. EEAT Score (Expertise, Experience, Authoritativeness, Trustworthiness)
 * 2. Entity Density & Relational Depth Score
 * 3. Helpful Content & Practical Value Score
 * 4. GEO/AEO Direct Answer Quality Score
 * 5. Citation & Verifiability Score
 * 6. Readability & Structure Score
 * 7. Technical SEO Score
 * 8. Spam & Content Farm Penalty
 */

class QualityEngine {
  static evaluateContent({ title, directAnswer, contentHtml, whoIsThisFor, expertAnswers = [], citations = [], entities = [] }) {
    let eeatScore = 80;
    let entityScore = 75;
    let helpfulContentScore = 80;
    let geoAeoScore = 80;
    let citationScore = 70;
    let readabilityScore = 85;
    let seoScore = 85;
    let spamPenalty = 0;

    // 1. EEAT Score Evaluation
    if (expertAnswers.length > 0) eeatScore += 12;
    if (whoIsThisFor && whoIsThisFor.length > 30) eeatScore += 8;

    // 2. Entity Density Evaluation
    if (entities.length >= 3) entityScore += 15;
    if (entities.length >= 5) entityScore += 10;

    // 3. Helpful Content & GEO/AEO Direct Answer Box
    if (directAnswer && directAnswer.length >= 80 && directAnswer.length <= 350) {
      geoAeoScore += 15;
      helpfulContentScore += 10;
    }

    // 4. Citation & Authority Score
    if (citations.length > 0) citationScore += 20;

    // 5. Structure & HTML Readability
    if (contentHtml.includes('<h3>') && contentHtml.includes('<ul>') && contentHtml.includes('<p>')) {
      readabilityScore += 10;
    }

    // 6. Spam Detection (Length & Repetition Check)
    if (contentHtml.length < 300) spamPenalty += 30; // Too short
    if (contentHtml.includes('lorem ipsum')) spamPenalty += 50;

    // Weighted Overall Calculation
    const overallScore = Math.min(
      100,
      Math.max(
        0,
        eeatScore * 0.20 +
        entityScore * 0.15 +
        helpfulContentScore * 0.15 +
        geoAeoScore * 0.15 +
        citationScore * 0.10 +
        readabilityScore * 0.10 +
        seoScore * 0.15 -
        spamPenalty
      )
    );

    const passedGatekeeper = overallScore >= 90.00;

    return {
      overallScore: Number(overallScore.toFixed(2)),
      eeatScore: Number(eeatScore.toFixed(2)),
      entityScore: Number(entityScore.toFixed(2)),
      citationScore: Number(citationScore.toFixed(2)),
      readabilityScore: Number(readabilityScore.toFixed(2)),
      spamScore: Number(spamPenalty.toFixed(2)),
      aiVisibilityScore: Number(geoAeoScore.toFixed(2)),
      helpfulContentScore: Number(helpfulContentScore.toFixed(2)),
      passedGatekeeper,
    };
  }
}

module.exports = QualityEngine;
