import React from 'react';
import { Tag } from 'lucide-react';

export default function EntityBadge({ name, type = 'Thing' }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-300 text-xs font-medium hover:border-[#ff6b6b]/40 hover:text-white transition-all cursor-pointer">
      <Tag className="w-3 h-3 text-[#ff6b6b]" />
      <span>{name}</span>
      <span className="text-[10px] text-neutral-500 font-mono">({type})</span>
    </span>
  );
}
