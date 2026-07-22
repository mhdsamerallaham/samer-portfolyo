import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Network, Sparkles } from 'lucide-react';
import EntityBadge from './EntityBadge';

export default function KnowledgeGraphViewer() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const isEnglish = i18n.language === 'en';

  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    let active = true;
    fetch(`/api/routes/public/knowledge-graph?lang=${i18n.language}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && data.nodes) {
          setGraphData(data);
        }
      })
      .catch((err) => {
        console.warn('Knowledge graph fetch fallback:', err);
      });

    return () => {
      active = false;
    };
  }, [i18n.language]);

  const defaultNodes = isArabic
    ? [
        { name: 'Shopify', type: 'منصة' },
        { name: 'İKAS', type: 'منصة' },
        { name: 'Core Web Vitals', type: 'مؤشر' },
        { name: 'معدل التحويل', type: 'مؤشر' },
        { name: 'شات بوت الذكاء الاصطناعي', type: 'أتمتة' },
      ]
    : isEnglish
    ? [
        { name: 'Shopify', type: 'Platform' },
        { name: 'İKAS', type: 'Platform' },
        { name: 'Core Web Vitals', type: 'Metric' },
        { name: 'Conversion Rate', type: 'Metric' },
        { name: 'AI Chatbot', type: 'Automation' },
      ]
    : [
        { name: 'Shopify', type: 'Platform' },
        { name: 'İKAS', type: 'Platform' },
        { name: 'Core Web Vitals', type: 'Metric' },
        { name: 'Dönüşüm Oranı', type: 'Metric' },
        { name: 'Yapay Zeka Chatbot', type: 'Otomasyon' },
      ];

  const nodes = graphData.nodes && graphData.nodes.length > 0 ? graphData.nodes : defaultNodes;

  const headerTitle = isArabic
    ? 'خريطة المفاهيم وخريطة المعرفة'
    : isEnglish
    ? 'Knowledge Graph & Entity Map'
    : 'Knowledge Graph & Varlık Haritası';

  const subText = isArabic
    ? 'تم ربط المحتوى في هذه المنصة لمحركات البحث ونماذج الذكاء الاصطناعي باستخدام الكيانات والعلاقات التالية:'
    : isEnglish
    ? 'Content on this platform is interconnected for search engines and AI models using the following entities and relations:'
    : 'Bu platformdaki içerikler, arama motorları ve AI modelleri için aşağıdaki varlıklar (entities) ve ilişkiler ile düğümlenmiştir:';

  const badgeText = isArabic
    ? 'عقد معرفية ديناميكية'
    : isEnglish
    ? 'Dynamic Knowledge Nodes'
    : 'Dinamik Varlık Düğümleri';

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="p-6 rounded-2xl bg-[#161a20] border border-gray-800 my-8">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-2 text-white text-base font-bold">
          <Network className="w-5 h-5 text-[#ff6b6b]" />
          {headerTitle}
        </div>
        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> {badgeText}
        </span>
      </div>

      <p className="text-gray-400 text-xs sm:text-sm mb-4 leading-relaxed">
        {subText}
      </p>

      <div className="flex flex-wrap gap-2.5">
        {nodes.map((node, index) => (
          <EntityBadge key={index} name={node.name} type={node.entity_type || node.type || 'Thing'} />
        ))}
      </div>
    </div>
  );
}
