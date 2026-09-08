import { defaultProjects, defaultSections, defaultSettings } from "./defaults";
import { getSupabaseAdmin } from "./supabase";
import type { Project, Section, SiteSettings } from "./types";

export async function getProjects(): Promise<Project[]> {
  const db = getSupabaseAdmin();
  if (!db) return defaultProjects;
  const { data, error } = await db.from("projects").select("*").order("sort_order", { ascending: true });
  if (error || !data?.length) return defaultProjects;
  return data as Project[];
}

export async function getSections(): Promise<Section[]> {
  const db = getSupabaseAdmin();
  if (!db) return defaultSections;
  const { data, error } = await db.from("sections").select("*").order("sort_order", { ascending: true });
  if (error || !data?.length) return defaultSections;
  return data as Section[];
}

export async function getSettings(): Promise<SiteSettings> {
  const db = getSupabaseAdmin();
  if (!db) return defaultSettings;
  const { data, error } = await db.from("site_settings").select("value").eq("key", "main").maybeSingle();
  if (error || !data?.value) return defaultSettings;
  return { ...defaultSettings, ...(data.value as Partial<SiteSettings>) };
}
