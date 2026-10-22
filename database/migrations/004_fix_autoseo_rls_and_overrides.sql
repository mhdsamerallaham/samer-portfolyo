-- ========================================================
-- 004_fix_autoseo_rls_and_overrides.sql
-- Enables Anonymous / Public Access with Full Permissions for AutoSEO Engine
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/trhbuncbhzgfebcgohsw/sql
-- ========================================================

-- 1. Enable RLS and Grant Full Access for Service and Anon Roles on AutoSEO Tables
DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'seo_opportunities',
        'seo_internal_links',
        'seo_changes',
        'seo_change_results',
        'seo_crawl_runs',
        'seo_issues',
        'seo_ai_tasks',
        'ai_budget_settings',
        'ai_providers_state',
        'ai_usage_logs',
        'ai_cache',
        'ai_cron_locks'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        -- Enable RLS
        EXECUTE format('ALTER TABLE IF EXISTS public.%I ENABLE ROW LEVEL SECURITY;', tbl);
        
        -- Drop existing permissive policy if exists
        EXECUTE format('DROP POLICY IF EXISTS "autoseo_full_access" ON public.%I;', tbl);
        
        -- Create open policy for anon and authenticated
        EXECUTE format('CREATE POLICY "autoseo_full_access" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl);
        
        -- Grant permissions
        EXECUTE format('GRANT ALL ON public.%I TO anon, authenticated, service_role;', tbl);
    END LOOP;
END $$;

-- 2. Create page_seo_overrides table so Home Page and Service Pages can be autonomously optimized
CREATE TABLE IF NOT EXISTS public.page_seo_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path VARCHAR(255) NOT NULL UNIQUE, -- '/', '/hizmetler', '/fatih-web-tasarim', etc.
    title_tr TEXT,
    h1_tr TEXT,
    description_tr TEXT,
    additional_faq_html TEXT,
    target_query VARCHAR(255),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    applied_by VARCHAR(50) DEFAULT 'autonomous_cron'
);

ALTER TABLE public.page_seo_overrides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "page_overrides_full_access" ON public.page_seo_overrides;
CREATE POLICY "page_overrides_full_access" ON public.page_seo_overrides FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.page_seo_overrides TO anon, authenticated, service_role;

-- 3. Create seo_audit_runs table for Dashboard Daily Reports
CREATE TABLE IF NOT EXISTS public.seo_audit_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_date DATE NOT NULL DEFAULT CURRENT_DATE,
    run_type VARCHAR(50) DEFAULT 'daily_cron',
    tasks_processed INT DEFAULT 0,
    optimizations_applied INT DEFAULT 0,
    deploy_triggered BOOLEAN DEFAULT FALSE,
    health_score INT DEFAULT 85,
    summary_report JSONB DEFAULT '{}',
    status VARCHAR(30) DEFAULT 'success',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.seo_audit_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "audit_runs_full_access" ON public.seo_audit_runs;
CREATE POLICY "audit_runs_full_access" ON public.seo_audit_runs FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.seo_audit_runs TO anon, authenticated, service_role;
