import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ghala Al-Hashmi Al-Ameer — Software Engineer',
  description: 'Software Engineer focused on backend development, full-stack systems and IT automation.',
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
