import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;

export type Project = {
  id: string;
  title: string;
  subtitle?: string | null;
  description: string;
  tags: string[];
  live_url?: string | null;
  github_url?: string | null;
  image_url?: string | null;
  featured?: boolean;
  sort_order?: number;
};
