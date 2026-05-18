const { createClient } = require('@supabase/supabase-js');
const https = require('https');

const SUPABASE_URL = 'https://twistvvbsepyhgexsqvt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6z2NLhEeTzEbwzyDJ_eMRA_ZdKkp-is';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// SQL to execute via the management API
const SQL = `
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  college_id TEXT NOT NULL,
  college_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create posts table  
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  college_id TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create posts_with_authors view
CREATE OR REPLACE VIEW public.posts_with_authors AS
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

-- Create comments_with_authors view
CREATE OR REPLACE VIEW public.comments_with_authors AS
SELECT 
  c.*,
  jsonb_build_object(
    'id', pr.id,
    'full_name', pr.full_name,
    'avatar_url', pr.avatar_url
  ) AS author
FROM public.comments c
JOIN public.profiles pr ON pr.id = c.author_id;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all profiles, insert/update their own
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Posts: authenticated users can read all posts from their college
CREATE POLICY "posts_select" ON public.posts FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_update" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "posts_delete" ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- Comments: authenticated users can read all, insert/delete own
CREATE POLICY "comments_select" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "comments_delete" ON public.comments FOR DELETE USING (auth.uid() = author_id);
`;

async function tryViaManagementAPI() {
  // Try using the Supabase Management API (requires token)
  console.log('Trying Management API approach...');
  try {
    const response = await fetch(`https://api.supabase.com/v1/projects/twistvvbsepyhgexsqvt/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ query: SQL }),
    });
    if (response.ok) {
      const result = await response.json();
      console.log('Management API success:', JSON.stringify(result, null, 2));
      return true;
    } else {
      const text = await response.text();
      console.log('Management API failed:', response.status, text);
      return false;
    }
  } catch (e) {
    console.log('Management API error:', e.message);
    return false;
  }
}

async function tryViaRpc() {
  // Try using the rpc() method
  console.log('\nTrying RPC approach...');
  try {
    const { data, error } = await supabase.rpc('exec_sql', { query: SQL });
    if (error) {
      console.log('RPC failed:', error.message);
      return false;
    }
    console.log('RPC success:', data);
    return true;
  } catch (e) {
    console.log('RPC error:', e.message);
    return false;
  }
}

async function verifyTables() {
  console.log('\n--- Verifying tables ---');
  for (const table of ['profiles', 'posts', 'comments']) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    console.log(`${table}: ${error ? '❌ ' + error.message : '✅ exists'}`);
  }
  // Try views
  for (const view of ['posts_with_authors', 'comments_with_authors']) {
    const { data, error } = await supabase.from(view).select('*').limit(1);
    console.log(`${view}: ${error ? '❌ ' + error.message : '✅ exists'}`);
  }
}

async function main() {
  console.log('Setting up Supabase tables for AasPaas college beta...\n');
  
  // Try Management API first
  const managed = await tryViaManagementAPI();
  if (managed) {
    console.log('\n✅ Tables created via Management API');
  } else {
    console.log('\n⚠️  Could not create tables programmatically with anon key.');
    console.log('\nPlease follow these steps:');
    console.log('1. Go to https://supabase.com/dashboard/project/twistvvbsepyhgexsqvt');
    console.log('2. Open the SQL Editor');
    console.log('3. Paste and run this SQL:');
    console.log('\n' + SQL);
  }

  await verifyTables();
}

main().catch(console.error);
