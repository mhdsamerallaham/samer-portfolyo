/**
 * PublishingEngine — Queue & Scheduled Dispatch Engine
 *
 * Manages publish queue, status transitions, and indexation pings.
 */

class PublishingEngine {
  static formatPublicationRecord(articleData, qualityAudit) {
    return {
      ...articleData,
      published_at: new Date().toISOString(),
      status: qualityAudit.passedGatekeeper ? 'published' : 'queued_for_review',
      quality_score: qualityAudit.overallScore,
    };
  }
}

module.exports = PublishingEngine;
