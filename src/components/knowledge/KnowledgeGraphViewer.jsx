import React, { useState, useEffect } from 'react';
import { Network, Sparkles, ExternalLink } from 'lucide-react';
import EntityBadge from './EntityBadge';

export default function KnowledgeGraphViewer() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/public/knowledge-graph')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && data.nodes) {
          setGraphData(data);
        }
      })
      .catch((err) => {
        console.warn('Knowledge graph fetch fallback:', err);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const defaultNodes = [
    { name: 'Shopify', type: 'Platform' },
    { name: 'İKAS', type: 'Platform' },
    { name: 'Core Web Vitals', type: 'Metric' },
    { name: 'Dönüşüm Oranı', type: 'Metric' },
    { name: 'Yapay Zeka Chatbot', type: 'Automation' },
  ];

  const nodes = graphData.nodes && graphData.nodes.length > 0 ? graphData.nodes : defaultNodes;

  return (
    <div className="p-6 rounded-2xl bg-[#161a20] border border-gray-800 my-8">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-2 text-white text-base font-bold">
          <Network className="w-5 h-5 text-[#ff6b6b]" />
          Knowledge Graph & Entity Map
        </div>
        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Dynamic Semantic Nodes
        </span>
      </div>

      <p className="text-gray-400 text-xs sm:text-sm mb-4">
        Bu platformdaki içerikler, arama motorları ve AI modelleri için aşağıdaki varlıklar (entities) ve ilişkiler ile düğümlenmiştir:
      </p>

      <div className="flex flex-wrap gap-2.5">
        {nodes.map((node, index) => (
          <EntityBadge key={index} name={node.name} type={node.entity_type || node.type || 'Thing'} />
        ))}
      </div>
    </div>
  );
}
