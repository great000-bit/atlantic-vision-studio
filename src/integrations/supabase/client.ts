import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dgooccdkdxdrluogrykm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnb29jY2RrZHhkcmx1b2dyeWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NjI3NzEsImV4cCI6MjA4MDQzODc3MX0.wVNhr8Qm6q3s8ZBKkpiWq0YbRnHCFEEe0hZeT11pzf8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});