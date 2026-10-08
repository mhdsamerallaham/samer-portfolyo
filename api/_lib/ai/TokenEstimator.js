/**
 * TokenEstimator.js — AI Token Bütçe ve Boyut Tahmincisi
 *
 * Bir AI görevi çalıştırılmadan önce tahmini girdi, çıktı ve toplam token miktarını
 * hesaplar. Böylece sağlayıcının kalan güvenli kapasitesi (TPM/TPD) yetersizse
 * istek hiç gönderilmez ve kota aşımı baştan engellenir.
 */

// Görev tiplerine göre beklenen ortalama çıktı token bütçeleri
const TASK_OUTPUT_TOKEN_BUDGETS = {
  // P0 - Yüksek değerli GSC fırsatları
  position_4_10_boost: 2500,
  high_impression_query_target: 2000,

  // P1 - CTR, Başlık ve Meta optimizasyonları
  title_ctr: 300,
  meta_description: 250,
  h1_optimization: 200,

  // P2 - İçerik zenginleştirme & FAQ
  faq_generation: 1200,
  content_gap_analysis: 1800,
  internal_link_anchor: 600,
  existing_article_optimization: 3500,

  // P3 - Genel ve semantik iyileştirmeler
  new_article_generation: 5000,
  semantic_seo_analysis: 1500,
  keyword_intent_analysis: 800,

  // Varsayılan
  default: 1500,
};

class TokenEstimator {
  /**
   * Metin veya mesaj listesinin girdi token sayısını tahmin eder.
   * Türkçe ve teknik terimler için ortalama 1 token ≈ 3.6 karakter kabul edilir.
   *
   * @param {string|Array<{role: string, content: string}>} input
   * @returns {number}
   */
  static estimateInputTokens(input) {
    if (!input) return 0;

    let charCount = 0;
    if (typeof input === "string") {
      charCount = input.length;
    } else if (Array.isArray(input)) {
      charCount = input.reduce((acc, msg) => acc + (msg.content?.length || 0), 0);
    }

    // Karakter başı ortalama token (güvenlik payı için yukarı yuvarla)
    return Math.ceil(charCount / 3.6);
  }

  /**
   * Görev tipine göre beklenen çıktı token miktarını döndürür.
   * @param {string} taskType
   * @returns {number}
   */
  static estimateOutputTokens(taskType) {
    return TASK_OUTPUT_TOKEN_BUDGETS[taskType] || TASK_OUTPUT_TOKEN_BUDGETS.default;
  }

  /**
   * Bir görevin tüm token bütçesini hesaplar.
   *
   * @param {Object} params
   * @param {string} params.taskType
   * @param {string|Array} [params.prompt]
   * @param {number} [params.customOutputTokens]
   * @returns {{ inputTokens: number, outputTokens: number, totalTokens: number }}
   */
  static estimateTotalTokens({ taskType, prompt = "", customOutputTokens = null }) {
    const inputTokens = this.estimateInputTokens(prompt);
    const outputTokens = customOutputTokens || this.estimateOutputTokens(taskType);
    const totalTokens = inputTokens + outputTokens;

    return {
      inputTokens,
      outputTokens,
      totalTokens,
    };
  }
}

module.exports = TokenEstimator;
