"use client";

import Link from "next/link";

export default function Storefront() {
  return (
    <section
      style={{
        background: "linear-gradient(180deg, #f8f8f7 0%, #eef1f4 100%)",
        border: "1px solid rgba(219, 225, 234, 0.95)",
        borderRadius: 28,
        padding: 28,
        color: "#0f172a",
        fontFamily:
          'var(--font-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: "linear-gradient(135deg, #fff4e8 0%, #f4e5d7 100%)",
          color: "#8b5e3c",
          padding: "8px 14px",
          borderRadius: 999,
          fontWeight: 700,
          fontSize: 14,
          marginBottom: 16,
        }}
      >
        Legacy Component
      </div>
      <h2 style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em" }}>
        Storefront component kept for reference
      </h2>
      <p style={{ margin: "12px 0 0", maxWidth: 720, color: "#475569", lineHeight: 1.7 }}>
        Цей компонент зараз не використовується на публічних сторінках. Я залишив його в чистому
        стані без битої кирилиці, щоб він не засмічував проєкт і не плутав під час пошуку.
      </p>
      <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 48,
            padding: "0 18px",
            borderRadius: 14,
            textDecoration: "none",
            background: "linear-gradient(135deg, #c96a2b 0%, #de8a52 100%)",
            color: "#fff",
            fontWeight: 800,
          }}
        >
          На головну
        </Link>
        <Link
          href="/catalog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 48,
            padding: "0 18px",
            borderRadius: 14,
            textDecoration: "none",
            border: "1px solid #dbe1ea",
            background: "#fff",
            color: "#0f172a",
            fontWeight: 800,
          }}
        >
          Відкрити каталог
        </Link>
      </div>
    </section>
  );
}
