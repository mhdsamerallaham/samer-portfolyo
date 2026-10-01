import { ShieldCheck, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AuthorBox() {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'tr';
  const isAr = lang === 'ar';
  const isEn = lang === 'en';

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8 text-start">
      <img
        src="/avatar.jpeg"
        alt={isAr ? 'سامر اللحام - خبير تجارة إلكترونية وتطوير برمجيات' : isEn ? 'Samer Allaham - E-Commerce & Full-Stack Engineer' : 'Samer Allaham - E-Ticaret ve Web Geliştirme Uzmanı'}
        className="w-16 h-16 rounded-2xl border-2 border-teal-500/30 object-cover flex-shrink-0 shadow-sm"
      />
      <div className="space-y-1.5 flex-grow">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm sm:text-base font-extrabold font-display text-slate-900">
            {isAr ? 'الكاتب والخبير التقني: سامر اللحام' : isEn ? 'Author & Technical Expert: Samer Allaham' : 'İçerik Yazarı & Uzman: Samer Allaham'}
          </h4>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            {isAr ? 'خبير معتمد في التجارة الإلكترونية' : isEn ? 'Verified E-Commerce Specialist' : 'Doğrulanmış E-Ticaret Uzmanı'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          {isAr
            ? 'مهندس برمجيات وخبير نمو التجارة الإلكترونية لمنصتي شوبيفاي وإيكاس. متخصص في تحسين معدل التحويل (CRO) وتكامل واجهات API وسرعة المواقع.'
            : isEn
            ? 'Senior Full-Stack Developer & E-Commerce Growth Engineer specializing in Shopify & İKAS. Expert in conversion rate optimization (CRO), custom API integrations, Core Web Vitals, and AI automation.'
            : 'Shopify & İKAS E-Ticaret Büyüme Uzmanı ve Yazılım Geliştirici. Özel API entegrasyonu, dönüşüm oranı (CRO), sayfa hızı optimizasyonu ve AI otomasyonlarında uzman.'}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-teal-700 pt-1">
          <a
            href="https://www.linkedin.com/in/samer-allaham-18a784162/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-teal-900 font-bold"
          >
            LinkedIn <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-slate-300">•</span>
          <a
            href="https://github.com/mhdsamerallaham"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-teal-900 font-bold"
          >
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
