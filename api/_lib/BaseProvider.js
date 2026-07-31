/**
 * BaseProvider — Tüm AI sağlayıcıları için soyut temel sınıf.
 * Her sağlayıcı bu sınıfı extend etmeli ve chat() metodunu implement etmelidir.
 */
class BaseProvider {
  /**
   * @param {string} name — Loglarda görünecek sağlayıcı adı
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * AI'ya mesaj gönder ve ham metin yanıtı al.
   * @param {Array<{role: string, content: string}>} messages
   * @param {Object} options
   * @param {number} [options.maxTokens=2500]
   * @param {boolean} [options.jsonMode=true]
   * @returns {Promise<string>} — Ham metin yanıtı
   */
  async chat(messages, options = {}) {
    throw new Error(`${this.name}: chat() metodu implement edilmemiş.`);
  }

  /**
   * Sağlayıcının sağlık durumunu kontrol et.
   * @returns {Promise<{healthy: boolean, error?: string}>}
   */
  async health() {
    try {
      await this.chat([{ role: "user", content: "ping" }], { maxTokens: 5, jsonMode: false });
      return { healthy: true };
    } catch (err) {
      return { healthy: false, error: err.message };
    }
  }
}

module.exports = BaseProvider;
