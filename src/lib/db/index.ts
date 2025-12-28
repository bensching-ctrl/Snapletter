import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client only if credentials are available
const createSupabaseClient = (): SupabaseClient | null => {
  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  return null;
};

export const supabase = createSupabaseClient();

export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};

export const isMockMode = (): boolean => {
  return !isSupabaseConfigured();
};

/**
 * Runtime check for production mode.
 * Call this in API routes or server components that require Supabase.
 * Throws an error if Supabase is not configured in production.
 */
export const requireSupabase = (): SupabaseClient => {
  if (!supabase) {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      throw new Error(
        'FATAL: Supabase credentials (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) ' +
        'are required in production mode. Mock mode is only available in development.'
      );
    }
    throw new Error('Supabase client not available. Configure credentials or use mock mode.');
  }
  return supabase;
};
