const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const lang = (req.query.lang || "tr").toLowerCase();

  try {
    const { data: entities } = await supabase.from('entities').select('*');
    const { data: relations } = await supabase.from('entity_relations').select('*');

    const defaultEntities = lang === 'ar'
      ? [
          { id: '1', name: 'Shopify', entity_type: 'منصة', schema_type: 'SoftwareApplication' },
          { id: '2', name: 'İKAS', entity_type: 'منصة', schema_type: 'SoftwareApplication' },
          { id: '3', name: 'Core Web Vitals', entity_type: 'مؤشر', schema_type: 'DefinedTerm' },
          { id: '4', name: 'معدل التحويل', entity_type: 'مؤشر', schema_type: 'DefinedTerm' },
        ]
      : lang === 'en'
      ? [
          { id: '1', name: 'Shopify', entity_type: 'Platform', schema_type: 'SoftwareApplication' },
          { id: '2', name: 'İKAS', entity_type: 'Platform', schema_type: 'SoftwareApplication' },
          { id: '3', name: 'Core Web Vitals', entity_type: 'Metric', schema_type: 'DefinedTerm' },
          { id: '4', name: 'Conversion Rate', entity_type: 'Metric', schema_type: 'DefinedTerm' },
        ]
      : [
          { id: '1', name: 'Shopify', entity_type: 'Platform', schema_type: 'SoftwareApplication' },
          { id: '2', name: 'İKAS', entity_type: 'Platform', schema_type: 'SoftwareApplication' },
          { id: '3', name: 'Core Web Vitals', entity_type: 'Metric', schema_type: 'DefinedTerm' },
          { id: '4', name: 'Dönüşüm Oranı', entity_type: 'Metric', schema_type: 'DefinedTerm' },
        ];

    return res.status(200).json({
      success: true,
      nodes: entities && entities.length > 0 ? entities : defaultEntities,
      edges: relations && relations.length > 0 ? relations : [],
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
