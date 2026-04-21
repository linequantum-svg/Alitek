import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import AnnouncementBar from "@/components/AnnouncementBar";
import FloatingContactWidget from "@/components/FloatingContactWidget";
import SiteFooter from "@/components/SiteFooter";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000"),
  manifest: "/manifest.webmanifest?v=4",
  title: {
    default: "Каталог товарів",
    template: "%s",
  },
  description: "Каталог товарів, зручний пошук, категорії, кошик та оформлення замовлення.",
  applicationName: "Каталог товарів",
  openGraph: {
    type: "website",
    siteName: "Каталог товарів",
    title: "Каталог товарів",
    description: "Зручний каталог товарів з оновленням цін.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Каталог товарів",
    description: "Зручний каталог товарів з оновленням цін.",
  },
  icons: {
    icon: "/favicon.svg?v=4",
  },
};

export const viewport: Viewport = {
  themeColor: "#2f63f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={manrope.variable}>
      <body
        style={{
          margin: 0,
          background: "#f3f5f9",
          color: "#0f172a",
          fontFamily:
            'var(--font-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <AnnouncementBar />
        {children}
        <FloatingContactWidget />
        <SiteFooter />
      </body>
    </html>
  );
}
