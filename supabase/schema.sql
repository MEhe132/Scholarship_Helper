-- ==============================================================================
-- GlobalScholar Hub: PostgreSQL Schema for Supabase
-- Run this script in your Supabase SQL Editor (100% Free Tier)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. AUTHORITIES / PORTALS TABLE
CREATE TABLE IF NOT EXISTS authorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    short_code TEXT NOT NULL UNIQUE,
    country TEXT NOT NULL,
    country_code VARCHAR(3) NOT NULL,
    country_flag TEXT NOT NULL,
    official_website TEXT NOT NULL,
    tuition_type TEXT NOT NULL,
    work_rights_text TEXT NOT NULL,
    available_news_count INTEGER DEFAULT 0,
    min_cgpa_recommendation NUMERIC(3,2) DEFAULT 3.00,
    gre_required BOOLEAN DEFAULT FALSE,
    ielts_recommended NUMERIC(3,1) DEFAULT 6.5,
    summary TEXT,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. USER PROFILES TABLE (Tied to Supabase Auth)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    current_degree TEXT DEFAULT 'BSc in Computer Science',
    current_major TEXT DEFAULT 'Computer Science',
    cgpa NUMERIC(3,2) DEFAULT 3.50,
    cgpa_scale NUMERIC(3,2) DEFAULT 4.00,
    ielts_score NUMERIC(3,1) DEFAULT 7.0,
    gre_quant INTEGER DEFAULT 164,
    gre_verbal INTEGER DEFAULT 154,
    target_degree TEXT[] DEFAULT ARRAY['MSc', 'PhD', 'Direct PhD'],
    preferred_countries TEXT[] DEFAULT ARRAY['Germany', 'European Union', 'United States', 'Italy'],
    funding_preference TEXT DEFAULT 'both',
    target_intake TEXT DEFAULT 'Fall 2026 / Spring 2027',
    expected_graduation_year INTEGER DEFAULT 2026,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. USER PINNED FAVORITES (Floats cards to top of the grid)
CREATE TABLE IF NOT EXISTS user_pinned_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    authority_short_code TEXT NOT NULL,
    pinned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, authority_short_code)
);

-- 5. APPLICATION KANBAN PIPELINE
CREATE TABLE IF NOT EXISTS user_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    authority_short_code TEXT,
    scholarship_title TEXT NOT NULL,
    university_name TEXT NOT NULL,
    country TEXT NOT NULL,
    country_flag TEXT DEFAULT '🌐',
    status TEXT NOT NULL DEFAULT 'shortlisted'
        CHECK (status IN ('shortlisted', 'preparing', 'applied', 'under_review', 'interview', 'accepted', 'rejected')),
    deadline DATE,
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. DOCUMENT VAULT
CREATE TABLE IF NOT EXISTS user_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_category TEXT NOT NULL CHECK (file_category IN ('cv', 'sop', 'transcript', 'lor', 'certificate', 'other')),
    file_size_kb INTEGER,
    notes TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. DUPLICATE & ALTERNATIVE NOTICES
CREATE TABLE IF NOT EXISTS scholarship_duplicates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    authority_short_code TEXT NOT NULL,
    source_title TEXT NOT NULL,
    source_authority TEXT NOT NULL,
    source_url TEXT NOT NULL,
    similarity_score NUMERIC(3,2),
    discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pinned_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_duplicates ENABLE ROW LEVEL SECURITY;

-- Public can read authorities and duplicate notices
CREATE POLICY "Public authorities read" ON authorities FOR SELECT USING (true);
CREATE POLICY "Public duplicates read" ON scholarship_duplicates FOR SELECT USING (true);

-- Users can only manage their own profiles, pins, applications, and documents
CREATE POLICY "User profile manage" ON user_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "User pins manage" ON user_pinned_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User applications manage" ON user_applications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User documents manage" ON user_documents FOR ALL USING (auth.uid() = user_id);
