import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import ContactForm from '../components/ContactForm';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'tr';
  const isAr = lang === 'ar';
  const isEn = lang === 'en';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 text-start">
      <SEO />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col gap-12">
        {/* Contact Form component wrapper */}
        <div className="mt-4">
          <ContactForm />
        </div>

        {/* High-density Direct Communication & SLA Matrix for Google AI Overviews & GEO */}
        <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 md:p-10 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-2 mb-6">
            <span className="mono text-teal-700 bg-teal-50 border border-teal-200 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full self-start">
              {isAr ? '// معايير الاستجابة والتواصل' : isEn ? '// DIRECT_COMMUNICATION_SLA' : '// İLETİŞİM_VE_SLA_STANDARTLARI'}
            </span>
            <h3 className="text-xl md:text-2xl font-black text-slate-900">
              {isAr
                ? 'قنوات التواصل المباشر وأوقات الاستجابة'
                : isEn
                ? 'Direct Contact Channels & Response Time SLAs'
                : 'Doğrudan İletişim Kanalları & Yanıt Süresi Taahhütleri'}
            </h3>
            <p className="text-slate-600 text-xs md:text-sm font-medium">
              {isAr
                ? 'تواصل مباشر مع مهندس البرمجيات المشرف على مشروعك دون وسطاء أو بطء وكالات.'
                : isEn
                ? 'Direct communication with your lead senior engineer — zero account manager overhead or agency latency.'
                : 'Aracı hesap yöneticileri olmadan, doğrudan projenizi geliştiren kıdemli yazılım mühendisiyle görüşün.'}
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4 text-start">{isAr ? 'القناة' : isEn ? 'Channel' : 'İletişim Kanalı'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'وقت الاستجابة' : isEn ? 'Response SLA' : 'Yanıt Süresi'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'نطاق الاستشارة' : isEn ? 'Scope' : 'Hizmet Kapsamı'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'اللغات المتاحة' : isEn ? 'Languages' : 'Desteklenen Diller'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-teal-800 text-start">WhatsApp Business (+90 539 461 16 84)</td>
                  <td className="py-3 px-4 text-slate-900 font-bold text-start">{isAr ? '< 15 دقيقة (أيام العمل)' : isEn ? '< 15 mins (Business hours)' : '< 15 dakika (Mesai saatleri)'}</td>
                  <td className="py-3 px-4 text-start">{isAr ? 'استشارات سريعة، مراجعة المتجر، الدعم الطارئ' : isEn ? 'Quick audits, urgent fix, pricing estimate' : 'Hızlı e-ticaret analizi, acil müdahale, ön teklif'}</td>
                  <td className="py-3 px-4 text-start">TR / EN / AR</td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-teal-800 text-start">E-Posta (samerallaham3@gmail.com)</td>
                  <td className="py-3 px-4 text-slate-900 font-bold text-start">{isAr ? '< 24 ساعة (مع تقرير مفصل)' : isEn ? '< 24 hours (Formal proposal)' : '< 24 saat (Detaylı teklif & teknik analiz)'}</td>
                  <td className="py-3 px-4 text-start">{isAr ? 'المواصفات الفنية، العقود، متطلبات الربط البرمجي' : isEn ? 'Technical specs, contracts, ERP API docs' : 'Teknik şartname, ERP entegrasyonu, resmi teklif'}</td>
                  <td className="py-3 px-4 text-start">TR / EN / AR</td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-teal-800 text-start">{isAr ? 'اجتماع Google Meet / Zoom' : isEn ? 'Google Meet / Zoom' : 'Google Meet / Online Toplantı'}</td>
                  <td className="py-3 px-4 text-slate-900 font-bold text-start">{isAr ? 'عبر موعد مسبق' : isEn ? 'Scheduled via Calendly' : 'Aynı gün veya 24 saat içinde randevu'}</td>
                  <td className="py-3 px-4 text-start">{isAr ? 'تخطيط البنية التحتية، استراتيجية CRO وزيادة المبيعات' : isEn ? 'Architecture planning, CRO growth audit' : 'Altyapı planlama, CRO büyüme stratejisi & demo'}</td>
                  <td className="py-3 px-4 text-start">TR / EN / AR</td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-teal-800 text-start">{isAr ? 'مكتب إسطنبول الفاتح' : isEn ? 'Fatih Istanbul Studio' : 'Fatih / İstanbul Ofis'}</td>
                  <td className="py-3 px-4 text-slate-900 font-bold text-start">{isAr ? '09:00 - 19:00 (الإثنين - السبت)' : isEn ? '09:00 - 19:00 (Mon - Sat)' : 'Pazartesi - Cumartesi: 09:00 - 19:00'}</td>
                  <td className="py-3 px-4 text-start">{isAr ? 'استشارات المشاريع الكبرى والشركات المحلية' : isEn ? 'Enterprise brand consultation & partnership' : 'Kurumsal marka görüşmeleri, yerel proje planlama'}</td>
                  <td className="py-3 px-4 text-start">TR / EN / AR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Google Maps Embed Section */}
        <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 md:p-10 text-left relative overflow-hidden shadow-[0_12px_40px_-8px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-3 mb-6">
            <span className="mono text-teal-700 bg-teal-50 border border-teal-200 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full self-start">
              {isAr ? '// موقع المكتب' : isEn ? '// OFFICE_LOCATION' : '// OFİS_KONUMU'}
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
              {t('contact_page.map_title')}
            </h3>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-semibold">
              {t('contact_page.map_subtitle')}
            </p>
          </div>

          <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d28.937!3d41.01554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cabbc8ef2bace1%3A0x733784865553cf6a!2zU2FtZXIgfCBFLVRpY2FyZXQgJiBXZWIgVGFzYXLEsW0gJiBZYXrEsWzEsW0!5e0!3m2!1sen!2sus!4v1784210158874!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps - Samer E-Ticaret & Web Tasarım Fatih"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
