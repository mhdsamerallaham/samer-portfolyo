import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Send, CheckCircle, RefreshCw } from 'lucide-react';

export default function ContactForm() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [platform, setPlatform] = useState('not_sure');
  const [budget, setBudget] = useState('tier1');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Pre-fill preferences from URL query strings
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('service');
    
    if (serviceParam) {
      if (serviceParam === 'site-kurulumu') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPlatform('shopify');
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBudget('tier2');
      } else if (serviceParam === 'optimizasyon') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBudget('tier1');
      } else if (serviceParam === 'stok-depo') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBudget('tier2');
      } else if (serviceParam === 'aylik-yonetim') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBudget('monthly');
      }
      
      const localeMessages = {
        tr: `Merhaba Samer, ${t(`services.items.${serviceParam}.title`)} hizmetiniz hakkında görüşmek istiyorum.`,
        en: `Hi Samer, I would like to inquire about your ${t(`services.items.${serviceParam}.title`)} service.`,
        ar: `مرحباً سامر، أود الاستفسار عن خدمة: ${t(`services.items.${serviceParam}.title`)}.`
      };
      
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessage(localeMessages[i18n.language] || localeMessages['tr']);
    }
  }, [location.search, i18n.language]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate database or API submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Clear form
      setName('');
      setEmail('');
      setPhone('');
      setWebsite('');
      setMessage('');
    }, 1200);
  };

  const getWhatsAppLink = () => {
    const waPhone = '905394611684';
    const waText = encodeURIComponent(t('contact_page.whatsapp_msg'));
    return `https://wa.me/${waPhone}?text=${waText}`;
  };

  if (success) {
    return (
      <div className="w-full bg-[#131b2e] border border-[#ff6b6b]/20 rounded-3xl p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 flex items-center justify-center text-[#ff6b6b] mb-6 animate-bounce">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-2xl font-black text-white mb-4">{t('contact_page.success')}</h3>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl mono text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
        >
          YENİ MESAJ GÖNDER
        </button>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#131b2e] border border-white/5 rounded-3xl p-6 md:p-10 relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b6b]/5 rounded-full blur-[60px] pointer-events-none" />

      {/* Left side details */}
      <div className="lg:col-span-4 flex flex-col justify-between gap-8">
        <div>
          <span className="mono text-[#ff6b6b] text-[9px] font-black uppercase tracking-widest block mb-4">
            // CONTACT_İNTİATİVE
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4">
            {t('contact_page.title')}
          </h3>
          <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-semibold">
            {t('contact_page.subtitle')}
          </p>
        </div>

        <div className="flex flex-col gap-6 border-t border-white/5 pt-6">
          <div>
            <span className="mono text-[8px] font-black text-neutral-400 tracking-wider uppercase block mb-1">
              DIRECT_MAİL
            </span>
            <a href="mailto:samerallaham3@gmail.com" className="text-sm md:text-base font-bold text-white hover:text-[#ff6b6b] transition-colors">
              SAMERALLAHAM3@GMAIL.COM
            </a>
          </div>

          <div>
            <span className="mono text-[8px] font-black text-neutral-400 tracking-wider uppercase block mb-2">
              QUİCK_CHANNEL
            </span>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 hover:bg-[#ff6b6b] hover:text-white text-[#ff6b6b] rounded-xl text-xs font-bold transition-all w-full sm:w-auto justify-center"
            >
              <MessageSquare size={16} />
              {t('contact_page.whatsapp_cta')}
            </a>
          </div>
        </div>
      </div>

      {/* Right side form */}
      <form onSubmit={handleSubmit} className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="mono text-[9px] font-black text-neutral-400 uppercase tracking-wider">
            {t('contact_page.name')}
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#0b0f19] border border-white/5 focus:border-[#ff6b6b]/40 focus:outline-none rounded-xl text-xs md:text-sm text-white transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="mono text-[9px] font-black text-neutral-400 uppercase tracking-wider">
            {t('contact_page.email')}
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#0b0f19] border border-white/5 focus:border-[#ff6b6b]/40 focus:outline-none rounded-xl text-xs md:text-sm text-white transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-phone" className="mono text-[9px] font-black text-neutral-400 uppercase tracking-wider">
            {t('contact_page.phone')}
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#0b0f19] border border-white/5 focus:border-[#ff6b6b]/40 focus:outline-none rounded-xl text-xs md:text-sm text-white transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-website" className="mono text-[9px] font-black text-neutral-400 uppercase tracking-wider">
            {t('contact_page.website')}
          </label>
          <input
            id="contact-website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full px-4 py-3 bg-[#0b0f19] border border-white/5 focus:border-[#ff6b6b]/40 focus:outline-none rounded-xl text-xs md:text-sm text-white transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-platform" className="mono text-[9px] font-black text-neutral-400 uppercase tracking-wider">
            {t('contact_page.platform')}
          </label>
          <select
            id="contact-platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-4 py-3 bg-[#0b0f19] border border-white/5 focus:border-[#ff6b6b]/40 focus:outline-none rounded-xl text-xs md:text-sm text-white transition-colors"
          >
            <option value="shopify">{t('contact_page.platform_select.shopify')}</option>
            <option value="ikas">{t('contact_page.platform_select.ikas')}</option>
            <option value="not_sure">{t('contact_page.platform_select.not_sure')}</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-budget" className="mono text-[9px] font-black text-neutral-400 uppercase tracking-wider">
            {t('contact_page.budget')}
          </label>
          <select
            id="contact-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-4 py-3 bg-[#0b0f19] border border-white/5 focus:border-[#ff6b6b]/40 focus:outline-none rounded-xl text-xs md:text-sm text-white transition-colors"
          >
            <option value="tier1">{t('contact_page.budget_select.tier1')}</option>
            <option value="tier2">{t('contact_page.budget_select.tier2')}</option>
            <option value="tier3">{t('contact_page.budget_select.tier3')}</option>
            <option value="monthly">{t('contact_page.budget_select.monthly')}</option>
          </select>
        </div>

        <div className="sm:col-span-2 flex flex-col gap-2">
          <label htmlFor="contact-message" className="mono text-[9px] font-black text-neutral-400 uppercase tracking-wider">
            {t('contact_page.message')}
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-3 bg-[#0b0f19] border border-white/5 focus:border-[#ff6b6b]/40 focus:outline-none rounded-xl text-xs md:text-sm text-white transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="sm:col-span-2 py-4 bg-[#ff6b6b] hover:bg-[#ff5252] disabled:bg-neutral-800 disabled:text-neutral-500 text-white rounded-xl mono text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {loading ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              {t('contact_page.submitting')}
            </>
          ) : (
            <>
              <Send size={14} />
              {t('contact_page.submit')}
            </>
          )}
        </button>

      </form>
    </div>
  );
}
