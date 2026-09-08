import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Ghala — Software Engineer", description: "Ghala AlHashmi Alameer — software engineering, backend, full-stack systems and technical operations portfolio." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body>{children}</body></html>}
