import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import ContactForm from '../components/ContactForm';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <div className="pt-32 pb-24 text-white min-h-screen text-left">
      <SEO
        title={t('nav.contact')}
        description={t('contact_page.subtitle')}
        keywords="e ticaret teklif al, shopify danışmanlık, ikas danışmanlık, samer allaham iletişim"
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="mono text-[#00ffaa] text-[9px] font-black uppercase tracking-widest block mb-4">
            // PROJECT_INITIATIVE
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
            {t('nav.contact')}
          </h1>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed font-semibold">
            {t('contact_page.subtitle')}
          </p>
        </div>

        {/* Contact form component */}
        <ContactForm />
        
      </div>
    </div>
  );
}
