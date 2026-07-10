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
        keywords="samer allaham iletişim, e ticaret danışmanlık teklif al, shopify uzmanı iletişime geç"
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Contact Form component wrapper */}
        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
