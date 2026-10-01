import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AIDemo() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('fashion');
  const [features, setFeatures] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [stepText, setStepText] = useState('');

  const generateDescription = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setResult('');
    
    // Simulate multi-stage AI process
    const steps = [
      'Yapay zeka motoru başlatılıyor...',
      'Semantik analiz yapılıyor...',
      'E-ticaret dönüşüm odaklı anahtar kelimeler seçiliyor...',
      'Metin SEO kurallarına göre düzenleniyor...'
    ];

    let stepIdx = 0;
    setStepText(steps[0]);

    const stepInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setStepText(steps[stepIdx]);
      }
    }, 450);

    setTimeout(() => {
      clearInterval(stepInterval);
      
      const featureList = features
        ? features.split(',').map(f => f.trim()).filter(Boolean)
        : ['Premium Malzeme Kalitesi', 'Kullanıcı Dostu Ergonomik Tasarım', 'Hızlı ve Kolay Entegrasyon'];

      let descriptionText = '';
      
      // Dynamic content generator based on category
      if (category === 'fashion') {
        descriptionText = `🚀 **${name} - Şıklık ve Konforun Mükemmel Uyumu**

E-ticaret vitrininizin en göz alıcı parçası olmaya aday **${name}**, modern çizgileri ve estetik duruşuyla stilinizi bir adım öne taşıyor. Hem günlük kombinlerinizde rahatlığı yakalamanız hem de şık davetlerde bakışları üzerinize çekmeniz için özel olarak tasarlandı.

### 🌟 Öne Çıkan Özellikler:
${featureList.map(f => `- **${f}**: Sınıfının en iyi standartları ile üretilmiştir.`).join('\n')}
- **%100 Yerli Üretim**: Yüksek kalite işçilik güvencesiyle.

### 💡 Neden Tercih Etmelisiniz?
* **Dönüşüm Odaklı Tasarım:** Yumuşak dokusu ve nefes alan yapısı sayesinde gün boyu sürtünmeyi önler, rahatlık sunar.
* **Kolay Bakım:** Renk solmasına ve yıpranmaya karşı dayanıklı malzeme yapısı.
* **Hızlı Kargo:** Saat 16:00'dan önce verilen siparişlerde aynı gün kargo avantajı!`;
      } else if (category === 'electronics') {
        descriptionText = `⚡ **${name} - Yeni Nesil Akıllı Teknoloji Çözümü**

Performans ve inovasyonu bir arada arayanlar için tasarlanan **${name}**, günlük dijital iş akışlarınızı optimize etmek için geliştirildi. Kompakt tasarımıyla taşıma kolaylığı sunarken, üstün işlem kapasitesiyle zamandan tasarruf etmenizi sağlar.

### 📊 Teknik ve Yapısal Özellikler:
${featureList.map(f => `- **${f}**: Maksimum verimlilik için optimize edilmiş donanım mimarisi.`).join('\n')}
- **Düşük Enerji Tüketimi**: Çevre dostu batarya/güç yönetimi.

### 🎯 Kullanıcı Deneyimi Avantajları:
* **Hızlı Kurulum:** Saniyeler içinde kullanıma hazır (Tak-Çalıştır).
* **Uzun Ömürlü Dayanıklılık:** Darbelere karşı güçlendirilmiş dış kasa yapısı.
* **Müşteri Memnuniyeti:** 2 yıl resmi distribütör garantisi ve anında teknik destek.`;
      } else if (category === 'home') {
        descriptionText = `🏡 **${name} - Evinizde Modern ve Estetik Esintiler**

Yaşam alanlarınıza şıklık katacak **${name}**, minimal tasarımı ve yüksek işlevselliğiyle evinizin havasını değiştirecek. Kaliteli işçilik ve modern mimarinin birleşimiyle hem dekoratif bir zenginlik sunar hem de hayatınızı kolaylaştırır.

### ✨ Detaylar ve Özellikler:
${featureList.map(f => `- **${f}**: Evinizin estetik dokusuna mükemmel uyum.`).join('\n')}

### 🛡️ Neden Evinizin Vazgeçilmezi Olacak?
* **Kolay Temizlik:** Leke tutmayan ve pratik temizlenebilir premium yüzey dokusu.
* **Ergonomik Yapı:** Evde alan tasarrufu sağlayan akılcı boyutlar.
* **Doğal ve Güvenli:** Sağlığa zararsız ham maddelerden üretilmiştir.`;
      } else if (category === 'cosmetics') {
        descriptionText = `✨ **${name} - Cildinize Hak Ettiği Premium Bakım**

Doğallığı ve bilimi bir araya getiren **${name}**, cildinizin doğal ışıltısını koruması ve derinlemesine beslenmesi için formüle edildi. Günlük bakım rutininizin en değerli adımı olacak bu özel formül, ilk kullanımdan itibaren fark edilebilir canlılık kazandırır.

### 🍃 Formülün Gücü ve Özellikleri:
${featureList.map(f => `- **${f}**: Cildinizde pürüzsüz ve tazeleyici etki sunar.`).join('\n')}

### 🔬 Neden Bu Ürünü Seçmelisiniz?
* **Dermatolojik Olarak Test Edildi:** Tüm cilt tipleri için güvenle kullanılabilir hassas formül.
* **Hızlı Emilim:** Yağlı his bırakmayan hafif yapı.
* **Doğal Bileşenler:** Kimyasal koruyucular ve paraben içermeyen formülasyon.`;
      } else {
        descriptionText = `🍏 **${name} - Doğal, Sağlıklı ve Lezzetli Seçim**

Sofralarınıza lezzet ve sağlık taşımak için özenle üretilen **${name}**, katkısız ve organik yapısıyla öne çıkıyor. Geleneksel yöntemlerle hazırlanan lezzet profili sayesinde besin değerlerini kaybetmeden en saf haliyle sunulmaktadır.

### 📦 Ürün Detayları:
${featureList.map(f => `- **${f}**: Doğal kaynaklardan elde edilen saf besin değerleri.`).join('\n')}

### 💎 Neden Güvenle Tüketebilirsiniz?
* **%100 Organik:** Katkı maddesi, renklendirici ve yapay tatlandırıcı içermez.
* **Tazelik Garantisi:** Özel korumalı ambalajında ilk günkü tazeliğiyle teslimat.
* **Yüksek Besleyici Değer:** Sağlıklı beslenme rutininiz için zengin bileşim.`;
      }

      setResult(descriptionText);
      setLoading(false);
    }, 1800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 relative overflow-hidden text-left shadow-[0_12px_40px_-8px_rgba(15,23,42,0.06)]">
      
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
          <Sparkles size={18} />
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">{t('ai_generator.title')}</h3>
      </div>
      <p className="text-slate-600 text-sm font-normal mb-8 leading-relaxed">
        {t('ai_generator.subtitle')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Input */}
        <form onSubmit={generateDescription} className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ai-name" className="text-xs font-bold text-slate-700">{t('ai_generator.label_name')}</label>
            <input
              id="ai-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('ai_generator.placeholder_name')}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="ai-category" className="text-xs font-bold text-slate-700">{t('ai_generator.label_category')}</label>
            <select
              id="ai-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
            >
              <option value="fashion">{t('ai_generator.categories.fashion')}</option>
              <option value="electronics">{t('ai_generator.categories.electronics')}</option>
              <option value="home">{t('ai_generator.categories.home')}</option>
              <option value="cosmetics">{t('ai_generator.categories.cosmetics')}</option>
              <option value="food">{t('ai_generator.categories.food')}</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="ai-features" className="text-xs font-bold text-slate-700">{t('ai_generator.label_features')}</label>
            <textarea
              id="ai-features"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder={t('ai_generator.placeholder_features')}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs sm:text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
          >
            {loading ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>{t('ai_generator.btn_generating')}</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>{t('ai_generator.btn_generate')}</span>
              </>
            )}
          </button>
        </form>

        {/* Console/Terminal Output */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between min-h-[300px] relative text-slate-200 shadow-inner">
          
          {loading && (
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center gap-3 z-10">
              <RefreshCw size={24} className="text-teal-400 animate-spin" />
              <span className="font-mono text-xs text-slate-300 font-bold uppercase tracking-wider animate-pulse">{stepText}</span>
            </div>
          )}

          <div className="w-full">
            {/* Window header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500/80" />
              </div>
              <span className="font-mono text-[10px] text-slate-400 font-bold tracking-widest">
                AI_SEO_OUTPUT.MD
              </span>
            </div>

            {/* Generated Content Box */}
            <div className="font-mono text-xs leading-relaxed text-slate-300 max-h-[220px] overflow-y-auto whitespace-pre-wrap">
              {result ? (
                result
              ) : (
                <span className="text-slate-500 italic">
                  // {t('ai_generator.placeholder_console')}
                </span>
              )}
            </div>
          </div>

          {/* Output Footer */}
          {result && (
            <div className="flex justify-between items-center pt-4 border-t border-slate-800 mt-4">
              <span className="text-[11px] text-teal-400 font-semibold flex items-center gap-1">
                ✓ %100 SEO & CRO Uyumlu
              </span>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check size={13} className="text-teal-400" /> : <Copy size={13} />}
                <span>{copied ? 'KOPYALANDI' : 'KOPYALA'}</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Interactive CTA Banner */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <p className="text-slate-600 text-xs leading-relaxed font-medium max-w-xl">
          {t('ai_generator.cta')}
        </p>
        <Link
          to="/iletisim?service=urun-gorsel"
          className="px-5 py-2.5 bg-orange-50 border border-orange-200 hover:bg-orange-500 hover:text-white text-orange-700 rounded-xl font-display text-xs font-bold tracking-wide uppercase transition-all whitespace-nowrap self-stretch md:self-auto text-center shadow-xs"
        >
          {t('nav.cta')}
        </Link>
      </div>

    </div>
  );
}
