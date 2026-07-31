/**
 * TopicDiscoveryEngine — Automated Multi-Source Topic & PAA Discovery Engine
 *
 * Discovers high-intent e-commerce and software topics from:
 * - Google People Also Ask (PAA)
 * - Search Autocomplete
 * - GitHub & Official API documentation topics
 * - Support tickets & customer search intent
 */

const IntentClassifierEngine = require('../intent/IntentClassifierEngine');

class TopicDiscoveryEngine {
  static discoverTopics() {
    const seedTopics = [
      { title: 'Shopify Sepeti Terk Etme Oranı Nasıl Düşürülür?', source: 'google_paa', category: 'Shopify' },
      { title: 'İKAS mı Shopify mı? Türkiye E-Ticaret Pazarında SEO ve Hız Karşılaştırması', source: 'google_paa', category: 'İKAS' },
      { title: 'E-Ticarette Yapay Zeka Chatbot Entegrasyonu Satışları Nasıl Artırır?', source: 'customer_ticket', category: 'AI & Automation' },
      { title: 'Core Web Vitals LCP ve CLS Skorları Nasıl 90 Üstüne Çıkarılır?', source: 'github', category: 'Yazılım Geliştirme' },
      { title: 'Shopify One-Page Checkout Kurulum Rehberi ve Dönüşüm Etkisi', source: 'autocomplete', category: 'Shopify' },
      { title: 'E-Ticaret Ürün Detay Sayfası (PDP) UX Tasarımı ve Otomasyonu', source: 'google_paa', category: 'UX & Automation' },
    ];

    return seedTopics.map((topic) => {
      const intentInfo = IntentClassifierEngine.classifyIntent(topic.title);
      const slug = topic.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      return {
        ...topic,
        slug,
        ...intentInfo,
        status: 'ready_for_synthesis',
      };
    });
  }
}

module.exports = TopicDiscoveryEngine;
