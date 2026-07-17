import { createClient } from '@supabase/supabase-js';

// This is a SEPARATE Supabase project from grimaldi.tv's own database -
// it's studio.grimaldi.tv's database, where blog posts are actually written
// and stored. Read-only here: RLS on that project already restricts this
// anon key to published posts only.
export const studioSupabase = createClient(
  import.meta.env.VITE_STUDIO_SUPABASE_URL,
  import.meta.env.VITE_STUDIO_SUPABASE_ANON_KEY
);
