import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import ContactForm from '../components/ContactForm';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <div className="pt-32 pb-24 text-white min-h-screen text-start">
      <SEO
        title={t('nav.contact')}
        description={t('contact_page.subtitle')}
        keywords="samer allaham iletişim, e ticaret danışmanlık teklif al, shopify uzmanı iletişime geç"
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col gap-12">
        {/* Contact Form component wrapper */}
        <div className="mt-8">
          <ContactForm />
        </div>

        {/* Google Maps Embed Section */}
        <div className="w-full bg-[#131b2e] border border-white/5 rounded-3xl p-6 md:p-10 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b6b]/5 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex flex-col gap-3 mb-8">
            <span className="mono text-[#ff6b6b] text-[9px] font-black uppercase tracking-widest block">
              // OFFİCE_LOCATİON
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
              {t('contact_page.map_title')}
            </h3>
            <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-semibold">
              {t('contact_page.map_subtitle')}
            </p>
          </div>

          <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-white/10 relative">
            <iframe
              src="https://maps.google.com/maps?q=Samer%20%7C%20E-Ticaret%20%26%20Web%20Tasar%C4%B1m%20%26%20Yaz%C4%B1l%C4%B1m%20Istanbul&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
