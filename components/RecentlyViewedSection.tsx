"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import HoverProductImage from "@/components/HoverProductImage";
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
        className="recentGrid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: "14px",
        }}
      >
        {items.map((item) => (
          <article
            className="recentCard"
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
            <Link
              className="recentLink"
              href={`/product/${item.slug}`}
              style={{ display: "block", textDecoration: "none", color: "#0f172a" }}
            >
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
                <HoverProductImage
                  alt={item.name}
                  image={item.image || "/no-image.png"}
                  images={item.images || []}
                  sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 20vw"
                  className="recentImageHover"
                />
              </div>

              <div
                className="recentName"
                style={{ minHeight: "calc(1.45em * 4)", marginBottom: "12px", fontSize: "15px", lineHeight: 1.45, fontWeight: 700 }}
              >
                <span className="recentNameClamp">{item.name}</span>
                <span className="recentNameFull">{item.name}</span>
              </div>
              <div style={{ marginTop: "10px", fontSize: "28px", fontWeight: 800 }}>{formatPrice(Number(item.price))}</div>
            </Link>

            <div style={{ marginTop: "auto", paddingTop: "14px" }}>
              <AddToCartButton product={item} fullWidth />
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .recentCard {
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }
        .recentCard:hover,
        .recentCard:focus-within {
          transform: translateY(-4px);
          border-color: #d8e3f0;
          background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.12);
        }
        .recentLink {
          display: block;
          text-decoration: none;
          color: #0f172a;
        }
        .recentImageHover {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .recentName {
          color: #0f172a;
          min-height: calc(1.45em * 4);
          position: relative;
          transition: color 0.22s ease;
        }
        .recentNameClamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .recentNameFull {
          position: absolute;
          inset: 0;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s ease;
          min-height: calc(1.45em * 4);
        }
        .recentCard:hover .recentName,
        .recentCard:focus-within .recentName {
          color: #d97706;
        }
        .recentCard:hover .recentNameFull,
        .recentCard:focus-within .recentNameFull {
          opacity: 1;
        }
        .recentCard:hover .recentNameClamp,
        .recentCard:focus-within .recentNameClamp {
          opacity: 0;
        }
        @media (max-width: 1180px) {
          .recentGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 720px) {
          .recentGrid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
