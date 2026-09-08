import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ghala — Software Engineer",
  description: "Software Engineer portfolio — systems, backend, full-stack and technical operations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
