import React from 'react';
import { Zap } from 'lucide-react';

export default function DirectAnswerBox({ answer = '' }) {
  if (!answer) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#ff6b6b]/15 via-purple-500/5 to-transparent border border-[#ff6b6b]/30 mb-6 shadow-sm">
      <div className="flex items-center gap-2 text-[#ff6b6b] text-xs font-extrabold uppercase tracking-wider mb-2">
        <Zap className="w-4 h-4 text-[#ff6b6b] animate-pulse" />
        Doğrudan Yanıt (Direct AI & Snippet Answer)
      </div>
      <p className="text-neutral-100 text-sm sm:text-base font-medium leading-relaxed">
        {answer}
      </p>
    </div>
  );
}
