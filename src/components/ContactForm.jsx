import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Send, CheckCircle, RefreshCw, AlertTriangle, Sparkles, Phone, Mail } from 'lucide-react';

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
  const [errorState, setErrorState] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorState(false);

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'service_18xug9v',
          template_id: 'template_09f1lha',
          user_id: '50-13_kP15j3mN1YQ',
          template_params: {
            name: name,
            email: email,
            phone: phone,
            website: website,
            platform: platform,
            budget: budget,
            message: message,
          },
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setName(''); setEmail(''); setPhone(''); setWebsite(''); setMessage('');
      } else {
        setErrorState(true);
      }
    } catch (err) {
      console.error('Form submission network error:', err);
      setErrorState(true);
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppLink = () => {
    const waPhone = '905394611684';
    const waText = encodeURIComponent(t('contact_page.whatsapp_msg'));
    return `https://wa.me/${waPhone}?text=${waText}`;
  };

  const getWhatsAppCustomLink = () => {
    const waPhone = '905394611684';
    const budgetText = budget === 'tier1' ? '10k-25k TL' : budget === 'tier2' ? '25k-50k TL' : budget === 'tier3' ? '50k-100k TL+' : 'Aylık Yönetim';
    const platformText = platform === 'shopify' ? 'Shopify' : platform === 'ikas' ? 'İKAS' : 'Belirsiz';
    const msg = i18n.language === 'tr' 
      ? `Merhaba Samer, ben ${name}. E-ticaret sitem için teklif almak istiyorum. Bütçem: ${budgetText}. Tercih ettiğim altyapı: ${platformText}. E-posta adresim: ${email}. Telefonum: ${phone}. Sitem: ${website || 'Yok'}. Mesajım: ${message}`
      : `Hi Samer, I am ${name}. I would like to get a quote for my e-commerce project. Budget: ${budgetText}. Platform: ${platformText}. Email: ${email}. Phone: ${phone}. Website: ${website || 'None'}. Message: ${message}`;
    return `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;
  };

  if (success) {
    return (
      <div className="w-full bg-white border border-teal-200 rounded-3xl p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[400px] shadow-lg">
        <div className="w-16 h-16 rounded-full bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-600 mb-6">
          <CheckCircle size={32} />
        </div>
        <h3 className="font-display text-2xl font-extrabold text-slate-900 mb-2">{t('contact_page.success')}</h3>
        <p className="text-slate-600 text-sm max-w-md mb-6">
          {i18n.language === 'tr' 
            ? 'Mesajınız başarıyla iletildi. 24 saat içinde dönüş yapacağım.' 
            : 'Your message has been received. I will reply within 24 hours.'}
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          {i18n.language === 'tr' ? 'Yeni Mesaj Gönder' : i18n.language === 'ar' ? 'إرسال رسالة جديدة' : 'Send New Message'}
        </button>
      </div>
    );
  }

  if (errorState) {
    return (
      <div className="w-full bg-white border border-amber-200 rounded-3xl p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[400px] shadow-lg">
        <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 mb-6">
          <AlertTriangle size={32} />
        </div>
        <h3 className="font-display text-xl md:text-2xl font-extrabold text-slate-900 mb-2">
          {i18n.language === 'tr' ? 'Bağlantı Bildirimi' : i18n.language === 'ar' ? 'تنبيه الاتصال' : 'Direct Message'}
        </h3>
        <p className="text-slate-600 text-sm max-w-md leading-relaxed mb-6">
          {i18n.language === 'tr' 
            ? 'Form bilgilerinizi doğrudan WhatsApp üzerinden ileterek anında yanıt alabilirsiniz.' 
            : 'You can also send your request directly via WhatsApp for an immediate response.'}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href={getWhatsAppCustomLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            {i18n.language === 'tr' ? 'WhatsApp ile Gönder' : 'Send via WhatsApp'}
          </a>
          <button
            onClick={() => setErrorState(false)}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            {i18n.language === 'tr' ? 'Tekrar Dene' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 relative shadow-[0_12px_40px_-8px_rgba(15,23,42,0.06)] text-left">
      
      {/* Left side details */}
      <div className="lg:col-span-5 flex flex-col justify-between gap-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={13} className="text-teal-600" />
            <span>{i18n.language === 'tr' ? 'Ücretsiz Proje Analizi' : i18n.language === 'ar' ? 'تحليل مجاني للمشروع' : 'Free Project Audit'}</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-3">
            {t('contact_page.title')}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t('contact_page.subtitle')}
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
              <Mail size={18} className="text-teal-600" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">E-POSTA</span>
              <a href="mailto:samerallaham3@gmail.com" className="text-sm font-bold text-slate-900 hover:text-teal-600 transition-colors">
                samerallaham3@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 flex-shrink-0">
              <Phone size={18} className="text-teal-600" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">HIZLI YANIT</span>
              <a href="tel:+905394611684" className="text-sm font-bold text-slate-900 hover:text-teal-600 transition-colors">
                +90 539 461 16 84
              </a>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-teal-50 border border-teal-200 hover:bg-teal-600 hover:text-white text-teal-800 rounded-xl text-xs font-bold transition-all w-full justify-center group"
            >
              <MessageSquare size={16} className="text-teal-600 group-hover:text-white transition-colors" />
              <span>{t('contact_page.whatsapp_cta')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Right side form */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className="text-xs font-bold text-slate-700">
            {t('contact_page.name')} <span className="text-orange-500">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-none rounded-xl text-sm text-slate-900 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className="text-xs font-bold text-slate-700">
            {t('contact_page.email')} <span className="text-orange-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-none rounded-xl text-sm text-slate-900 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-phone" className="text-xs font-bold text-slate-700">
            {t('contact_page.phone')} <span className="text-orange-500">*</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-none rounded-xl text-sm text-slate-900 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-website" className="text-xs font-bold text-slate-700">
            {t('contact_page.website')}
          </label>
          <input
            id="contact-website"
            type="url"
            placeholder="https://"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-none rounded-xl text-sm text-slate-900 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-platform" className="text-xs font-bold text-slate-700">
            {t('contact_page.platform')}
          </label>
          <select
            id="contact-platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-none rounded-xl text-sm text-slate-900 transition-colors"
          >
            <option value="shopify">{t('contact_page.platform_select.shopify')}</option>
            <option value="ikas">{t('contact_page.platform_select.ikas')}</option>
            <option value="not_sure">{t('contact_page.platform_select.not_sure')}</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-budget" className="text-xs font-bold text-slate-700">
            {t('contact_page.budget')}
          </label>
          <select
            id="contact-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-none rounded-xl text-sm text-slate-900 transition-colors"
          >
            <option value="tier1">{t('contact_page.budget_select.tier1')}</option>
            <option value="tier2">{t('contact_page.budget_select.tier2')}</option>
            <option value="tier3">{t('contact_page.budget_select.tier3')}</option>
            <option value="monthly">{t('contact_page.budget_select.monthly')}</option>
          </select>
        </div>

        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label htmlFor="contact-message" className="text-xs font-bold text-slate-700">
            {t('contact_page.message')} <span className="text-orange-500">*</span>
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-none rounded-xl text-sm text-slate-900 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="sm:col-span-2 py-3.5 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>{t('contact_page.submitting')}</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>{t('contact_page.submit')}</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}
