/**
 * Database Types
 * These types should match your Supabase database schema
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      urls: {
        Row: {
          id: string;
          short_code: string;
          short_code_lower: string;
          long_url: string;
          custom_alias: boolean;
          title: string | null;
          description: string | null;
          favicon_url: string | null;
          created_at: string;
          updated_at: string;
          expires_at: string | null;
          last_accessed_at: string | null;
          is_active: boolean;
          click_count: number;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          short_code: string;
          long_url: string;
          custom_alias?: boolean;
          title?: string | null;
          description?: string | null;
          favicon_url?: string | null;
          created_at?: string;
          updated_at?: string;
          expires_at?: string | null;
          last_accessed_at?: string | null;
          is_active?: boolean;
          click_count?: number;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          short_code?: string;
          long_url?: string;
          custom_alias?: boolean;
          title?: string | null;
          description?: string | null;
          favicon_url?: string | null;
          created_at?: string;
          updated_at?: string;
          expires_at?: string | null;
          last_accessed_at?: string | null;
          is_active?: boolean;
          click_count?: number;
          user_id?: string | null;
        };
      };
      clicks: {
        Row: {
          id: string;
          url_id: string;
          clicked_at: string;
          ip_hash: string | null;
          country: string | null;
          city: string | null;
          region: string | null;
          device_type: string | null;
          browser: string | null;
          os: string | null;
          referrer: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
        };
        Insert: {
          id?: string;
          url_id: string;
          clicked_at?: string;
          ip_hash?: string | null;
          country?: string | null;
          city?: string | null;
          region?: string | null;
          device_type?: string | null;
          browser?: string | null;
          os?: string | null;
          referrer?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
        };
        Update: {
          id?: string;
          url_id?: string;
          clicked_at?: string;
          ip_hash?: string | null;
          country?: string | null;
          city?: string | null;
          region?: string | null;
          device_type?: string | null;
          browser?: string | null;
          os?: string | null;
          referrer?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
        };
      };
      reserved_words: {
        Row: {
          word: string;
        };
        Insert: {
          word: string;
        };
        Update: {
          word?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string | null;
          created_at?: string;
        };
      };
      url_tags: {
        Row: {
          url_id: string;
          tag_id: string;
        };
        Insert: {
          url_id: string;
          tag_id: string;
        };
        Update: {
          url_id?: string;
          tag_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_short_code_available: {
        Args: { code: string };
        Returns: boolean;
      };
      increment_click_count: {
        Args: { p_short_code: string };
        Returns: {
          id: string;
          long_url: string;
          title: string | null;
        }[];
      };
      get_or_create_short_url: {
        Args: {
          p_long_url: string;
          p_short_code?: string;
          p_custom_alias?: boolean;
          p_user_id?: string;
        };
        Returns: {
          id: string;
          short_code: string;
          is_new: boolean;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types
export type Url = Database['public']['Tables']['urls']['Row'];
export type NewUrl = Database['public']['Tables']['urls']['Insert'];
export type Click = Database['public']['Tables']['clicks']['Row'];
export type NewClick = Database['public']['Tables']['clicks']['Insert'];
