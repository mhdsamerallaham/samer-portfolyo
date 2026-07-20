import { ShieldCheck, ExternalLink } from 'lucide-react';

export default function AuthorBox() {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#161a20] border border-gray-800/80 flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
      <img
        src="/avatar.jpeg"
        alt="Samer Allaham"
        className="w-16 h-16 rounded-full border-2 border-[#ff6b6b] object-cover flex-shrink-0 shadow-lg shadow-[#ff6b6b]/10"
      />
      <div className="space-y-1.5 flex-grow">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm sm:text-base font-bold text-white">İçerik Yazarı & Uzman: Samer Allaham</h4>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            Doğrulanmış E-Ticaret Uzmanı
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          Shopify & İKAS E-Ticaret Büyüme Uzmanı ve Yazılım Geliştirici. Özel API entegrasyonu, dönüşüm oranı (CRO), sayfa hızı optimizasyonu ve AI otomasyonlarında uzman.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#ff6b6b] pt-1">
          <a
            href="https://www.linkedin.com/in/samer-allaham-18a784162/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:underline font-medium"
          >
            LinkedIn Profil <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-gray-600">•</span>
          <a
            href="https://github.com/mhdsamerallaham"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:underline font-medium"
          >
            GitHub Projeleri <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
