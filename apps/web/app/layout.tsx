import type { Metadata } from "next";
import { Inter, Michroma } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Techno display face. Fallback for the locked nabulines.com display font until
// its licensed file is dropped into the repo (see master plan, open risk #5).
const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://academy.nabulines.com"),
  title: {
    default: "Nabulines Academy — From Creator to Builder",
    template: "%s — Nabulines Academy",
  },
  description:
    "The automated vibe-coding academy. Walk in a creator, walk out a builder who ships sites, apps, and tools.",
  openGraph: {
    title: "Nabulines Academy — From Creator to Builder",
    description:
      "The automated vibe-coding academy. Walk in a creator, walk out a builder.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${michroma.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-text">
        <Providers>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
