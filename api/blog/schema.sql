-- SQL Schema for the Multilingual Blog System (Supabase / PostgreSQL)

-- 1. Create the blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Turkish (TR) Fields
  title_tr VARCHAR(255) NOT NULL,
  summary_tr TEXT NOT NULL,
  content_tr TEXT NOT NULL,
  seo_title_tr VARCHAR(255),
  seo_description_tr TEXT,
  
  -- English (EN) Fields
  title_en VARCHAR(255) NOT NULL,
  summary_en TEXT NOT NULL,
  content_en TEXT NOT NULL,
  seo_title_en VARCHAR(255),
  seo_description_en TEXT,
  
  -- Arabic (AR) Fields
  title_ar VARCHAR(255) NOT NULL,
  summary_ar TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  seo_title_ar VARCHAR(255),
  seo_description_ar TEXT
);

-- Create an index on slug for high-speed queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
-- Create an index on published_at for sorting
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);


-- 2. Seed Data (Inserting the 7 Existing Blog Posts)

-- Note: In PostgreSQL, we escape single quotes inside content strings by doubling them (e.g., ' -> '')
INSERT INTO blog_posts (
  slug,
  published_at,
  title_tr, summary_tr, content_tr, seo_title_tr, seo_description_tr,
  title_en, summary_en, content_en, seo_title_en, seo_description_en,
  title_ar, summary_ar, content_ar, seo_title_ar, seo_description_ar
) VALUES (
  'shopify-vs-ikas-2026',
  '2026-07-10 12:00:00+03',
  -- Turkish
  'Shopify vs İKAS: Türkiye Pazarı İçin Hangisini Seçmelisiniz?',
  'Türkiye''de e-ticaret yaparken Shopify mı yoksa yerli altyapı İKAS mı daha avantajlı? Hız, SEO, komisyon oranları ve entegrasyonlar açısından karşılaştırdık.',
  '<p>E-ticaret dünyasına adım atarken ya da mevcut sitenizi taşımaya karar verdiğinizde karşınıza çıkan en büyük iki seçenek şüphesiz <strong>Shopify</strong> ve <strong>İKAS</strong> olacaktır. Bu yazımızda, Türkiye pazarı odaklı satış yapan ve globale açılmak isteyen markalar için iki platformu tüm detaylarıyla karşılaştırıyoruz.</p><h3>1. Hız ve Performans (Core Web Vitals)</h3><p>İKAS, Türkiye sunucuları ve yeni nesil altyapısı sayesinde inanılmaz yüksek açılış hızları sunmaktadır. Mobil hız testlerinde ek eklenti kurmadan 90+ skorları yakalamak İKAS ile oldukça kolaydır. Shopify ise global CDN ağlarıyla çok güçlüdür ancak çok fazla üçüncü parti uygulama (eklenti) kurduğunuzda site hızı yavaşlayabilir. Hız optimizasyonu konusunda İKAS Türkiye sınırları içinde bir adım öndedir.</p><h3>2. Komisyon Oranları ve Ödeme Altyapıları</h3><p>Shopify, kendi ödeme altyapısı dışındaki (iyzico, PayTR vb.) sanal pos kullanımlarında paket durumunuza göre ek işlem ücreti (komisyon) almaktadır. İKAS ise yerli ödeme geçitleriyle komisyonsuz çalışır ve ek bir altyapı komisyonu yansıtmaz. Bu da Türkiye pazarında kâr marjınızı korumanıza yardımcı olur.</p><h3>3. Entegrasyonlar ve Kolaylık</h3><p>Türkiye''deki pazaryerleri (Trendyol, Hepsiburada vb.), kargo firmaları ve yerli ön muhasebe programları (Paraşüt, Bizimhesap) ile doğrudan entegrasyon konusunda İKAS yerleşik çözümler sunar. Shopify''da ise bu entegrasyonlar için harici entegratör firmalara veya özel yazılmış API uygulamalarına ihtiyaç duyarsınız.</p><h3>Karar: Hangisini Seçmeli?</h3><p>Eğer ana hedef pazarınız Türkiye ise, yerel entegrasyon kolaylığı ve hızı nedeniyle <strong>İKAS</strong> mükemmel bir tercihtir. Ancak hedefiniz ilk günden itibaren global pazarlara açılmak, çoklu para birimi ve gelişmiş yabancı pazarlama araçlarını kullanmak ise <strong>Shopify</strong>''ın küresel gücünden faydalanmak daha mantıklıdır.</p>',
  'Shopify vs İKAS: Türkiye Pazarı Karşılaştırması',
  'Shopify ve İKAS e-ticaret altyapılarını hız, entegrasyon, yerli sanal pos komisyonları ve kullanım kolaylığı yönünden kıyaslayın.',
  
  -- English
  'Shopify vs İKAS: Which Should You Choose for the Turkish Market?',
  'Comparing global giant Shopify against local performer İKAS for businesses selling within Turkey and expanding abroad.',
  '<p>When launching or migrating your e-commerce store, choosing between <strong>Shopify</strong> and <strong>İKAS</strong> is a critical decision. Let''s compare speed, local fees, and integrations.</p><h3>1. Core Web Vitals & Loading Speed</h3><p>İKAS offers blistering loading speeds right out of the box. Its modern architecture reaches 90+ mobile test scores easily. Shopify is highly optimized globally but adding third-party plugins can bloat page sizes and slow performance.</p><h3>2. Local Integration & Support</h3><p>İKAS provides built-in sync for Turkish cargo networks, local billing services, and popular domestic marketplaces like Trendyol. For Shopify, you must buy external plugins or develop custom API endpoints to link these services.</p><h3>Verdict: Which to Choose?</h3><p>If your customer base is primarily in Turkey, <strong>İKAS</strong> offers local ease of use and top speed. If your goals involve international selling with multi-currency setups, <strong>Shopify</strong> is the global benchmark.</p>',
  'Shopify vs İKAS: E-Commerce Platform Comparison',
  'Compare Shopify and İKAS for e-commerce stores in Turkey based on page speed, local payment integrations, commissions, and marketplace sync.',
  
  -- Arabic
  'مقارنة شوبيفاي ضد إيكاس: أيهما تختار للتجارة الإلكترونية في تركيا؟',
  'مقارنة شاملة بين عملاق التجارة شوبيفاي والمنصة المحلية الواعدة İKAS للتجار داخل تركيا والراغبين في التصدير للخارج.',
  '<p>عند الرغبة في إطلاق متجرك أو هجرته لمنصة جديدة، يبرز خيارا <strong>Shopify</strong> و <strong>İKAS</strong> كأهم خيارين في السوق التركي. دعنا نقارن بينهما من حيث السرعة والرسوم والربط المحلي.</p><h3>1. سرعة التحميل ومؤشرات الويب</h3><p>تتميز إيكاس بسرعات تصفح فائقة ومثالية للزوار داخل تركيا بفضل سيرفراتها المحلية، وتحقق +90 بسهولة. شوبيفاي قوية عالمياً لكن كثرة تنصيب تطبيقات المتجر الإضافية قد يؤثر سلباً على سرعة الموقع.</p><h3>2. الربط المحلي والدعم</h3><p>تقدم إيكاس ربطاً داخلياً مع شركات الشحن التركية وبرامج الفواتير وأسواق Trendyol. في شوبيفاي، ستحتاج لشراء تطبيقات إضافية أو برمجة واجهات ربط خاصة للوصول لنفس النتيجة.</p><h3>الخلاصة: ماذا تختار؟</h3><p>إن كان عملاؤك بالدرجة الأولى داخل تركيا، فإن منصة <strong>İKAS</strong> توفر السرعة والسهولة المحلية. أما إن كان تركيزك هو البيع لعدة دول بعملات ولغات مختلفة، فإن <strong>Shopify</strong> هي الخيار الأنسب لصلابتها العالمية.</p>',
  'مقارنة شوبيفاي وإيكاس للتجارة الإلكترونية في تركيا',
  'قارن بين شوبيفاي وإيكاس للتجارة الإلكترونية في تركيا بناء على سرعة الموقع، الربط مع شركات الشحن المحلية، بوابات الدفع والعمولات.'
),
(
  'eticaret-donusum-orani-artirma',
  '2026-07-05 12:00:00+03',
  -- Turkish
  'E-Ticaret Dönüşüm Oranını (CR) Artırmanın En Etkili 5 Yolu',
  'Sitenize gelen ziyaretçilerin satışa dönüşme oranını artırmak, reklam bütçenizi korumanın en iyi yoludur. İşte hemen uygulayabileceğiniz 5 UX tüyosu.',
  '<p>E-ticarette başarı sadece sitenize çok fazla ziyaretçi çekmekle ilgili değildir. Asıl başarı, gelen trafiğin ne kadarını alıcıya dönüştürebildiğinizle, yani <strong>Dönüşüm Oranınızla (Conversion Rate - CR)</strong> ölçülür. İşte sitenizin satışlarını artıracak 5 altın kural:</p><h3>1. Mobil Sepete Ekleme Deneyimini İyileştirin</h3><p>Kullanıcıların %80''inden fazlası alışverişi mobil cihazlardan yapıyor. Mobil cihazlarda ''Sepete Ekle'' butonunun her zaman görünür olması (Sticky CTA) ve kolay basılabilir boyutta tasarlanması satışlarınızı anında artıracaktır.</p><h3>2. Ödeme Adımlarını Sadeleştirin (One-Page Checkout)</h3><p>Kullanıcılar karmaşık, çok sayfalı üyelik ve adres formlarından nefret eder. Adres formunu otomatik doldurma seçenekleriyle entegre etmek ve ödemeyi tek bir sayfada tamamlatmak sepet terk etme oranlarını ciddi derecede düşürür.</p><h3>3. Güven Unsurlarını Ön Plana Çıkarın</h3><p>Kullanıcılar tanımadıkları sitelerden alışveriş yaparken çekinirler. Sitenin alt kısmında SSL sertifikası, Kargo Güvencesi, Kolay İade Rozetleri ve en önemlisi gerçek müşteri yorumlarını (Testimonials) konumlandırmak güven bağını kuvvetlendirir.</p><h3>4. Ürün Açıklamalarını SEO ve Fayda Odaklı Yazın</h3><p>Ürün edinilen anahtar kelimelerle arama motorlarında görünür olur. Müşteriye ürünün hayatını nasıl kolaylaştıracağını anlatın ve arama motorlarının ürünü bulabilmesi için doğru anahtar kelimeleri ekleyin.</p><h3>5. Sayfa Hızını Optimize Edin</h3><p>3 saniyeden uzun sürede açılan sitelerde kullanıcıların yarısı sayfayı kapatır. Görsellerinizi sıkıştırın, gereksiz eklentilerden kurtulun ve temiz kod yapısı kullanın.</p>',
  'E-Ticaret Dönüşüm Oranını (CR) Artırmanın En Etkili 5 Yolu',
  'E-ticaret dönüşüm oranını artırmak için 5 etkili UX ve hız tüyosu. Sepet terkini azaltın ve satışlarınızı katlayın.',
  
  -- English
  '5 Proven Ways to Boost Your E-Commerce Conversion Rate (CR)',
  'Converting existing traffic into buyers protects your ad budgets. Here are 5 quick UX adjustments you can apply today.',
  '<p>Success is not just about driving traffic. It is about how many visitors actually checkout. Let''s look at 5 ways to increase conversion rates:</p><h3>1. Sticky Mobile CTA Buttons</h3><p>With 80% of traffic coming from mobile, make sure the ''Add to Cart'' action stays visible and is easy to press as users scroll.</p><h3>2. Simplify Checkout (One-Page Flow)</h3><p>Don''t force users through multi-page registers. A single-page checkout with autofill reduces abandoned carts.</p><h3>3. Show Trust Indicators</h3><p>Incorporate SSL badges, shipping guarantees, and real customer reviews near transaction areas to establish trust.</p><h3>4. Write SEO and Benefit-Driven Product Descriptions</h3><p>Ensure products are findable on Google. Explain how your product helps the user and integrate target search keywords natively.</p><h3>5. Optimize Page Speeds</h3><p>If your store takes more than 3 seconds to load, half your traffic exits. Compress image files, prune legacy plugins, and write optimized clean code.</p>',
  '5 Ways to Increase E-Commerce Conversion Rates',
  'Learn how to increase conversion rate (CR) in e-commerce using sticky CTAs, one-page checkout, trust badges, and optimized page speed.',
  
  -- Arabic
  '5 طرق مجربة لزيادة معدل تحويل المبيعات (CR) في متجرك',
  'زيادة معدل تحويل الزوار لمشترين هي أفضل طريقة لحماية ميزانيتك الإعلانية. إليك 5 نصائح سريعة لتحسين تجربة الشراء اليوم.',
  '<p>النجاح في التجارة الإلكترونية ليس فقط بجذب آلاف الزوار لمتجرك، بل بمدى قدرتك على إقناعهم بإتمام الطلب والدفع. إليك 5 خطوات لتحقيق ذلك:</p><h3>1. زر ''شراء'' عائم ومستمر للهاتف</h3><p>نظراً لأن 80% من زوار المتاجر يتصفحون عبر الجوال، تأكد من بقاء زر ''أضف للسلة'' أو ''اشترِ الآن'' ظاهراً وسهل الوصول إليه أثناء التمرير.</p><h3>2. تسهيل صفحة إنهاء الطلب</h3><p>لا تجبر الزوار على تعبئة نماذج تسجيل معقدة. صفحة الدفع ذات الخطوة الواحدة (One-Page Checkout) تزيد من اكتمال المشتريات بشكل كبير.</p><h3>3. عرض رموز الأمان والتقييمات</h3><p>احرص على إظهار شهادات الأمان وتقييمات العملاء الفعليين بالقرب من مناطق الدفع لتعزيز ثقة الزائر قبل إدخال بيانات بطاقته.</p><h3>4. كتابة وصف منتجات يركز على الفوائد والسيو</h3><p>تظهر المنتجات في محركات البحث عند البحث بكلمات محددة. صف للعميل كيف يحل هذا المنتج مشكلته واكتب الكلمات المفتاحية المناسبة.</p><h3>5. تسريع أداء المتجر</h3><p>المواقع التي تستغرق أكثر من 3 ثوان للتحميل تخسر نصف زوارها. اضغط الصور واحذف الإضافات غير الضرورية واعتمد هيكلية برمجية نظيفة.</p>',
  '5 طرق لزيادة معدل تحويل المبيعات في المتاجر الإلكترونية',
  'اكتشف 5 طرق برمجية وتصميمية لزيادة معدل التحويل (CR) وتقليل نسب التخلي عن السلال عبر صفحة الدفع السريعة وأزرار الشراء الفعالة.'
);

-- 3. Create contact submissions backup table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  website VARCHAR(255),
  platform VARCHAR(255) DEFAULT 'not_sure',
  budget VARCHAR(255) DEFAULT 'tier1',
  message TEXT NOT NULL
);

-- 4. Create cron_locks table for atomic concurrency locking
CREATE TABLE IF NOT EXISTS cron_locks (
  job_name text PRIMARY KEY,
  is_processing boolean NOT NULL DEFAULT false,
  started_at timestamptz
);

INSERT INTO cron_locks (job_name, is_processing) VALUES ('blog_generate', false)
ON CONFLICT (job_name) DO NOTHING;

