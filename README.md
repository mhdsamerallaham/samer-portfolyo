# Samer.life — Otonom SEO & E-Ticaret Dönüşüm Platformu

> **Modern, ultra hızlı ve 3 dilli (TR/EN/AR) e-ticaret mühendisliği portfolyosu ile çoklu sağlayıcı (Multi-Provider) yapay zeka bütçe yöneticisini ve otonom arama motoru optimizasyonunu (AutoSEO & GEO) tek bir kurumsal mimaride birleştiren yeni nesil web platformu.**

---

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Serverless_&_Cron-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![IndexNow](https://img.shields.io/badge/IndexNow-Instant_Indexing-0078D4?logo=microsoft&logoColor=white)](https://www.indexnow.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#)

---

## 🎯 Projenin Çözdüğü Problem ve Değer Teklifi

Geleneksel web siteleri statik vitrinler olarak kalmakta; arama motorlarında sıralama kayıplarını tespit etmek, içerikleri güncel tutmak ve organik dönüşümleri artırmak için yoğun insan gücüne ihtiyaç duymaktadır. Aynı zamanda denetimsiz yapay zeka entegrasyonları, API rate limit'lerine (429 Too Many Requests), beklenmedik maliyet patlamalarına veya doğrudan yayına alınan düşük kaliteli halüsinasyon içeriklere yol açmaktadır.

**Samer.life Platformu**, bu sorunları şu temel değer teklifleriyle çözer:
1. **Otonom Büyüme (AutoSEO & GEO)**: Google Search Console (GSC) verilerini tarayarak 4-10. pozisyondaki yüksek potansiyelli anahtar kelimeleri ve düşük CTR'a sahip sayfaları otomatik saptar; mevcut makaleleri yeniden analiz edip dönüştürür.
2. **AI Budget Manager (%80 Safe Limit & Dynamic Routing)**: 6 farklı AI sağlayıcısının (Groq, Mistral, OpenRouter, Gemini, Cerebras, Hugging Face) anlık RPM, TPM, RPD ve TPD kotalarını canlı HTTP başlıklarıyla izler. Kapasite %80'e ulaştığında görevleri ertesi güne erteler (`DEFERRED`); hiçbir koşulda kota aşımı yaşatmaz.
3. **Assisted Mode & Sıfır Doğrudan Yayın (Zero Direct Publish)**: Yapay zeka çıktıları doğrulanmadan asla veritabanına yazılmaz. Değişiklikler önce Before/After fark (SEO Diff) paketine dönüştürülür ve tek tıkla geri alma (1-Click Revert Snapshot) güvencesiyle sunulur.
4. **Çok Dilli SSG & IndexNow Dağıtımı**: Build aşamasında 800'den fazla rota prerender edilerek saf HTML olarak üretilir ve IndexNow API üzerinden anında Bing, Yandex ve Seznam'a iletilir.

---

## 🛠️ Kullanılan Teknolojiler & Mimari (Tech Stack)

### Frontend & Kullanıcı Deneyimi
- **Kütüphane & Çatılar**: React 19, React Router DOM v7 (Lazy Loading & Code Splitting), Vite v6.
- **Tasarım & Stil**: Tailwind CSS v4 (`@tailwindcss/vite`), Vanilla CSS, CSS Grid/Flexbox.
- **Çoklu Dil (i18n)**: `i18next`, `react-i18next` (Türkçe, İngilizce ve tam RTL destekli Arapça).
- **Animasyon & Akıcılık**: Lenis Smooth Scrolling, GSAP (GreenSock), `@gsap/react`.
- **İkonografi & UI Bileşenleri**: `lucide-react`, `@radix-ui/react-icons`.
- **SEO & Meta Yönetimi**: `react-helmet-async`, Schema.org JSON-LD microdata.

### Backend & API Mimarisi
- **Çalışma Ortamı**: Node.js v20+ / Vercel Serverless Functions (`/api/*`).
- **Veritabanı & ORM/Client**: Supabase (PostgreSQL 15), `@supabase/supabase-js`.
- **Dağıtık Kilit & Idempotency**: `CronJobLock` (Postgres tabanlı primary-key kilit mekanizması).
- **Önbellek & Güvenlik**: Deterministik SHA-256 Content Hash & AI Cache.

### Yapay Zeka & Dil Modelleri (Multi-Provider Engine)
- **Groq (LPU Engine)**: `openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.8-27b` (Canlı `x-ratelimit-*` takibi).
- **Mistral AI**: `ministral-8b-latest`, `mistral-small-latest` (Dakikalık token başlık ayrıştırması).
- **OpenRouter**: `openrouter/free`, `deepseek/deepseek-chat` (`/auth/key` üzerinden günlük kota senkronizasyonu).
- **Google Gemini**: `gemini-3.8-flash`, `gemini-3.1-flash-lite` (Konservatif veritabanı kullanım defteri & Safe Margin).
- **Cerebras & Hugging Face**: Otomatik 402/Kredi koruması (`INSUFFICIENT_CREDITS` / `PAUSED`).

### DevOps, Derleme & Arama Motoru Entegrasyonu
- **Statik Derleme (SSG)**: `scripts/prerender.cjs` (800+ sayfa için statik HTML ve dinamik `sitemap.xml`).
- **Instant Indexing**: `scripts/ping_search_engines.cjs` (IndexNow Protokolü ile Bing, Yandex, Seznam).
- **Görev Zamanlayıcı**: Vercel Crons (`vercel.json`).

---

## ✨ Öne Çıkan Özellikler (Key Features)

### 1. AI Budget Manager & Dynamic Router
- **Çok Boyutlu Kota Takibi**: Her sağlayıcı için RPM (İstek/Dk), TPM (Token/Dk), RPD (İstek/Gün) ve TPD (Token/Gün) kotalarını bağımsız takip eder.
- **Dinamik Sağlayıcı Seçimi**: Sabit bir fallback zinciri yerine, görevin tahmini token ihtiyacına ve sağlayıcıların kalan güvenli kapasite oranına göre en uygun modeli dinamik seçer.
- **%80 Güvenli Tavan Kuralı**: Kalan kapasite %20'ye indiğinde sağlayıcı kilitlenir; ücretsiz kotalar asla aşılmaz.
- **Hata Dayanıklılığı & Cooldown**: HTTP 429 yanıtlarında `Retry-After` süresi kadar, HTTP 402 yanıtlarında ise 1 saat süreyle sağlayıcı otomatik soğutmaya (`PAUSED`) alınır.
- **Ertesi Güne Erteleme (`DEFERRED`)**: Bütçe dolduğunda bekleyen görevler kaybolmaz; `deferred_until = yarın` olarak işaretlenir ve ertesi günün cron döngüsünde kaldığı yerden devam eder.

### 2. Deterministik SHA-256 AI Önbelleği (AiCache)
- Cache anahtarı: `sha256(task_type + article_id + content_hash + prompt_version)`
- Makalenin başlığı, meta açıklaması veya gövdesi değişmediği sürece AI motoruna mükerrer istek gönderilmez; **0 token** harcanarak önbellekten yanıt verilir.

### 3. P0 - P3 Öncelikli Görev Kuyruğu (AiTaskQueue)
- **P0 (Kritik)**: GSC Pozisyon 4-10 fırsatları (Hemen ilk sayfaya yükseltilebilecek anahtar kelimeler).
- **P1 (Yüksek)**: Düşük CTR'a sahip blog sayfaları ve başlık/meta optimizasyonları.
- **P2 (Orta)**: FAQ zenginleştirme, içerik boşluğu (content gap) ve iç linkleme.
- **P3 (Düşük)**: Genel semantik analiz ve etiket zenginleştirme.

### 4. Admin Komuta Merkezi (`/admin/seo`)
Yönetim panelinde 7 kapsamlı sekme yer alır:
1. **Genel Bakış**: GSC tıklama, gösterim, ortalama pozisyon, CTR ve SEO sağlık skoru.
2. **Anahtar Kelime Fırsatları**: Fırsat puanına göre sıralanmış GSC verileri ve tek tıkla optimizasyon başlatma.
3. **Kanibalizasyon Analizi**: Aynı sorguda birbirinin sıralamasını bölen rakip sayfaların tespiti ve birleştirme önerileri.
4. **İç Linkleme Önerileri**: Sayfalar arası yetki (PageRank) aktarımı sağlayan doğal metin içi link grafiği.
5. **Değişiklik Günlüğü & Revert**: Uygulanan değişikliklerin denetim kaydı ve **1-Click Geri Al (Revert)** mekanizması.
6. **Teknik SEO Denetimi**: Dahili crawler ile meta tag, canonical, robots ve hiyerarşi skorlaması.
7. **AI Bütçesi & Kullanım**: 6 sağlayıcının anlık sağlık kartları, canlı tüketim sayaçları, ayarlanabilir güvenlik formu ve görev kuyruğu izleyicisi.

### 5. Assisted Mode & SeoDiffModal
- AI çıktısı doğrudan yayına alınmaz; `SeoDiffModal` bileşeni üzerinden **Mevcut Başlık vs Önerilen Başlık**, **Mevcut H1 vs Yeni H1**, **Eksik Alt Başlıklar**, **Yeni FAQ** ve **Önerilen İç Linkler** karşılaştırmalı olarak kullanıcı onayına sunulur.
- Onay verildiğinde `ActionManager` orijinal içeriğin tam anlık görüntüsünü (snapshot) alır ve yayına alır.

---

## 📂 Proje Klasör Yapısı (Project Structure)

```text
samer-portfolyo/
├── api/                                # Vercel Serverless Function API Endpoint'leri
│   ├── _lib/                           # Çekirdek Kütüphaneler ve Yardımcı Modüller
│   │   ├── ai/                         # Otonom AI Bütçe ve Yönlendirme Altyapısı
│   │   │   ├── AiBudgetManager.js      # Kota, canlı header ve güvenli bütçe yöneticisi
│   │   │   ├── AiCache.js              # SHA-256 tabanlı mükerrer istek önleyici önbellek
│   │   │   ├── AiRouter.js             # Çok kriterli dinamik sağlayıcı seçicisi
│   │   │   ├── AiTaskQueue.js          # P0-P3 öncelikli ve ertelemeli görev kuyruğu
│   │   │   ├── CronJobLock.js          # Dağıtık ve atomik cron kilit mekanizması
│   │   │   └── TokenEstimator.js       # İstek öncesi yaklaşık token hesaplayıcısı
│   │   ├── modules/                    # Bilgi Motoru & Otonom İçerik Üretim Modülleri
│   │   │   ├── discovery/              # Konu keşif motoru
│   │   │   ├── entities/               # Semantik varlık (entity) motoru
│   │   │   ├── expert/                 # Uzman mülakat ve içgörü motoru
│   │   │   ├── intent/                 # Kullanıcı arama niyeti sınıflandırıcısı
│   │   │   ├── knowledge/              # Bellek ve bilgi grafiği motorları
│   │   │   ├── monitoring/             # İçerik tazelik izleme motoru
│   │   │   ├── publishing/             # Yayınlama motoru
│   │   │   ├── quality/                # EEAT ve kalite değerlendirme motoru
│   │   │   ├── research/               # Otomatik sektör araştırma motoru
│   │   │   ├── semantic-linking/       # Anlamsal iç linkleme motoru
│   │   │   └── structured-data/        # Schema.org JSON-LD yapılandırıcı
│   │   ├── providers/                  # Spesifik LLM Sağlayıcı Entegrasyonları
│   │   │   ├── CerebrasProvider.js     # Cerebras LPU adaptörü
│   │   │   ├── GroqProvider.js         # Groq OpenAI uyumlu adaptör
│   │   │   ├── HuggingFaceProvider.js  # HF Inference Router adaptörü
│   │   │   └── OpenRouterProvider.js   # OpenRouter çoklu model adaptörü
│   │   ├── seo/                        # SEO Karar ve Analiz Motorları
│   │   │   ├── ActionManager.js        # Assisted mode onay ve 1-click revert motoru
│   │   │   ├── BlogOptimizer.js        # Mevcut makale iyileştirme & diff oluşturucu
│   │   │   ├── GscClient.js            # Google Search Console API / Demo veri adaptörü
│   │   │   ├── InternalLinkEngine.js   # Anlamsal iç link keşif motoru
│   │   │   ├── OpportunityEngine.js    # P0-P3 GSC fırsat analiz motoru
│   │   │   └── TechnicalCrawler.js     # Sayfa içi teknik SEO tarayıcısı
│   │   ├── AIProviderManager.js        # Eski tip zincirleme sağlayıcı yürütücüsü
│   │   ├── BaseProvider.js             # Sağlayıcı temel soyut sınıfı
│   │   ├── createProviderManager.js    # Sağlayıcı enjeksiyon fabrikası
│   │   └── OpenAICompatibleProvider.js # Header ve token yakalayan evrensel istemci
│   ├── blog/                           # Otonom makale üretim API'si (`generate.js`)
│   ├── faq/                            # Otonom FAQ üretim API'si (`generate.js`)
│   ├── routes/public/                  # Genel erişime açık bilgi grafiği API'si
│   └── seo/                            # AutoSEO Dashboard ve Kuyruk Endpoint'leri
│       ├── actions.js                  # Değişiklik uygulama (apply) ve geri alma (revert)
│       ├── ai-budget.js                # Canlı sayaçlar, audit ve bütçe ayarları API'si
│       ├── ai-queue-process.js         # Cron ile tetiklenen kilitli kuyruk işleyicisi
│       ├── crawl.js                    # Canlı teknik denetim endpoint'i
│       ├── dashboard-data.js           # Yönetim paneli toplu veri toplayıcısı
│       ├── optimize-blog.js            # Blog Before/After diff API'si
│       └── sync-gsc.js                 # Search Console senkronizasyon endpoint'i
├── database/                           # Veritabanı Şemaları ve Migrasyonlar
│   └── migrations/
│       ├── 001_enterprise_schema.sql   # Çekirdek portfolyo ve blog şeması
│       ├── 002_autoseo_mvp_schema.sql  # GSC, fırsatlar, değişiklikler ve ölçüm tabloları
│       └── 003_ai_budget_manager_schema.sql # AI bütçe, sayaç, kuyruk ve kilit şeması
├── scripts/                            # Derleme ve Dağıtım Komut Dosyaları
│   ├── ping_search_engines.cjs         # IndexNow & arama motoru auto-ping betiği
│   └── prerender.cjs                   # 800+ rota için statik HTML & sitemap üretici
├── src/                                # Frontend Kaynak Kodları (React 19 + Vite)
│   ├── components/                     # Yeniden Kullanılabilir UI Bileşenleri
│   │   ├── admin/                      # Yönetim Paneli Bileşenleri (Örn: SeoDiffModal)
│   │   ├── knowledge/                  # GEO Direct Answer Box ve bilgi kartları
│   │   ├── Navbar.jsx                  # Çok dilli gezinme çubuğu
│   │   ├── Footer.jsx                  # Alt bilgi alanı
│   │   ├── ContactForm.jsx             # Dinamik teklif ve iletişim formu
│   │   └── WhatsAppButton.jsx          # Canlı destek yüzer butonu
│   ├── pages/                          # Sayfa Rotaları
│   │   ├── admin/                      # SeoDashboard.jsx (7 Sekmeli Kontrol Paneli)
│   │   ├── Home.jsx                    # Ana sayfa
│   │   ├── ServicesOverview.jsx        # Hizmetler genel bakış
│   │   ├── ServiceDetail.jsx           # Bireysel hizmet detay sayfaları
│   │   ├── CaseStudies.jsx             # Başarı hikayeleri & vaka analizleri
│   │   ├── Blog.jsx                    # Çok dilli blog ve içerik merkezi
│   │   ├── FAQ.jsx & FAQDetail.jsx     # SSS ve zengin şema soru-cevap sayfaları
│   │   ├── About.jsx                   # Hakkımda sayfası
│   │   └── Contact.jsx                 # İletişim sayfası
│   ├── locales/                        # TR, EN, AR i18n JSON Çeviri Dosyaları
│   ├── App.jsx                         # Ana yönlendirme ve layout hiyerarşisi
│   ├── i18n.js                         # Dil algılama ve yapılandırma
│   └── main.jsx                        # React DOM başlangıç noktası
├── scratch/                            # Test ve Doğrulama Paketleri
│   └── test_ai_budget_suite.cjs        # 15 senaryolu dayanıklılık test paketi
├── index.html                          # Kök HTML şablonu ve ön-yükleme etiketleri
├── package.json                        # Proje bağımlılıkları ve npm betikleri
├── vercel.json                         # Vercel sunucusuz yönlendirmeleri ve crons
└── vite.config.js                      # Vite derleme ve Tailwind yapılandırması
```

---

## 🚀 Kurulum ve Çalıştırma (Getting Started)

### Ön Gereksinimler
- **Node.js**: `v20.x` veya üzeri önerilir (`v24.x` test edilmiştir).
- **Paket Yöneticisi**: `npm` (`v10.x`+).
- **Veritabanı**: Supabase hesabı (ücretsiz katman yeterlidir).

### 1. Depoyu Klonlayın ve Bağımlılıkları Yükleyin
```bash
git clone https://github.com/mhdsamerallaham/samer-portfolyo.git
cd samer-portfolyo

# Bağımlılıkları yükleyin
npm install
```
> *Not: Proje kökündeki `.npmrc` dosyası `legacy-peer-deps=true` kuralını içerdiğinden bağımlılıklar çakışma olmaksızın yüklenir.*

### 2. Çevre Değişkenlerini Yapılandırın
Kök dizinde `.env` dosyasını oluşturun:
```bash
cp .env.example .env
```

`.env` dosyanızı aşağıdaki şablona göre düzenleyin:
```env
# ─── Supabase Bağlantısı ───────────────────────────────────
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ─── Frontend Uyumluluğu ────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# ─── AI Sağlayıcı API Anahtarları (İsteğe Bağlı & Çoklu) ───
GROQ_API_KEY=gsk_...
MISTRAL_API_KEY=...
OPENROUTER_API_KEY=sk-or-v1-...
GEMINI_API_KEY=AIzaSy...
CEREBRAS_API_KEY=csk-...
HF_TOKEN=hf_...

# ─── Cron Güvenliği ─────────────────────────────────────────
CRON_SECRET=your_secure_random_cron_secret

# ─── İletişim Formu (EmailJS) ───────────────────────────────
VITE_EMAILJS_SERVICE_ID=service_...
VITE_EMAILJS_TEMPLATE_ID=template_...
VITE_EMAILJS_PUBLIC_KEY=...
```

### 3. Veritabanı Migrasyonlarını Uygulayın
Supabase Dashboard SQL Editöründe sırasıyla şu migrasyonları çalıştırın:
1. `database/migrations/001_enterprise_schema.sql`
2. `database/migrations/002_autoseo_mvp_schema.sql`
3. `database/migrations/003_ai_budget_manager_schema.sql`

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Tarayıcınızda `http://localhost:5173` adresine giderek platformu görüntüleyebilirsiniz.
Yönetim paneline `http://localhost:5173/admin/seo` adresinden erişebilirsiniz.

### 5. AI Güvenlik Test Paketini Çalıştırın
Tüm sağlayıcı kotalarını, Safe Limit kurallarını ve fallback zincirlerini test etmek için:
```bash
npm run test:ai
```

### 6. Üretim Derlemesini Doğrulayın
Statik derleme, SSG prerendering ve IndexNow ping döngüsünü çalıştırmak için:
```bash
npm run build
```

---

## 📡 API Endpoint'leri ve Kullanım Senaryoları

Platform, Vercel Serverless Functions mimarisiyle çalışan RESTful API uç noktaları sunar:

| Endpoint | Metot | Açıklama |
| :--- | :---: | :--- |
| `/api/seo/dashboard-data` | `GET` | GSC metrikleri, aktif fırsatlar, kanibalizasyon ve değişiklik kayıtlarını döndürür. |
| `/api/seo/ai-budget` | `GET` | Sağlayıcı sağlık durumları, canlı RPM/TPM/RPD sayaçları ve bütçe ayarlarını döner. |
| `/api/seo/ai-budget` | `POST` | `action: 'update_settings'` ile bütçeyi günceller; `action: 'run_audit'` ile canlı audit yapar. |
| `/api/seo/ai-queue-process`| `GET/POST` | Cron kilidi alarak kuyruktaki P0-P3 görevleri kota aşımı yapmadan sırayla işler. |
| `/api/seo/optimize-blog` | `POST` | Belirtilen blog yazısı için AI zenginleştirmeli Before vs After diff paketi üretir. |
| `/api/seo/actions` | `POST` | `action: 'apply'` ile optimizasyonu yayına alır; `action: 'revert'` ile tek tıkla geri alır. |
| `/api/seo/crawl` | `GET` | Çekirdek rotalar üzerinde canlı sayfa içi teknik SEO denetimi gerçekleştirir. |
| `/api/blog/generate` | `POST` | Yeni sektör odaklı SEO makalesi üretir (Cron korumalı). |
| `/api/faq/generate` | `POST` | Otomatik SSS ve Schema.org soru-cevap çıktısı üretir. |

### Örnek İstek & Yanıt: `/api/seo/ai-budget` (GET)
```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "providerKey": "groq",
        "displayName": "Groq",
        "model": "openai/gpt-oss-120b",
        "health": "HEALTHY",
        "safeRpmCapacity": 24,
        "safeRpdCapacity": 11520,
        "usagePercent": 4,
        "statusBadge": "SAFE"
      },
      {
        "providerKey": "gemini",
        "displayName": "Google Gemini",
        "model": "gemini-3.8-flash",
        "health": "HEALTHY",
        "safeRpmCapacity": 8,
        "safeRpdCapacity": 200,
        "usagePercent": 12,
        "statusBadge": "SAFE"
      }
    ],
    "settings": {
      "safetyMarginPercent": 80,
      "maxTasksPerDay": 20,
      "maxTokensPerDay": 150000
    },
    "queueStats": {
      "pending": 2,
      "processing": 0,
      "completed": 18,
      "deferred": 1
    }
  }
}
```

---

## 🧪 Doğrulama ve Test Raporu (15/15 Geçti)

Platformun dayanıklılığı `npm run test:ai` ile test edilmiştir:
- ✅ **Test 1**: %80 Safe Limit hesaplaması ve kota tavanı koruması.
- ✅ **Test 2**: RPM Exhaustion (dakikalık istek aşımında sağlayıcı kilitlenmesi).
- ✅ **Test 3**: TPM Exhaustion (dakikalık token tavanında sağlayıcıdan kaçınma).
- ✅ **Test 4**: RPD Exhaustion (günlük limit güvenli eşiğe varınca `BLOCKED` statüsü).
- ✅ **Test 5**: HTTP 429 yanıtı ve `Retry-After` süresi kadar dinamik cooldown.
- ✅ **Test 6**: HTTP 402 yanıtında sağlayıcının 1 saat `PAUSED` statüsüne alınması.
- ✅ **Test 7**: Sağlayıcı arızasında dinamik fallback (Groq cooldown'dayken Mistral'e geçiş).
- ✅ **Test 8**: Tüm sağlayıcılar dolduğunda zorla istek atmama güvencesi.
- ✅ **Test 9**: Kota yetersizliğinde görevin ertesi güne ertelenmesi (`deferred`).
- ✅ **Test 10**: Tarihi gelen ertelenmiş işlerin ertesi gün otomatik `pending` olması.
- ✅ **Test 11**: Çift çalışan cron'ların atomik kilit ile engellenmesi (Idempotency).
- ✅ **Test 12**: Cache Hit ile mükerrer analizlerde **0 token** tüketimi.
- ✅ **Test 13**: İçerik değişmediğinde SHA-256 hash eşitliği, değiştiğinde yeni hash üretimi.
- ✅ **Test 14**: Yanıt başlıklarındaki `Retry-After` saniyesinin tam uygulanması.
- ✅ **Test 15**: Cooldown süresi bitene kadar sağlayıcıya tek bir istek dahi gönderilmemesi.

---

## 🔒 Güvenlik ve Gizlilik Prensipleri
- **API Anahtarı İzolasyonu**: Tüm LLM API anahtarları yalnızca sunucu tarafında (`/api`) tutulur; istemciye asla sızdırılmaz.
- **Audit Logging**: Her içerik güncellemesi `seo_changes` tablosuna uygulayan bilgisi, zaman damgası ve tam Before/After JSON snapshot'ı ile kaydedilir.
- **Vercel Cron Koruması**: Cron endpoint'leri `CRON_SECRET` başlık doğrulamasıyla korunur.

---

## 👨‍💻 Yazar & İletişim

**Samer Allaham** — Senior E-Commerce Web Developer & AI Solutions Architect  
- 🌐 Web: [samer.life](https://www.samer.life)  
- 💼 LinkedIn: [linkedin.com/in/samerallaham](https://linkedin.com)  
- 📧 İletişim: [samer.life/iletisim](https://www.samer.life/iletisim)

---
*© 2026 Samer.life. Tüm hakları saklıdır.*
