import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap } from 'lucide-react';

export default function DirectAnswerBox({ answer = '' }) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  if (!answer) return null;

  const titleText = isArabic
    ? 'الإجابة المباشرة (Direct AI Answer)'
    : i18n.language === 'en'
    ? 'Direct Answer (Direct AI & Snippet Answer)'
    : 'Doğrudan Yanıt (Direct AI & Snippet Answer)';

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#ff6b6b]/15 via-purple-500/5 to-transparent border border-[#ff6b6b]/30 mb-6 shadow-sm"
    >
      <div className="flex items-center gap-2 text-[#ff6b6b] text-xs font-extrabold uppercase tracking-wider mb-2">
        <Zap className="w-4 h-4 text-[#ff6b6b] animate-pulse" />
        {titleText}
      </div>
      <p className="text-neutral-100 text-sm sm:text-base font-medium leading-relaxed">
        {answer}
      </p>
    </div>
  );
}
