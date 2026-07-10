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
    <div className="w-full max-w-4xl mx-auto bg-[#131b2e] border border-white/5 rounded-3xl p-6 md:p-10 relative overflow-hidden text-left">
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#ff6b6b]/5 rounded-full blur-[50px] pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 flex items-center justify-center text-[#ff6b6b]">
          <Sparkles size={16} />
        </div>
        <h3 className="text-xl md:text-2xl font-black text-white">{t('ai_generator.title')}</h3>
      </div>
      <p className="text-neutral-400 text-xs md:text-sm font-medium mb-8 leading-relaxed">
        {t('ai_generator.subtitle')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Input */}
        <form onSubmit={generateDescription} className="lg:col-span-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="mono text-[9px] font-black text-neutral-400 uppercase tracking-wider">{t('ai_generator.label_name')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('ai_generator.placeholder_name')}
              required
              className="w-full px-4 py-3 bg-[#0b0f19] border border-white/5 rounded-xl text-xs md:text-sm text-white focus:outline-none focus:border-[#ff6b6b]/40 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="mono text-[9px] font-black text-neutral-400 uppercase tracking-wider">{t('ai_generator.label_category')}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-[#0b0f19] border border-white/5 rounded-xl text-xs md:text-sm text-white focus:outline-none focus:border-[#ff6b6b]/40 transition-colors"
            >
              <option value="fashion">{t('ai_generator.categories.fashion')}</option>
              <option value="electronics">{t('ai_generator.categories.electronics')}</option>
              <option value="home">{t('ai_generator.categories.home')}</option>
              <option value="cosmetics">{t('ai_generator.categories.cosmetics')}</option>
              <option value="food">{t('ai_generator.categories.food')}</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="mono text-[9px] font-black text-neutral-400 uppercase tracking-wider">{t('ai_generator.label_features')}</label>
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder={t('ai_generator.placeholder_features')}
              rows={3}
              className="w-full px-4 py-3 bg-[#0b0f19] border border-white/5 rounded-xl text-xs md:text-sm text-white focus:outline-none focus:border-[#ff6b6b]/40 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#ff6b6b] hover:bg-[#ff5252] disabled:bg-neutral-800 disabled:text-neutral-500 text-white rounded-xl mono text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                {t('ai_generator.btn_generating')}
              </>
            ) : (
              <>
                <Sparkles size={14} />
                {t('ai_generator.btn_generate')}
              </>
            )}
          </button>
        </form>

        {/* Console/Terminal Output */}
        <div className="lg:col-span-7 bg-[#0b0f19] border border-white/5 rounded-2xl p-5 flex flex-col justify-between min-h-[300px] relative">
          
          {loading && (
            <div className="absolute inset-0 bg-[#0b0f19]/80 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center gap-4 z-10">
              <RefreshCw size={24} className="text-[#ff6b6b] animate-spin" />
              <span className="mono text-[10px] text-neutral-400 font-bold uppercase tracking-wider animate-pulse">{stepText}</span>
            </div>
          )}

          <div className="w-full">
            {/* Window header */}
            <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b6b]/20" />
              </div>
              <span className="mono text-[8px] font-black text-neutral-500 uppercase tracking-widest">AI_LOG_V2.0</span>
            </div>

            {result ? (
              <div className="text-left overflow-y-auto max-h-[220px] text-neutral-300 text-xs leading-relaxed whitespace-pre-wrap font-medium">
                {result}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="mono text-[10px] text-neutral-600 font-black uppercase tracking-widest">
                  &gt; WAİTİNG_FOR_İNPUT.EXE
                </span>
              </div>
            )}
          </div>

          {result && (
            <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-4">
              <span className="mono text-[8px] font-black text-neutral-500 uppercase tracking-widest">{t('ai_generator.output_title')}</span>
              <button
                onClick={copyToClipboard}
                className="px-3.5 py-1.5 bg-white/5 border border-white/10 hover:bg-[#ff6b6b]/10 hover:border-[#ff6b6b]/20 hover:text-[#ff6b6b] text-white rounded-lg mono text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check size={10} className="text-[#ff6b6b]" /> : <Copy size={10} />}
                {copied ? 'KOPYALANDI' : 'KOPYALA'}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Interactive CTA Banner */}
      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <p className="text-neutral-400 text-xs leading-relaxed font-semibold max-w-xl">
          {t('ai_generator.cta')}
        </p>
        <Link
          to="/iletisim?service=urun-gorsel"
          className="px-5 py-2.5 bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 hover:bg-[#ff6b6b] hover:text-white text-[#ff6b6b] rounded-xl mono text-[9px] font-black tracking-widest uppercase transition-all whitespace-nowrap self-stretch md:self-auto text-center"
        >
          {t('nav.cta').toUpperCase()}
        </Link>
      </div>

    </div>
  );
}
