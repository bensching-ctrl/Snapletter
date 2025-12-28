import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isProduction = process.env.NODE_ENV === 'production';

// In Production: Supabase ist Pflicht
if (isProduction && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error(
    'FATAL: Supabase credentials (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) ' +
    'are required in production mode. Mock mode is only available in development.'
  );
}

// In Development: Warnung wenn Mock-Modus aktiv
if (!isProduction && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('[DEV] Supabase credentials not configured. Using mock data mode.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};

export const isMockMode = (): boolean => {
  return !isSupabaseConfigured();
};
