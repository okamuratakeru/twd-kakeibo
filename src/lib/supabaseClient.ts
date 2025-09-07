import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabaseテーブル型定義（将来的に使用）
export interface Database {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string;
          amount: number;
          currency: 'JPY' | 'TWD';
          category: string;
          date: string;
          store_name: string | null;
          memo: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          amount: number;
          currency: 'JPY' | 'TWD';
          category: string;
          date: string;
          store_name?: string | null;
          memo?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          amount?: number;
          currency?: 'JPY' | 'TWD';
          category?: string;
          date?: string;
          store_name?: string | null;
          memo?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          provider: 'google' | 'line' | 'password' | 'manual';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          provider?: 'google' | 'line' | 'password' | 'manual';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          provider?: 'google' | 'line' | 'password' | 'manual';
          created_at?: string;
        };
      };
    };
  };
}

// 型付きSupabaseクライアント
export type SupabaseClient = typeof supabase;