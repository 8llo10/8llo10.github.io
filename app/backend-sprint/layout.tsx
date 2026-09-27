import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Backend Engineering Roadmap — Ghala Alameer',
  description: 'A structured backend engineering development roadmap covering TypeScript, Node.js, NestJS, PostgreSQL, Redis, testing, Docker, CI/CD, AWS, architecture and system design.',
};

export default function BackendSprintLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
