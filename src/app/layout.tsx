import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { IframeResizer } from "@/components/IframeResizer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Komsan Kampot Resort | Riverside Escape in Kampot",
  description: "Discover a peaceful riverside escape at Komsan Kampot Resort in Kampot, Cambodia, surrounded by tropical greenery and views of the Damrei Mountains.",
  openGraph: {
    title: "Komsan Kampot Resort | Riverside Escape in Kampot",
    description: "Discover a peaceful riverside escape at Komsan Kampot Resort in Kampot, Cambodia, surrounded by tropical greenery and views of the Damrei Mountains.",
    url: "https://komsankampotresort.com",
    siteName: "Komsan Kampot Resort",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Komsan Kampot Resort | Riverside Escape in Kampot",
    description: "Discover a peaceful riverside escape at Komsan Kampot Resort in Kampot, Cambodia, surrounded by tropical greenery and views of the Damrei Mountains.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-[var(--brand-bg)] text-[var(--brand-text)] min-h-screen`}
      >
        <IframeResizer />
        {children}
      </body>
    </html>
  );
}
