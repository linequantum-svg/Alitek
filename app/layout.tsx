import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NovaMart",
  description: "Новий магазин електроніки з автоматичною синхронізацією цін із Prom",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
