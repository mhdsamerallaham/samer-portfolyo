/**
 * InternalLinkEngine.js — Contextual & Natural Internal Link Optimization Engine
 *
 * Scans published blog posts to identify high-value, semantic internal linking opportunities.
 *
 * Anti-Spam Guidelines:
 * 1. Maximum 2-3 links added per article.
 * 2. Anchor variations: Avoid repeating identical exact-match anchors across multiple articles.
 * 3. Never link to the same target URL more than once within the same article.
 * 4. Contextual embedding: Links are placed naturally within relevant paragraphs.
 */

class InternalLinkEngine {
  /**
   * Site core service targets
   */
  static getServiceTargets() {
    return [
      {
        url: "/eticaret-optimizasyon",
        name: "E-Ticaret Dönüşüm ve Hız Optimizasyonu (CRO)",
        keywords: ["dönüşüm oranı", "hız optimizasyonu", "core web vitals", "sepet terk", "cro"],
        anchors: [
          "e-ticaret dönüşüm optimizasyonu",
          "sayfa hızı ve CRO iyileştirmesi",
          "dönüşüm artıran UX stratejileri",
        ],
      },
      {
        url: "/eticaret-site-kurulumu",
        name: "E-Ticaret Site Kurulumu",
        keywords: ["shopify kurulumu", "ikas kurulum", "online mağaza açma", "e-ticaret sitesi kurma"],
        anchors: [
          "profesyonel e-ticaret sitesi kurulumu",
          "Shopify ve İKAS mağaza kurulumu",
          "anahtar teslim e-ticaret altyapısı",
        ],
      },
      {
        url: "/web-tasarim",
        name: "Web Tasarım & Yazılım",
        keywords: ["web tasarım", "kurumsal web sitesi", "react web sitesi", "modern web tasarımı"],
        anchors: [
          "profesyonel web tasarım hizmeti",
          "modern ve SEO uyumlu web tasarımı",
          "React ve Next.js tabanlı kurumsal site geliştirme",
        ],
      },
      {
        url: "/stok-ve-depo-sistemi",
        name: "Stok ve Depo Otomasyonu",
        keywords: ["stok senkronizasyonu", "depo yönetimi", "pazaryeri entegrasyonu", "trendyol stok"],
        anchors: [
          "pazaryeri stok ve depo otomasyonu",
          "çift yönlü stok senkronizasyon sistemi",
          "otomatik envanter ve sipariş yönetimi",
        ],
      },
    ];
  }

  /**
   * Discovers internal link suggestions for a target post among all articles & services
   * @param {Object} post Current blog post { id, slug, title_tr, content_tr }
   * @param {Array} allPosts All blog_posts rows
   */
  static discoverLinkOpportunities(post, allPosts = []) {
    if (!post || !post.content_tr) return [];

    const content = post.content_tr;
    const suggestions = [];
    const usedTargets = new Set();
    const serviceTargets = this.getServiceTargets();

    // 1. Check Service Page Opportunities
    for (const service of serviceTargets) {
      if (usedTargets.has(service.url)) continue;

      for (const kw of service.keywords) {
        const regex = new RegExp(`(^|\\s|[.,;])(${kw})([.,;]|\\s|$)`, "i");
        const match = content.match(regex);

        if (match && !content.includes(`href="${service.url}"`)) {
          // Select a varied anchor text
          const anchor = service.anchors[Math.floor(Math.random() * service.anchors.length)];
          suggestions.push({
            type: "service_link",
            source_slug: post.slug,
            source_title: post.title_tr,
            target_url: service.url,
            target_name: service.name,
            matched_keyword: kw,
            recommended_anchor: anchor,
            relevance_score: 0.95,
            reason: `Yazı içinde geçen "${kw}" ifadesi doğrudan ilgili hizmet sayfanızla (${service.name}) eşleşiyor.`,
          });
          usedTargets.add(service.url);
          break;
        }
      }

      if (suggestions.length >= 2) break; // Max 2 service links
    }

    // 2. Check Other Related Blog Post Opportunities
    const otherPosts = (allPosts || []).filter(
      (p) => p.slug && p.slug !== post.slug && !content.includes(`href="/blog/${p.slug}"`)
    );

    for (const other of otherPosts) {
      if (suggestions.length >= 4) break; // Max 4 total suggestions (2 service + 2 blog)

      const otherWords = (other.title_tr || "")
        .toLowerCase()
        .replace(/[^a-z0-9ğüşıöç ]/gi, "")
        .split(" ")
        .filter((w) => w.length > 4);

      for (const word of otherWords) {
        if (content.toLowerCase().includes(word)) {
          suggestions.push({
            type: "blog_link",
            source_slug: post.slug,
            source_title: post.title_tr,
            target_url: `/blog/${other.slug}`,
            target_name: other.title_tr,
            matched_keyword: word,
            recommended_anchor: other.title_tr,
            relevance_score: 0.85,
            reason: `Bu makale, "${other.title_tr}" başlıklı diğer rehberinizle tematik olarak örtüşüyor.`,
          });
          usedTargets.add(other.slug);
          break;
        }
      }
    }

    return suggestions;
  }
}

module.exports = InternalLinkEngine;
