import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ghala Al-Hashmi Al-Ameer — Software Engineer',
  description: 'Software Engineer, Full-Stack Developer and Product Builder.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
