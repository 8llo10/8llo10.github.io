import type { Project, Section, SiteSettings } from "./types";

export const defaultSettings: SiteSettings = {
  name: "Ghala AlHashmi Alameer",
  role: "Software Engineer · Full-Stack & Systems",
  location: "Makkah, Saudi Arabia",
  email: "YOUR_EMAIL",
  linkedin_url: "YOUR_LINKEDIN_URL",
  github_url: "https://github.com/8llo10",
  cv_url: "/Ghala_AlHashmi_Alameer_CV.pdf",
  availability: "Open to software engineering & IT opportunities"
};

export const defaultProjects: Project[] = [
  {
    slug: "madad",
    title: "مَدَد | MADAD",
    subtitle: "Field Resource & Operations Orchestration",
    description: "Enterprise operations platform for field incidents, teams, equipment, resources, dispatch and command-center workflows.",
    image_url: "",
    project_url: "",
    github_url: "",
    tags: ["Next.js", "Backend", "PostgreSQL", "Operations"],
    featured: true,
    sort_order: 1
  },
  {
    slug: "tnabbah",
    title: "TNABBAH",
    subtitle: "Smart Vehicle Diagnostics",
    description: "Real-time vehicle diagnostics using OBD-II, MQTT, mobile interfaces and backend services.",
    image_url: "",
    project_url: "",
    github_url: "",
    tags: ["React Native", "FastAPI", "MQTT", "Supabase"],
    featured: true,
    sort_order: 2
  },
  {
    slug: "wasl",
    title: "وَصْل | WASL",
    subtitle: "IT Help Desk & Asset Management",
    description: "Support tickets, users, devices, priorities, ownership and asset lifecycle management for IT teams.",
    image_url: "",
    project_url: "",
    github_url: "",
    tags: ["IT Support", "Assets", "RBAC", "PostgreSQL"],
    featured: true,
    sort_order: 3
  },
  {
    slug: "hiremail",
    title: "HireMail",
    subtitle: "Professional Inbox Workspace",
    description: "A productivity platform for organizing and prioritizing professional email and opportunities.",
    image_url: "",
    project_url: "",
    github_url: "",
    tags: ["Next.js", "OAuth", "Gmail API", "Productivity"],
    featured: true,
    sort_order: 4
  }
];

export const defaultSections: Section[] = [
  {
    key: "hero",
    type: "hero",
    title: "I build systems that turn complex ideas into useful products.",
    eyebrow: "Software Engineer",
    body: "From backend architecture and databases to interfaces, integrations and deployment — I like owning the full path from problem to working system.",
    image_url: "",
    layout: "split",
    sort_order: 1,
    enabled: true,
    config: { imageHint: "YOUR PHOTO — portrait or editorial cutout · recommended 4:5 PNG/JPG" }
  },
  {
    key: "projects",
    type: "projects",
    title: "Selected Projects",
    eyebrow: "FEATURED WORK",
    body: "Real systems, integrations and products built around practical problems.",
    layout: "grid",
    sort_order: 2,
    enabled: true
  },
  {
    key: "about",
    type: "about",
    title: "More than just code.",
    eyebrow: "ABOUT",
    body: "I’m a Software Engineer who enjoys backend systems, databases, product thinking, integrations and solving operational problems. I care about clean execution, not just ideas.",
    image_url: "",
    layout: "bento",
    sort_order: 3,
    enabled: true,
    config: { imageHint: "ABOUT PHOTO — candid/workspace photo · recommended 4:3" }
  },
  {
    key: "experience",
    type: "experience",
    title: "Experience",
    eyebrow: "SELECTED EXPERIENCE",
    body: "Prince Sultan Aviation Academy — technical training in an operational environment involving maintenance and simulator workflows.",
    layout: "editorial",
    sort_order: 4,
    enabled: true
  },
  {
    key: "skills",
    type: "skills",
    title: "Tools I use to build end-to-end systems",
    eyebrow: "STACK",
    body: "JavaScript · TypeScript · Python · Java · React · Next.js · React Native · FastAPI · PostgreSQL · MySQL · Supabase · Firebase · MQTT · Git · Linux · Windows Server · Active Directory · TCP/IP · DNS · DHCP",
    layout: "bento",
    sort_order: 5,
    enabled: true
  },
  {
    key: "contact",
    type: "contact",
    title: "Have a problem worth solving?",
    eyebrow: "LET’S TALK",
    body: "I’m open to software engineering, backend, full-stack and technical operations opportunities.",
    layout: "full",
    sort_order: 6,
    enabled: true
  }
];
