-- Enterprise AI Knowledge Publishing Platform SQL Migration
-- Database: Supabase PostgreSQL

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SEARCH INTENTS
CREATE TABLE IF NOT EXISTS search_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    target_layout VARCHAR(50) NOT NULL,
    recommended_schema VARCHAR(50) NOT NULL
);

-- Seed basic search intents
INSERT INTO search_intents (code, description, target_layout, recommended_schema) VALUES
('informational', 'Knowledge articles explaining concepts', 'article', 'Article'),
('commercial', 'High intent purchasing decisions or software selection', 'comparison', 'Product'),
('troubleshooting', 'Step by step problem solving guides', 'guide', 'HowTo'),
('definition', 'Direct answer glossary and terminology explanations', 'faq', 'DefinedTerm'),
('comparison', 'Side by side comparison of software platforms or tools', 'comparison', 'ItemPage')
ON CONFLICT (code) DO NOTHING;

-- 2. TOPIC CLUSTERS
CREATE TABLE IF NOT EXISTS topic_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    pillar_page_url VARCHAR(500),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO topic_clusters (name, slug, description) VALUES
('E-Ticaret Altyapıları', 'e-ticaret-altyapilari', 'Shopify, İKAS, WooCommerce altyapıları ve karşılaştırmaları'),
('Dönüşüm Oranı Optimizasyonu (CRO)', 'donusum-orani-optimizasyonu', 'Sepet terki düşürme, UX optimizasyonu ve ödeme adımları'),
('E-Ticarette Yapay Zeka & Otomasyon', 'eticarette-yapay-zeka', 'Chatbot, otomatik stok ve AI destekli ürün açıklamaları')
ON CONFLICT (slug) DO NOTHING;

-- 3. TOPICS & DISCOVERY
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id UUID REFERENCES topic_clusters(id) ON DELETE SET NULL,
    intent_id UUID REFERENCES search_intents(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'google_paa',
    search_volume_tier VARCHAR(20) DEFAULT 'medium',
    difficulty_score INT DEFAULT 50,
    status VARCHAR(50) DEFAULT 'discovered',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ENTITIES (Entity DB)
CREATE TABLE IF NOT EXISTS entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    aliases TEXT[],
    description TEXT,
    entity_type VARCHAR(50) NOT NULL,
    official_website VARCHAR(500),
    official_docs VARCHAR(500),
    wikidata_id VARCHAR(50),
    schema_type VARCHAR(100) DEFAULT 'Thing',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed foundational entities
INSERT INTO entities (name, slug, entity_type, description, official_website, schema_type) VALUES
('Shopify', 'shopify', 'Platform', 'Küresel e-ticaret altyapı platformu', 'https://www.shopify.com', 'SoftwareApplication'),
('İKAS', 'ikas', 'Platform', 'Yerli yeni nesil e-ticaret altyapısı', 'https://ikas.com', 'SoftwareApplication'),
('Core Web Vitals', 'core-web-vitals', 'Metric', 'Google web performans ve kullanıcı deneyimi ölçütleri', 'https://web.dev/vitals/', 'DefinedTerm'),
('Dönüşüm Oranı (Conversion Rate)', 'conversion-rate', 'Metric', 'Ziyaretçilerin müşteriye dönüşme yüzdesi', NULL, 'DefinedTerm')
ON CONFLICT (slug) DO NOTHING;

-- 5. ENTITY RELATIONS (Knowledge Graph Edges)
CREATE TABLE IF NOT EXISTS entity_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    target_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    relation_type VARCHAR(100) NOT NULL,
    confidence_score NUMERIC(3,2) DEFAULT 1.00,
    UNIQUE(source_entity_id, target_entity_id, relation_type)
);

-- 6. KNOWLEDGE CHUNKS (Atomic Facts)
CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE SET NULL,
    fact_statement TEXT NOT NULL,
    source_type VARCHAR(50) NOT NULL DEFAULT 'official_doc',
    verifiability_score NUMERIC(3,2) DEFAULT 1.00,
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RESEARCH SOURCES
CREATE TABLE IF NOT EXISTS research_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    url VARCHAR(1000) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    authority_score INT DEFAULT 50,
    raw_content TEXT,
    summarized_facts JSONB,
    fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. EXPERT ANSWERS (EEAT Engine)
CREATE TABLE IF NOT EXISTS expert_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    expert_name VARCHAR(255) NOT NULL,
    expert_role VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    key_takeaway TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CONTENT ARTICLES (Multi-lingual & Multi-format)
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id) ON DELETE RESTRICT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content_type VARCHAR(50) NOT NULL DEFAULT 'Guide',
    
    title_tr VARCHAR(255) NOT NULL,
    summary_tr TEXT NOT NULL,
    content_html_tr TEXT NOT NULL,
    direct_answer_tr TEXT NOT NULL,
    who_is_this_for_tr TEXT,
    
    title_en VARCHAR(255) NOT NULL,
    summary_en TEXT NOT NULL,
    content_html_en TEXT NOT NULL,
    direct_answer_en TEXT NOT NULL,
    who_is_this_for_en TEXT,
    
    title_ar VARCHAR(255) NOT NULL,
    summary_ar TEXT NOT NULL,
    content_html_ar TEXT NOT NULL,
    direct_answer_ar TEXT NOT NULL,
    who_is_this_for_ar TEXT,
    
    published_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    embedding vector(1536)
);

-- 10. CONTENT SCORES (Quality Gatekeeping)
CREATE TABLE IF NOT EXISTS content_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    overall_score NUMERIC(5,2) NOT NULL,
    eeat_score NUMERIC(5,2) NOT NULL,
    entity_score NUMERIC(5,2) NOT NULL,
    citation_score NUMERIC(5,2) NOT NULL,
    readability_score NUMERIC(5,2) NOT NULL,
    spam_score NUMERIC(5,2) NOT NULL,
    ai_visibility_score NUMERIC(5,2) NOT NULL,
    helpful_content_score NUMERIC(5,2) NOT NULL,
    passed_gatekeeper BOOLEAN GENERATED ALWAYS AS (overall_score >= 90.00) STORED,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CITATIONS
CREATE TABLE IF NOT EXISTS citations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    source_url VARCHAR(1000) NOT NULL,
    citation_title VARCHAR(255) NOT NULL,
    quoted_text TEXT,
    anchor_text VARCHAR(255)
);

-- 12. SEMANTIC INTERNAL LINKS
CREATE TABLE IF NOT EXISTS internal_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    target_article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    anchor_text VARCHAR(255) NOT NULL,
    similarity_score NUMERIC(4,3) NOT NULL,
    link_context TEXT
);

-- 13. QUEUES & LOCKS
CREATE TABLE IF NOT EXISTS publish_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    scheduled_for TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    attempts INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS refresh_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    decay_reason VARCHAR(255) NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS cron_locks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_name VARCHAR(100) UNIQUE NOT NULL,
    is_processing BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_topics_slug ON topics(slug);
CREATE INDEX IF NOT EXISTS idx_entities_slug ON entities(slug);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
