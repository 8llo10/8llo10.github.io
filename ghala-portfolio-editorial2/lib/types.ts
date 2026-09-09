export type Project = {
  id?: number;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  image_url?: string;
  project_url?: string;
  github_url?: string;
  tags: string[];
  featured?: boolean;
  sort_order?: number;
};

export type SectionType = "hero" | "projects" | "about" | "experience" | "skills" | "contact" | "custom";
export type SectionLayout = "split" | "bento" | "editorial" | "grid" | "full";

export type SectionConfig = {
  imageHint?: string;
  imagePosition?: "left" | "right" | "top" | "background";
  columns?: 1 | 2 | 3;
  tone?: "plain" | "accent" | "dark";
  [key: string]: unknown;
};

export type Section = {
  id?: number;
  key: string;
  type: SectionType;
  title: string;
  eyebrow?: string;
  body?: string;
  image_url?: string;
  layout: SectionLayout;
  sort_order: number;
  enabled: boolean;
  config?: SectionConfig;
};

export type SiteSettings = {
  name: string;
  role: string;
  location: string;
  email: string;
  linkedin_url: string;
  github_url: string;
  cv_url: string;
  availability: string;
  logo_url: string;
};
