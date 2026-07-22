/**
 * ExpertInterviewEngine — EEAT Expert QA & Experience Injector
 *
 * Provides real human practitioner perspectives, common pitfalls,
 * expert quotes, and practical implementation recommendations.
 */

class ExpertInterviewEngine {
  static getExpertContext(category = 'e-commerce') {
    return {
      expert_name: 'Samer Allaham',
      expert_role: 'Senior E-Commerce & Full Stack Software Architect',
      experience_years: 8,
      key_takeaways: [
        'Sadece tema değiştirmek hızı artırmaz; gereksiz JS eklentilerini temizlemek ve WebP dönüştürmek ilk adımdır.',
        'Ödeme adımındaki her ekstra form alanı dönüşüm oranını %10 ila %15 oranında düşürür.',
        'Yerel pazar için İKAS sunucu hızı açısından avantajlıyken, küresel pazarda Shopify ekosistemi öne çıkar.',
      ],
      practical_recommendation: 'Tek sayfada ödeme (One-Page Checkout) ve mobil öncelikli performans optimizasyonu uygulayın.',
    };
  }
}

module.exports = ExpertInterviewEngine;
