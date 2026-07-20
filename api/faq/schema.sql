-- SQL Schema for GEO/AEO Multilingual Q&A System (Supabase / PostgreSQL)

CREATE TABLE IF NOT EXISTS faq_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100) DEFAULT 'e-commerce',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Turkish (TR) Fields
  question_tr TEXT NOT NULL,
  short_answer_tr TEXT NOT NULL,
  content_tr TEXT NOT NULL,
  who_is_this_for_tr TEXT,
  cta_text_tr VARCHAR(255),
  cta_link_tr VARCHAR(255),
  
  -- English (EN) Fields
  question_en TEXT NOT NULL,
  short_answer_en TEXT NOT NULL,
  content_en TEXT NOT NULL,
  who_is_this_for_en TEXT,
  cta_text_en VARCHAR(255),
  cta_link_en VARCHAR(255),
  
  -- Arabic (AR) Fields
  question_ar TEXT NOT NULL,
  short_answer_ar TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  who_is_this_for_ar TEXT,
  cta_text_ar VARCHAR(255),
  cta_link_ar VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_faq_posts_slug ON faq_posts(slug);
CREATE INDEX IF NOT EXISTS idx_faq_posts_published_at ON faq_posts(published_at DESC);
