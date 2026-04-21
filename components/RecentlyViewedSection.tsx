"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import { getRecentlyViewed, type ViewedProduct } from "@/lib/recently-viewed";
import { formatPrice } from "@/lib/utils";

export default function RecentlyViewedSection({
  currentId = "",
}: {
  currentId?: string;
}) {
  const [items, setItems] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    const sync = () => {
      setItems(
        getRecentlyViewed()
          .filter((item) => String(item.id) !== String(currentId))
          .slice(0, 5)
      );
    };

    sync();
    window.addEventListener("recently-viewed-updated", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("recently-viewed-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [currentId]);

  if (!items.length) return null;

  return (
    <section style={{ marginTop: "34px" }}>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "26px", fontWeight: 800, color: "#0f172a" }}>Історія перегляду</h2>

        <Link
          href="/catalog"
          style={{
            color: "#475569",
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          Увесь каталог
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: "14px",
        }}
      >
        {items.map((item) => (
          <article
            key={item.id}
            style={{
              background: "#ffffff",
              border: "1px solid #dbe1ea",
              borderRadius: "20px",
              boxShadow: "0 16px 34px rgba(15, 23, 42, 0.05)",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Link href={`/product/${item.slug}`} style={{ display: "block", textDecoration: "none", color: "#0f172a" }}>
              <div
                style={{
                  height: "220px",
                  borderRadius: "16px",
                  background: "linear-gradient(180deg, #fbfbfb 0%, #f1f5f9 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  marginBottom: "12px",
                }}
              >
                <img
                  src={item.image || "/no-image.png"}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>

              <div style={{ minHeight: "64px", fontSize: "15px", lineHeight: 1.45, fontWeight: 700 }}>{item.name}</div>
              <div style={{ marginTop: "10px", fontSize: "28px", fontWeight: 800 }}>{formatPrice(Number(item.price))}</div>
            </Link>

            <div style={{ marginTop: "auto", paddingTop: "14px" }}>
              <AddToCartButton product={item} fullWidth />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
