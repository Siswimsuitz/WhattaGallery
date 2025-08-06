import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Album {
  id: number;
  name: string;
  description: string;
  created_at: string;
  cover_image_url?: string;
}

export interface Photo {
  id: number;
  title: string;
  description: string;
  image_url: string;
  album_id?: number;
  created_at: string;
}