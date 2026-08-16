import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Image as ImageIcon, X, Tag, Sparkles, Film, Maximize2, ChevronDown } from 'lucide-react';

export default function SampleWorksGallery() {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'tr';

  const [activeTab, setActiveTab] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [lightboxMedia, setLightboxMedia] = useState(null);
  const [hoveredVideoId, setHoveredVideoId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6); // Paginate to load initial 6 items lightning fast

  const sampleWorks = [
    // Videos
    {
      id: 'v1',
      type: 'video',
      src: '/ornek-calismalar/videos/sample-video-1.mov',
      poster: '/ornek-calismalar/thumbnails/sample-image-1.jpeg',
      title: lang === 'tr' ? 'Dinamik Ürün & Model Tanıtım Videosu' : lang === 'ar' ? 'فيديو ترويجي ديناميكي للمنتج والنموذج' : 'Dynamic Product & Model Promo Video',
      category: 'video',
      tags: lang === 'tr' ? ['#VideoReels', '#SosyalMedya', '#DinamikÇekim', '#E-Ticaret'] : lang === 'ar' ? ['#فيديو', '#سوشيال_ميديا', '#تجارة_إلكترونية'] : ['#VideoReels', '#SocialMedia', '#Dynamic', '#Ecommerce']
    },
    {
      id: 'v2',
      type: 'video',
      src: '/ornek-calismalar/videos/sample-video-2.mov',
      poster: '/ornek-calismalar/thumbnails/sample-image-2.jpeg',
      title: lang === 'tr' ? 'E-Ticaret Web Uyumlu Ürün Videosu' : lang === 'ar' ? 'فيديو منتج متوافق مع مواقع الويب' : 'Web & Ecommerce Showcase Video',
      category: 'video',
      tags: lang === 'tr' ? ['#WebVideo', '#E-Ticaret', '#Showcase', '#ÜrünTanıtımı'] : lang === 'ar' ? ['#فيديو_ويب', '#عرض_منتج', '#تسوق'] : ['#WebVideo', '#Showcase', '#ProductPromo', '#Ecommerce']
    },
    {
      id: 'v3',
      type: 'video',
      src: '/ornek-calismalar/videos/sample-video-3.mp4',
      poster: '/ornek-calismalar/thumbnails/sample-image-3.jpeg',
      title: lang === 'tr' ? 'Çekici Kampanya & Promo Video İçeriği' : lang === 'ar' ? 'محتوى فيديو ترويجي للحملات الإعلانية' : 'High-Converting Promo Campaign Video',
      category: 'video',
      tags: lang === 'tr' ? ['#PromoVideo', '#Kampanya', '#Reels', '#MobilUyumlu'] : lang === 'ar' ? ['#برومو', '#حملة_إعلانية', '#ريلز'] : ['#PromoVideo', '#Campaign', '#Reels', '#MobileReady']
    },
    // Images
    {
      id: 'i1',
      type: 'image',
      thumb: '/ornek-calismalar/thumbnails/sample-image-1.jpeg',
      full: '/ornek-calismalar/images/sample-image-1.jpeg',
      title: lang === 'tr' ? 'Editorial Moda Poz Prodüksiyonu' : lang === 'ar' ? 'إنتاج وضعيات أزياء احترافية' : 'Editorial Fashion Pose Production',
      category: 'fashion',
      tags: lang === 'tr' ? ['#Moda', '#Editorial', '#ModelÇekimi', '#AIProdüksiyon'] : lang === 'ar' ? ['#أزياء', '#افتراضي', '#تصوير_نموذج'] : ['#Fashion', '#Editorial', '#ModelShoot', '#AIProduction']
    },
    {
      id: 'i2',
      type: 'image',
      thumb: '/ornek-calismalar/thumbnails/sample-image-2.jpeg',
      full: '/ornek-calismalar/images/sample-image-2.jpeg',
      title: lang === 'tr' ? 'Konsept Moda & Stil Görseli' : lang === 'ar' ? 'صورة مفاهيمية للأزياء والنمط' : 'Conceptual Fashion & Style Visual',
      category: 'fashion',
      tags: lang === 'tr' ? ['#Moda', '#Style', '#StüdyoÇekimi', '#E-Ticaret'] : lang === 'ar' ? ['#نمط', '#استوديو', '#تجارة_إلكترونية'] : ['#Fashion', '#Style', '#StudioShoot', '#Ecommerce']
    },
    {
      id: 'i3',
      type: 'image',
      thumb: '/ornek-calismalar/thumbnails/sample-image-3.jpeg',
      full: '/ornek-calismalar/images/sample-image-3.jpeg',
      title: lang === 'tr' ? 'Model Teaser & Web Banner Görseli' : lang === 'ar' ? 'صورة ترويجية وبانر ويب للنموذج' : 'Model Teaser & Web Banner Visual',
      category: 'fashion',
      tags: lang === 'tr' ? ['#ModelTeaser', '#Banner', '#SosyalMedya', '#YapayZeka'] : lang === 'ar' ? ['#بانر', '#سوشيال_ميديا', '#ذكاء_اصطناعي'] : ['#ModelTeaser', '#Banner', '#SocialMedia', '#AIVisuals']
    },
    {
      id: 'i4',
      type: 'image',
      thumb: '/ornek-calismalar/thumbnails/sample-image-4.jpeg',
      full: '/ornek-calismalar/images/sample-image-4.jpeg',
      title: lang === 'tr' ? 'Moda & İkonik Model Çekimi' : lang === 'ar' ? 'تصوير أزياء ونماذج أيقونية' : 'Fashion & Iconic Model Shoot',
      category: 'fashion',
      tags: lang === 'tr' ? ['#FashionModel', '#Iconic', '#Trend', '#WebVisual'] : lang === 'ar' ? ['#نموذج_أزياء', '#أيقوني', '#تريند'] : ['#FashionModel', '#Iconic', '#Trend', '#WebVisual']
    },
    {
      id: 'i5',
      type: 'image',
      thumb: '/ornek-calismalar/thumbnails/sample-image-5.jpeg',
      full: '/ornek-calismalar/images/sample-image-5.jpeg',
      title: lang === 'tr' ? 'Dijital Model & Poz Variyasyonları' : lang === 'ar' ? 'تنويعات وضعيات النماذج الرقمية' : 'Digital Model & Pose Variations',
      category: 'fashion',
      tags: lang === 'tr' ? ['#DigitalModel', '#PoseGen', '#Katalog', '#Moda'] : lang === 'ar' ? ['#نموذج_رقمي', '#كتالوج', '#أزياء'] : ['#DigitalModel', '#PoseGen', '#Catalog', '#Fashion']
    },
    {
      id: 'i6',
      type: 'image',
      thumb: '/ornek-calismalar/thumbnails/sample-image-6.jpeg',
      full: '/ornek-calismalar/images/sample-image-6.jpeg',
      title: lang === 'tr' ? 'Stüdyo Işık & Model Konsepti' : lang === 'ar' ? 'إضاءة استوديو ومفهوم نموذج راقٍ' : 'Studio Lighting & Model Concept',
      category: 'fashion',
      tags: lang === 'tr' ? ['#StudioLighting', '#Model', '#LüksKoleksiyon', '#AI'] : lang === 'ar' ? ['#إضاءة_استوديو', '#فخامة', '#ذكاء_اصطناعي'] : ['#StudioLighting', '#Model', '#Luxury', '#AIVisuals']
    },
    {
      id: 'i7',
      type: 'image',
      thumb: '/ornek-calismalar/thumbnails/sample-image-7.jpeg',
      full: '/ornek-calismalar/images/sample-image-7.jpeg',
      title: lang === 'tr' ? 'Premium Moda & Model Prodüksiyonu' : lang === 'ar' ? 'إنتاج أزياء ونماذج بريميوم' : 'Premium Fashion & Model Production',
      category: 'fashion',
      tags: lang === 'tr' ? ['#PremiumFashion', '#2KQuality', '#HighEnd', '#E-Ticaret'] : lang === 'ar' ? ['#بريميوم', '#جودة_عالية', '#تجارة_إلكترونية'] : ['#PremiumFashion', '#2KQuality', '#HighEnd', '#Ecommerce']
    },
    {
      id: 'i8',
      type: 'image',
      thumb: '/ornek-calismalar/thumbnails/sample-image-8.jpeg',
      full: '/ornek-calismalar/images/sample-image-8.jpeg',
      title: lang === 'tr' ? 'Mücevher & Pırlanta Model Çekimi' : lang === 'ar' ? 'تصوير مجوهرات وألماس مع نموذج' : 'Jewelry & Diamond Model Shot',
      category: 'jewelry',
      tags: lang === 'tr' ? ['#Mücevher', '#Diamond', '#LüksGörsel', '#TakıDetay'] : lang === 'ar' ? ['#مجوهرات', '#ألماس', '#فخامة', '#تفاصيل'] : ['#Jewelry', '#Diamond', '#LuxuryVisual', '#Accessories']
    },
    {
      id: 'i9',
      type: 'image',
      thumb: '/ornek-calismalar/thumbnails/sample-image-9.jpeg',
      full: '/ornek-calismalar/images/sample-image-9.jpeg',
      title: lang === 'tr' ? 'Ultra High-Res Moda Prodüksiyonu' : lang === 'ar' ? 'إنتاج أزياء فائق الدقة' : 'Ultra High-Res Fashion Production',
      category: 'fashion',
      tags: lang === 'tr' ? ['#UltraHD', '#HighFashion', '#Lookbook', '#Model'] : lang === 'ar' ? ['#دقة_فائقة', '#لوك_بوك', '#نموذج'] : ['#UltraHD', '#HighFashion', '#Lookbook', '#Model']
    },
    {
      id: 'i10',
      type: 'image',
      thumb: '/ornek-calismalar/thumbnails/sample-image-10.jpeg',
      full: '/ornek-calismalar/images/sample-image-10.jpeg',
      title: lang === 'tr' ? 'Kıyafet & Doku Detay Kopyalama' : lang === 'ar' ? 'نسخ تفاصيل وأنسجة الملابس' : 'Garment & Texture Detail Replication',
      category: 'garment',
      tags: lang === 'tr' ? ['#KıyafetDetay', '#Tekstil', '#TextureReplication', '#Doku'] : lang === 'ar' ? ['#تفاصيل_ملابس', '#نسيج', '#تكستشر'] : ['#GarmentDetails', '#Textile', '#TextureReplication', '#Texture']
    },
    {
      id: 'i11',
      type: 'image',
      thumb: '/ornek-calismalar/thumbnails/sample-image-11.jpeg',
      full: '/ornek-calismalar/images/sample-image-11.jpeg',
      title: lang === 'tr' ? 'Garment & Kumaş Hassas Detayları' : lang === 'ar' ? 'تفاصيل الأقمشة والملابس الدقيقة' : 'Garment & Fabric Precision Details',
      category: 'garment',
      tags: lang === 'tr' ? ['#GarmentDetails', '#KumaşDoku', '#Tekstil', '#E-Ticaret'] : lang === 'ar' ? ['#أقمشة', '#نسيج', '#تجارة_إلكترونية'] : ['#GarmentDetails', '#FabricTexture', '#Textile', '#Ecommerce']
    },
    {
      id: 'i12',
      type: 'image',
      thumb: '/ornek-calismalar/thumbnails/sample-image-12.jpeg',
      full: '/ornek-calismalar/images/sample-image-12.jpeg',
      title: lang === 'tr' ? 'Gerçekçi Kumaş & Renk Uyum Çalışması' : lang === 'ar' ? 'تنسيق ألوان وأنسجة الأقمشة الواقعية' : 'Realistic Fabric & Color Match Study',
      category: 'garment',
      tags: lang === 'tr' ? ['#KumaşUyum', '#Renkİşleme', '#DetailRendering', '#Tekstil'] : lang === 'ar' ? ['#تنسيق_ألوان', '#دقة_تفاصيل', '#نسيج'] : ['#FabricMatch', '#ColorGrading', '#DetailRendering', '#Textile']
    },
    {
      id: 'i13',
      type: 'image',
      thumb: '/ornek-calismalar/thumbnails/sample-image-13.jpeg',
      full: '/ornek-calismalar/images/sample-image-13.jpeg',
      title: lang === 'tr' ? 'Model Üzerinde Doku & Poz Entegrasyonu' : lang === 'ar' ? 'دمج الأنسجة والوضعيات على النموذج' : 'Model Texture & Pose Integration',
      category: 'fashion',
      tags: lang === 'tr' ? ['#PoseIntegration', '#ModelGiydirme', '#Moda', '#AIStüdyo'] : lang === 'ar' ? ['#إلباس_افتراضي', '#أزياء', '#ذكاء_اصطناعي'] : ['#PoseIntegration', '#VirtualDressing', '#Fashion', '#AIStudio']
    },
    {
      id: 'i14',
      type: 'image',
      thumb: '/ornek-calismalar/thumbnails/sample-image-14.jpeg',
      full: '/ornek-calismalar/images/sample-image-14.jpeg',
      title: lang === 'tr' ? '2K Çözünürlükte Kumaş & Model Detayı' : lang === 'ar' ? 'تفاصيل النموذج والأقشة بدقة 2K' : '2K Resolution Fabric & Model Details',
      category: 'garment',
      tags: lang === 'tr' ? ['#2KDetail', '#KumaşHassasiyeti', '#ModaLookbook', '#WebGörsel'] : lang === 'ar' ? ['#دقة_2k', '#لوك_بوك', '#صورة_ويب'] : ['#2KDetail', '#FabricPrecision', '#FashionLookbook', '#WebVisual']
    }
  ];

  // Collect unique tags
  const allTags = Array.from(new Set(sampleWorks.flatMap(item => item.tags)));

  // Filter items
  const filteredWorks = sampleWorks.filter(item => {
    const matchesTab =
      activeTab === 'all' ? true :
      activeTab === 'video' ? item.type === 'video' :
      activeTab === 'fashion' ? item.category === 'fashion' :
      activeTab === 'jewelry' ? item.category === 'jewelry' :
      activeTab === 'garment' ? item.category === 'garment' : true;

    const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;

    return matchesTab && matchesTag;
  });

  const visibleWorks = filteredWorks.slice(0, visibleCount);

  const categories = [
    { id: 'all', label: lang === 'tr' ? 'Tüm Çalışmalar' : lang === 'ar' ? 'جميع الأعمال' : 'All Works' },
    { id: 'video', label: lang === 'tr' ? 'Videolar 🎬' : lang === 'ar' ? 'الفيديوهات 🎬' : 'Videos 🎬' },
    { id: 'fashion', label: lang === 'tr' ? 'Moda & Model 👗' : lang === 'ar' ? 'الأزياء والنماذج 👗' : 'Fashion & Models 👗' },
    { id: 'jewelry', label: lang === 'tr' ? 'Mücevher & Takı 💎' : lang === 'ar' ? 'المجوهرات 💎' : 'Jewelry 💎' },
    { id: 'garment', label: lang === 'tr' ? 'Kumaş & Doku 🧵' : lang === 'ar' ? 'الأقمشة والتفاصيل 🧵' : 'Fabric & Details 🧵' }
  ];

  return (
    <section className="py-16 border-t border-white/5 my-12" id="ornek-calismalar">
      <div className="flex flex-col gap-4 mb-10 text-start">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 rounded-full mono text-[10px] font-black text-[#ff6b6b] uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={12} />
            {lang === 'tr' ? 'CANLI ÖRNEK PORTFOLYO' : lang === 'ar' ? 'معرض الأعمال الحي' : 'LIVE SAMPLE PORTFOLIO'}
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          {lang === 'tr' ? 'Örnek Çalışmalarımız' : lang === 'ar' ? 'نماذج من أعمالنا' : 'Sample Works & Showcase'}
        </h2>
        <p className="text-neutral-400 text-sm md:text-base font-semibold max-w-2xl">
          {lang === 'tr'
            ? 'Web siteleri ve e-ticaret için hazırladığımız çekici görseller, yüksek çözünürlüklü model çekimleri ve dinamik tanıtım videoları.'
            : lang === 'ar'
            ? 'صور المنتجات والنماذج عالية الجودة ومقاطع الفيديو الترويجية المصممة لمواقع الويب والمتاجر الإلكترونية.'
            : 'High-converting product photography, AI-driven model renders, and dynamic promo videos crafted for web and e-commerce.'}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveTab(cat.id);
              setSelectedTag(null);
              setVisibleCount(6);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 flex items-center gap-2 ${
              activeTab === cat.id
                ? 'bg-[#ff6b6b] text-white shadow-lg shadow-[#ff6b6b]/20 scale-105'
                : 'bg-[#131b2e] border border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tags Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        <span className="mono text-[10px] font-black text-neutral-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
          <Tag size={12} className="text-[#ff6b6b]" />
          {lang === 'tr' ? 'FİLTRELE:' : lang === 'ar' ? 'تصفية:' : 'TAGS:'}
        </span>
        {selectedTag && (
          <button
            onClick={() => {
              setSelectedTag(null);
              setVisibleCount(6);
            }}
            className="px-2.5 py-1 bg-[#ff6b6b]/20 border border-[#ff6b6b]/40 rounded-lg text-xs font-bold text-[#ff6b6b] flex items-center gap-1 hover:bg-[#ff6b6b]/30 transition-colors flex-shrink-0"
          >
            <span>{selectedTag}</span>
            <X size={12} />
          </button>
        )}
        {allTags.map((tag, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedTag(selectedTag === tag ? null : tag);
              setVisibleCount(6);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
              selectedTag === tag
                ? 'bg-[#ff6b6b] text-white font-bold'
                : 'bg-white/5 border border-white/10 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleWorks.map((item) => (
          <div
            key={item.id}
            onClick={() => setLightboxMedia(item)}
            onMouseEnter={() => item.type === 'video' && setHoveredVideoId(item.id)}
            onMouseLeave={() => item.type === 'video' && setHoveredVideoId(null)}
            className="group relative bg-[#131b2e] border border-white/5 hover:border-[#ff6b6b]/40 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(255,107,107,0.12)] flex flex-col justify-between"
          >
            {/* Media Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
              {item.type === 'video' ? (
                <div className="w-full h-full relative">
                  {hoveredVideoId === item.id ? (
                    <video
                      src={item.src}
                      poster={item.poster}
                      muted
                      autoPlay
                      loop
                      playsInline
                      preload="none"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.poster}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-[#ff6b6b]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={20} className="fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full relative">
                  <img
                    src={item.thumb}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={14} />
                  </div>
                </div>
              )}

              {/* Type Badge */}
              <div className="absolute top-3 left-3 pointer-events-none">
                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full mono text-[9px] font-black text-white uppercase tracking-wider flex items-center gap-1">
                  {item.type === 'video' ? (
                    <>
                      <Film size={10} className="text-[#ff6b6b]" />
                      VİDEO
                    </>
                  ) : (
                    <>
                      <ImageIcon size={10} className="text-blue-400" />
                      GÖRSEL
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-5 flex flex-col gap-3 text-start">
              <h3 className="text-base font-black text-white group-hover:text-[#ff6b6b] transition-colors leading-snug">
                {item.title}
              </h3>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTag(tag);
                      setVisibleCount(6);
                    }}
                    className="px-2 py-0.5 bg-white/5 border border-white/10 hover:border-[#ff6b6b]/30 rounded-md text-[10px] font-semibold text-neutral-300 hover:text-[#ff6b6b] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {visibleCount < filteredWorks.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-[#ff6b6b] hover:border-[#ff6b6b] text-white rounded-2xl mono text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2 shadow-lg"
          >
            {lang === 'tr' ? 'DAHA FAZLA ÖRNEK GÖSTER' : lang === 'ar' ? 'عرض المزيد من النماذج' : 'LOAD MORE SAMPLES'}
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          onClick={() => setLightboxMedia(null)}
        >
          <div
            className="relative bg-[#131b2e] border border-white/15 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxMedia(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-[#ff6b6b] transition-colors"
            >
              <X size={20} />
            </button>

            {/* Media Content */}
            <div className="flex-1 bg-black/80 flex items-center justify-center p-4 min-h-[300px] md:min-h-[450px]">
              {lightboxMedia.type === 'video' ? (
                <video
                  src={lightboxMedia.src}
                  poster={lightboxMedia.poster}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[70vh] w-full object-contain rounded-xl"
                />
              ) : (
                <img
                  src={lightboxMedia.full}
                  alt={lightboxMedia.title}
                  className="max-h-[70vh] w-full object-contain rounded-xl"
                />
              )}
            </div>

            {/* Side Info */}
            <div className="p-6 md:w-80 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 text-start">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 rounded-full mono text-[9px] font-black text-[#ff6b6b] uppercase">
                    {lightboxMedia.type === 'video' ? 'VİDEO PRODÜKSİYONU' : 'GÖRSEL PRODÜKSİYONU'}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mb-4 leading-tight">
                  {lightboxMedia.title}
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed mb-6">
                  {lang === 'tr'
                    ? 'Yüksek çözünürlüklü web ve e-ticaret uyumlu prodüksiyon. Yapay zeka ve profesyonel tasarım altyapısıyla hazırlanmıştır.'
                    : lang === 'ar'
                    ? 'إنتاج متوافق مع مواقع الويب والمتاجر الإلكترونية عالية الدقة، تم إعداده باستخدام أدوات ذكاء اصطناعي.'
                    : 'High-resolution web and e-commerce compliant production rendered with modern AI and visual design pipelines.'}
                </p>
                <div className="flex flex-col gap-2">
                  <span className="mono text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                    TAGLAR & ETİKETLER
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {lightboxMedia.tags.map((t, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-semibold text-[#ff6b6b]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/905394611684?text=${encodeURIComponent(`Merhaba, ${lightboxMedia.title} örneğine benzer bir görsel/video çalışması almak istiyorum.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 py-3.5 bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-center rounded-2xl mono text-[10px] font-black tracking-widest uppercase transition-all"
              >
                {lang === 'tr' ? 'BENZER ÇALIŞMA İSTEYİN' : lang === 'ar' ? 'اطلب عمل مشابه' : 'REQUEST SIMILAR WORK'}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
