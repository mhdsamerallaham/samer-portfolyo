import React from 'react';
import { Tag } from 'lucide-react';

export default function EntityBadge({ name, type = 'Thing' }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold hover:border-teal-400 hover:bg-teal-50 hover:text-teal-900 transition-all cursor-pointer shadow-2xs">
      <Tag className="w-3 h-3 text-teal-600" />
      <span>{name}</span>
      <span className="text-[10px] text-slate-400 font-mono">({type})</span>
    </span>
  );
}
