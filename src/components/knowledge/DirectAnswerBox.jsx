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
      className="p-4 sm:p-5 rounded-2xl bg-teal-50/70 border border-teal-200/90 mb-6 shadow-xs text-start"
    >
      <div className="flex items-center gap-2 text-teal-800 text-xs font-black uppercase tracking-wider mb-2">
        <Zap className="w-4 h-4 text-teal-600 animate-pulse" />
        {titleText}
      </div>
      <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
        {answer}
      </p>
    </div>
  );
}
