import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum terbaca. Pastikan file .env ada di root folder dan server sudah direstart.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');