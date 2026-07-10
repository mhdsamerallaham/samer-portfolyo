import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus } from 'lucide-react';

export default function FAQ() {
  const { t } = useTranslation();
  const [activeIdx, setActiveIdx] = useState(null);

  // Load FAQ list dynamically from locales JSON
  const faqItems = t('faq.items', { returnObjects: true }) || [];

  const toggleAccordion = (idx) => {
    setActiveIdx(activeIdx === idx ? null : idx);
  };

  if (!Array.isArray(faqItems) || faqItems.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      {faqItems.map((item, idx) => {
        const isOpen = activeIdx === idx;
        return (
          <div
            key={idx}
            className="border border-white/5 bg-[#131b2e] rounded-2xl transition-all duration-300 overflow-hidden text-left"
          >
            <button
              onClick={() => toggleAccordion(idx)}
              className="w-full px-6 py-5 md:py-6 flex justify-between items-center text-left gap-4 hover:bg-white/[0.01] transition-colors focus:outline-none cursor-pointer"
            >
              <span className="text-sm md:text-base font-bold text-white leading-relaxed">
                {item.q}
              </span>
              <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400 flex-shrink-0 transition-transform">
                {isOpen ? <Minus size={14} className="text-[#ff6b6b]" /> : <Plus size={14} />}
              </span>
            </button>
            
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-[300px] border-t border-white/5 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="px-6 py-5 md:py-6 text-neutral-400 text-xs md:text-sm leading-relaxed font-semibold">
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
