import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          passcode_hash: string;
          status: string | null;
          is_online: boolean;
          last_seen: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          passcode_hash: string;
          status?: string | null;
          is_online?: boolean;
          last_seen?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          passcode_hash?: string;
          status?: string | null;
          is_online?: boolean;
          last_seen?: string;
          created_at?: string;
        };
      };
    };
  };
};