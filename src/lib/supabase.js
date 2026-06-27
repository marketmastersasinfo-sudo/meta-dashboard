import { createClient } from '@supabase/supabase-js';

// Fallback to hardcoded keys for Vercel deployment where env vars might not be configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rjwhgnssmygrxzkcsnyf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6uSUeyG4bY9YCdpDLilAdA_OOqktJLX';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
