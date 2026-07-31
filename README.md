# Samer Portfolyo - E-Ticaret Web Tasarım & Geliştirme

Bu proje, Samer Allaham'ın profesyonel E-Ticaret Web Tasarım ve Geliştirme portfolyosunun kaynak kodlarını içerir. React, Vite ve Tailwind CSS ile modern, ultra hızlı ve SEO uyumlu bir altyapı üzerine inşa edilmiştir. Vercel üzerinde barındırılmaktadır ve Supabase ile entegre bir Kurumsal Yapay Zeka/Knowledge Base mimarisine sahiptir.

## 🚀 Öne Çıkan Özellikler

*   **Çoklu Dil Desteği (i18n):** Türkçe (TR), İngilizce (EN) ve Arapça (AR) için tam destek. Arapça için dinamik `RTL` (Right-to-Left) mizanpajı.
*   **Statik Site Oluşturma (SSG) & SEO:** Vite uygulaması olmasına rağmen Vercel üzerinde `prerender.cjs` scripti ile build esnasında statik HTML çıktısı (SSR/SSG benzeri) üretilir. Schema.org (JSON-LD) ve dinamik meta etiketleri ile kusursuz SEO skorları.
*   **Yapay Zeka & Otomasyon Altyapısı (Hazırlık Aşamasında):** `api/modules/` altında LLM (Cerebras, Groq, vb.) entegrasyonu, niyet tespiti (intent classification) ve otomatik makale/FAQ üretim motoru barındırır.
*   **Tam Entegre İletişim:** Ana sayfada dinamik hizmet seçimleri ile çalışan gelişmiş Contact formu ve yüzer WhatsApp butonu.

## 🛠️ Kullanılan Teknolojiler

*   **Frontend:** React (v19), React Router DOM (v7), Vite (v6), Tailwind CSS (v4)
*   **Durum ve Dil Yönetimi:** i18next, react-i18next
*   **Animasyonlar:** GSAP, Lenis (Smooth Scroll)
*   **Backend & Veritabanı:** Vercel Serverless Functions (`/api`), Supabase (PostgreSQL)
*   **Araçlar:** Lucide React (ikonlar), ESLint

## 📦 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için:

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```
   *(Not: Eğer Tailwind CSS v4 ve Vite v6 arasında peer dependency hataları alırsanız `.npmrc` içindeki `legacy-peer-deps=true` kuralı sayesinde kurulum sorunsuz gerçekleşecektir).*

2. **Çevresel Değişkenleri Ayarlayın:**
   Kök dizinde `.env` dosyası oluşturun ve Supabase anahtarlarınızı ekleyin:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```
   Tarayıcınızda `http://localhost:5173` adresinden projeyi görüntüleyebilirsiniz.

## ⚙️ Build ve Deployment (Üretime Alma)

Projeyi Vercel veya başka bir statik sunucuda yayınlamak için:

```bash
npm run build
```

Bu komut sırasıyla şu işlemleri yapar:
1. `vite build` ile projenin standart build dosyasını (`dist/`) oluşturur.
2. `scripts/prerender.cjs` çalıştırılarak sayfa ve blog rotaları için statik HTML çıktıları oluşturulur.
3. `scripts/ping_search_engines.cjs` çalıştırılarak yeni üretilen içerikler için Google, Bing ve IndexNow servislerine ping atılır.

## 📊 Proje Mimarisi Hakkında

Proje hakkında daha detaylı dosya-dosya analiz, mimari inceleme, güçlü/zayıf yönler ve iyileştirme önerileri için `project_analysis_report.md` dosyasına göz atabilirsiniz.
