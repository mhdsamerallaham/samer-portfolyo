import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus } from 'lucide-react';

export default function FAQ({ items }) {
  const { t } = useTranslation();
  const [activeIdx, setActiveIdx] = useState(null);

  // Load FAQ list dynamically: use passed items, or fallback to general FAQs from locales
  const defaultItems = t('faq.items', { returnObjects: true }) || [];
  const faqItems = items || defaultItems;

  const toggleAccordion = (idx) => {
    setActiveIdx(activeIdx === idx ? null : idx);
  };

  if (!Array.isArray(faqItems) || faqItems.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3.5">
      {faqItems.map((item, idx) => {
        const isOpen = activeIdx === idx;
        return (
          <div
            key={idx}
            className={`border ${isOpen ? 'border-teal-300 shadow-md shadow-teal-500/5' : 'border-slate-200/90'} bg-white rounded-2xl transition-all duration-200 overflow-hidden text-left`}
          >
            <button
              onClick={() => toggleAccordion(idx)}
              className="w-full px-6 py-5 flex justify-between items-center text-left gap-4 hover:bg-slate-50/70 transition-colors focus:outline-none cursor-pointer"
            >
              <span className="font-display text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {item.q}
              </span>
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isOpen ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {isOpen ? <Minus size={15} /> : <Plus size={15} />}
              </span>
            </button>
            
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-[350px] border-t border-slate-100 bg-slate-50/60 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="px-6 py-5 text-slate-600 text-sm leading-relaxed">
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

