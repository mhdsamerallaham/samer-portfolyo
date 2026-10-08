-- ========================================================
-- 002_autoseo_mvp_schema.sql
-- AutoSEO MVP Database Schema (Samer.life)
-- Safe, Non-Destructive Migration
-- ========================================================

-- 1. Google Search Console Verileri (Idempotent Depolama)
CREATE TABLE IF NOT EXISTS search_console_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    page VARCHAR(1000) NOT NULL,
    query VARCHAR(500) NOT NULL,
    country VARCHAR(10) DEFAULT 'ALL',
    device VARCHAR(20) DEFAULT 'ALL',
    clicks INT DEFAULT 0,
    impressions INT DEFAULT 0,
    ctr NUMERIC(6,4) DEFAULT 0,
    position NUMERIC(5,2) DEFAULT 0,
    is_demo BOOLEAN DEFAULT FALSE,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date, page, query, country, device)
);

CREATE INDEX IF NOT EXISTS idx_gsc_date_page ON search_console_data(date DESC, page);
CREATE INDEX IF NOT EXISTS idx_gsc_query ON search_console_data(query);
CREATE INDEX IF NOT EXISTS idx_gsc_impressions ON search_console_data(impressions DESC);

-- 2. Keyword & İçerik Fırsatları
CREATE TABLE IF NOT EXISTS seo_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_type VARCHAR(50) NOT NULL, -- 'title_ctr', 'position_4_10', 'position_11_20', 'cannibalization', 'new_keyword'
    priority VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'critical', 'high', 'medium', 'low'
    opportunity_score INT NOT NULL DEFAULT 50, -- 0 - 100
    target_query VARCHAR(500) NOT NULL,
    target_page VARCHAR(1000),
    current_position NUMERIC(5,2),
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    ctr NUMERIC(6,4) DEFAULT 0,
    reason TEXT NOT NULL,
    action_type VARCHAR(50) NOT NULL DEFAULT 'update_existing_article', -- 'update_existing_article', 'new_article', 'title_meta_only', 'internal_link_boost'
    recommendations JSONB DEFAULT '{}', -- { title, h1, subtopics, missing_entities, faqs, internal_links }
    status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'approved', 'applied', 'dismissed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_opp_score ON seo_opportunities(opportunity_score DESC);
CREATE INDEX IF NOT EXISTS idx_seo_opp_status ON seo_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_seo_opp_query ON seo_opportunities(target_query);

-- 3. İç Linkleme Önerileri (Metin İçi Doğal Linkler)
CREATE TABLE IF NOT EXISTS seo_internal_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_url VARCHAR(1000) NOT NULL,
    target_url VARCHAR(1000) NOT NULL,
    anchor_text VARCHAR(255) NOT NULL,
    context_sentence TEXT,
    relevance_score NUMERIC(4,3) DEFAULT 1.0,
    status VARCHAR(30) DEFAULT 'suggested', -- 'suggested', 'approved', 'applied', 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_internal_links_source ON seo_internal_links(source_url);

-- 4. Değişiklik Günlüğü ve Geri Alma (Change Log & Revert)
CREATE TABLE IF NOT EXISTS seo_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID REFERENCES seo_opportunities(id) ON DELETE SET NULL,
    page_url VARCHAR(1000) NOT NULL,
    target_table VARCHAR(50) NOT NULL DEFAULT 'blog_posts', -- 'blog_posts', 'faq_posts', 'seo_meta'
    target_id TEXT NOT NULL, -- blog_posts slug veya UUID
    field_changed VARCHAR(100) NOT NULL, -- 'title_tr', 'content_tr', 'seo_title_tr', 'seo_description_tr' vb.
    before_value TEXT,
    after_value TEXT,
    diff_summary JSONB DEFAULT '{}', -- { added_headings: [], added_links: [], title_diff: {} }
    change_reason TEXT NOT NULL,
    change_mode VARCHAR(20) NOT NULL DEFAULT 'assisted', -- 'assisted', 'manual', 'auto'
    status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'approved', 'applied', 'reverted'
    applied_at TIMESTAMPTZ,
    reverted_at TIMESTAMPTZ,
    applied_by VARCHAR(50) DEFAULT 'user_approval',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_changes_status ON seo_changes(status);
CREATE INDEX IF NOT EXISTS idx_seo_changes_target ON seo_changes(target_table, target_id);

-- 5. Before / After Ölçüm ve Sonuç Takibi
CREATE TABLE IF NOT EXISTS seo_change_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    change_id UUID REFERENCES seo_changes(id) ON DELETE CASCADE,
    metrics_before JSONB NOT NULL, -- { position: 12.2, impressions: 3400, clicks: 45, ctr: 0.013 }
    metrics_after_7d JSONB,
    metrics_after_14d JSONB,
    outcome VARCHAR(30) DEFAULT 'pending', -- 'pending', 'positive', 'neutral', 'negative', 'insufficient_data'
    evaluated_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_results_outcome ON seo_change_results(outcome);

-- 6. Technical SEO Crawler & Sorun Takibi (Technical Audit & Issues)
CREATE TABLE IF NOT EXISTS seo_crawl_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    total_pages INT DEFAULT 0,
    healthy_pages INT DEFAULT 0,
    pages_with_warnings INT DEFAULT 0,
    pages_with_errors INT DEFAULT 0,
    avg_score NUMERIC(5,2) DEFAULT 0,
    status VARCHAR(30) DEFAULT 'completed' -- 'running', 'completed', 'failed'
);

CREATE TABLE IF NOT EXISTS seo_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crawl_run_id UUID REFERENCES seo_crawl_runs(id) ON DELETE CASCADE,
    url VARCHAR(1000) NOT NULL,
    issue_type VARCHAR(100) NOT NULL, -- 'missing_meta_description', 'missing_alt_text', 'missing_h1', 'multiple_h1', 'canonical_issue', 'broken_link' vb.
    severity VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'critical', 'high', 'medium', 'low', 'info'
    element_snippet TEXT,
    recommendation TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'open', -- 'open', 'approved', 'applied', 'ignored'
    action_mode VARCHAR(20) DEFAULT 'assisted', -- Güvenlik için 'assisted' (otomatik riskli işlem yok)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_issues_url ON seo_issues(url);
CREATE INDEX IF NOT EXISTS idx_seo_issues_severity ON seo_issues(severity);
CREATE INDEX IF NOT EXISTS idx_seo_issues_status ON seo_issues(status);
