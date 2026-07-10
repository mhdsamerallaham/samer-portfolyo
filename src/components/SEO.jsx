import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export default function SEO({ title, description, keywords = '', schema = null }) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'tr';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Base structured data for Samer's services
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Samer Allaham | E-Commerce Systems & Growth Specialist",
    "image": "https://www.samer.life/avatar.png",
    "@id": "https://www.samer.life/#professional-service",
    "url": "https://www.samer.life/",
    "telephone": "+905394611684",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Istanbul",
      "addressCountry": "TR"
    },
    "sameAs": [
      "https://github.com/mhdsamerallaham",
      "https://www.linkedin.com/in/samer-allaham-18a784162/"
    ],
    "description": "Samer is a Turkey-based software developer specializing in e-commerce systems and automation, building high-converting shops on Shopify & İKAS."
  };

  const finalSchema = schema ? { ...defaultSchema, ...schema } : defaultSchema;

  return (
    <Helmet>
      {/* HTML attributes (handles English, Turkish, Arabic and RTL layout direction) */}
      <html lang={lang} dir={dir} />
      
      {/* Search Engine Titles */}
      <title>{title} | Samer Allaham</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${title} | Samer Allaham`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:image" content="https://www.samer.life/avatar.png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | Samer Allaham`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://www.samer.life/avatar.png" />

      {/* JSON-LD Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
}
