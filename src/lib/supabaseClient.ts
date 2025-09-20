import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabaseテーブル型定義（将来的に使用）
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          provider: "google" | "line" | "password";
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          provider?: "google" | "line" | "password";
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          provider?: "google" | "line" | "password";
          created_at?: string;
        };
      };
      user_settings: {
        Row: {
          user_id: string;
          display_currency: "TWD" | "JPY";
          language: string;
          timezone: string;
        };
        Insert: {
          user_id: string;
          display_currency?: "TWD" | "JPY";
          language?: string;
          timezone?: string;
        };
        Update: {
          user_id?: string;
          display_currency?: "TWD" | "JPY";
          language?: string;
          timezone?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          sort_order: number;
          hidden: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color: string;
          sort_order?: number;
          hidden?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          sort_order?: number;
          hidden?: boolean;
        };
      };
      rates: {
        Row: {
          date: string;
          rate: number;
          source: string | null;
          created_at: string;
        };
        Insert: {
          date: string;
          rate: number;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          date?: string;
          rate?: number;
          source?: string | null;
          created_at?: string;
        };
      };
      receipts: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          ocr_json: any | null;
          ocr_confidence: number | null;
          stored_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url: string;
          ocr_json?: any | null;
          ocr_confidence?: number | null;
          stored_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_url?: string;
          ocr_json?: any | null;
          ocr_confidence?: number | null;
          stored_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          receipt_id: string | null;
          date: string;
          store: string | null;
          memo: string | null;
          twd_amount: number | null;
          jpy_amount: number;
          fx_rate_used: number | null;
          category_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          receipt_id?: string | null;
          date: string;
          store?: string | null;
          memo?: string | null;
          twd_amount?: number | null;
          jpy_amount: number;
          fx_rate_used?: number | null;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          receipt_id?: string | null;
          date?: string;
          store?: string | null;
          memo?: string | null;
          twd_amount?: number | null;
          jpy_amount?: number;
          fx_rate_used?: number | null;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// 型付きSupabaseクライアント
export type SupabaseClient = typeof supabase;
