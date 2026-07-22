const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  try {
    const { data: entities } = await supabase.from('entities').select('*');
    const { data: relations } = await supabase.from('entity_relations').select('*');

    const defaultEntities = [
      { id: '1', name: 'Shopify', entity_type: 'Platform', schema_type: 'SoftwareApplication' },
      { id: '2', name: 'İKAS', entity_type: 'Platform', schema_type: 'SoftwareApplication' },
      { id: '3', name: 'Core Web Vitals', entity_type: 'Metric', schema_type: 'DefinedTerm' },
      { id: '4', name: 'Dönüşüm Oranı', entity_type: 'Metric', schema_type: 'DefinedTerm' },
    ];

    const defaultRelations = [
      { source_entity_id: '1', target_entity_id: '3', relation_type: 'OPTIMIZES' },
      { source_entity_id: '2', target_entity_id: '3', relation_type: 'OPTIMIZES' },
      { source_entity_id: '3', target_entity_id: '4', relation_type: 'IMPROVES' },
    ];

    return res.status(200).json({
      success: true,
      nodes: entities && entities.length > 0 ? entities : defaultEntities,
      edges: relations && relations.length > 0 ? relations : defaultRelations,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
