-- ============================================
-- AASPAAS — COMPLETE SUPABASE SETUP
-- Run this in: Supabase Dashboard > SQL Editor
-- 
-- ✅ Drops EVERYTHING existing first
-- ✅ Creates tables, views, RLS, indexes fresh
-- ✅ Safe to run multiple times
-- ============================================

-- ============================================
-- STEP 1: DROP EVERYTHING EXISTING
-- ============================================

-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS public.posts_with_authors;
DROP VIEW IF EXISTS public.comments_with_authors;

-- Drop tables (respecting foreign key order)
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================
-- STEP 2: CREATE TABLES
-- ============================================

-- 2a. PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  college_id TEXT NOT NULL,
  college_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2b. POSTS
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  college_id TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2c. COMMENTS
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 3: CREATE VIEWS
-- ============================================

-- 3a. posts_with_authors (post data + author info + comment count)
CREATE VIEW public.posts_with_authors AS
SELECT 
  p.*,
  jsonb_build_object(
    'id', pr.id,
    'full_name', pr.full_name,
    'avatar_url', pr.avatar_url
  ) AS author,
  (SELECT count(*) FROM public.comments c WHERE c.post_id = p.id) AS comment_count
FROM public.posts p
JOIN public.profiles pr ON pr.id = p.author_id;

-- 3b. comments_with_authors (comment data + author info)
CREATE VIEW public.comments_with_authors AS
SELECT 
  c.*,
  jsonb_build_object(
    'id', pr.id,
    'full_name', pr.full_name,
    'avatar_url', pr.avatar_url
  ) AS author
FROM public.comments c
JOIN public.profiles pr ON pr.id = c.author_id;

-- ============================================
-- STEP 4: ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, only own user can insert/update
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Posts: anyone can read, only author can insert/update/delete
CREATE POLICY "posts_select" ON public.posts FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_update" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "posts_delete" ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- Comments: anyone can read, only author can insert/delete
CREATE POLICY "comments_select" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "comments_delete" ON public.comments FOR DELETE USING (auth.uid() = author_id);

-- ============================================
-- STEP 5: INDEXES
-- ============================================

CREATE INDEX idx_posts_college_id ON public.posts(college_id);
CREATE INDEX idx_posts_category ON public.posts(category);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);

-- ============================================
-- ✅ DONE! Your database is ready.
-- 
-- Next steps:
-- 1. Go to Authentication > Providers > Enable Email + Phone auth
-- 2. Run: npx expo start
-- ============================================
