-- ========================================================
-- 003_ai_budget_manager_schema.sql
-- AutoSEO AI Budget Manager, Task Queue, Cache & State Schema
-- Safe, Idempotent Migration for Supabase Postgres
-- ========================================================

-- 1. AI Bütçe ve Güvenlik Ayarları (Admin tarafından yönetilebilir)
CREATE TABLE IF NOT EXISTS ai_budget_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    safety_margin_percent INT NOT NULL DEFAULT 80, -- %80 Safe Limit
    max_tasks_per_day INT NOT NULL DEFAULT 20,
    max_tokens_per_day INT NOT NULL DEFAULT 150000,
    max_new_articles_per_day INT NOT NULL DEFAULT 2,
    max_optimizations_per_day INT NOT NULL DEFAULT 6,
    is_ai_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed varsayılan ayar (tekil satır)
INSERT INTO ai_budget_settings (id, safety_margin_percent, max_tasks_per_day, max_tokens_per_day, max_new_articles_per_day, max_optimizations_per_day, is_ai_enabled)
SELECT 'a1b2c3d4-0000-0000-0000-000000000001', 80, 20, 150000, 2, 6, TRUE
WHERE NOT EXISTS (SELECT 1 FROM ai_budget_settings);

-- 2. AI Sağlayıcı Durumu & Dinamik Kota/Sağlık Kaydı
CREATE TABLE IF NOT EXISTS ai_providers_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_key VARCHAR(50) UNIQUE NOT NULL, -- 'groq', 'mistral', 'openrouter', 'gemini', 'cerebras', 'huggingface'
    display_name VARCHAR(100) NOT NULL,
    active_model VARCHAR(100) NOT NULL,
    health_status VARCHAR(50) NOT NULL DEFAULT 'HEALTHY', -- 'HEALTHY', 'DEGRADED', 'RATE_LIMITED', 'INSUFFICIENT_CREDITS', 'PAUSED'
    cooldown_until TIMESTAMPTZ,
    last_error TEXT,
    last_error_at TIMESTAMPTZ,
    last_audit_at TIMESTAMPTZ DEFAULT NOW(),
    rate_limits JSONB DEFAULT '{}', -- { rpm_limit, tpm_limit, rpd_limit, tpd_limit, live_headers: {} }
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AI Görev Kuyruğu (Task Queue - P0-P3 Öncelik ve Deferral)
CREATE TABLE IF NOT EXISTS seo_ai_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_type VARCHAR(60) NOT NULL, -- 'existing_article_optimization', 'title_ctr', 'faq_generation', 'content_gap', etc.
    priority VARCHAR(10) NOT NULL DEFAULT 'P2', -- 'P0', 'P1', 'P2', 'P3'
    provider VARCHAR(50),
    model VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'deferred', 'cancelled'
    input_tokens INT DEFAULT 0,
    output_tokens INT DEFAULT 0,
    estimated_tokens INT DEFAULT 0,
    actual_tokens INT DEFAULT 0,
    article_id UUID,
    opportunity_id UUID,
    content_hash VARCHAR(64),
    prompt_version VARCHAR(20) DEFAULT 'v1',
    payload JSONB DEFAULT '{}',
    result JSONB DEFAULT '{}',
    error TEXT,
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    deferred_until DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_tasks_status_prio ON seo_ai_tasks(status, priority, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_article ON seo_ai_tasks(article_id);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_deferred ON seo_ai_tasks(deferred_until);

-- 4. AI Kullanım Defteri (Usage Logs Ledger - RPD / TPM / TPD Takibi)
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES seo_ai_tasks(id) ON DELETE SET NULL,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    prompt_tokens INT DEFAULT 0,
    completion_tokens INT DEFAULT 0,
    total_tokens INT DEFAULT 0,
    cost NUMERIC(10, 6) DEFAULT 0,
    response_time_ms INT DEFAULT 0,
    status_code INT DEFAULT 200,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_provider_time ON ai_usage_logs(provider, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created ON ai_usage_logs(created_at DESC);

-- 5. AI Önbellek (AI Cache - SHA256 Key ile Mükerrer İstek Önleme)
CREATE TABLE IF NOT EXISTS ai_cache (
    cache_key VARCHAR(64) PRIMARY KEY, -- sha256(task_type:article_id:content_hash:prompt_version)
    task_type VARCHAR(60) NOT NULL,
    article_id UUID,
    content_hash VARCHAR(64) NOT NULL,
    prompt_version VARCHAR(20) NOT NULL,
    result_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX IF NOT EXISTS idx_ai_cache_hash ON ai_cache(content_hash);

-- 6. Cron ve Kuyruk Kilitleri (Idempotent Job Locking)
CREATE TABLE IF NOT EXISTS ai_cron_locks (
    lock_key VARCHAR(60) PRIMARY KEY,
    locked_at TIMESTAMPTZ DEFAULT NOW(),
    locked_by VARCHAR(100) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);
