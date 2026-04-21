"use client";

import { useEffect, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";

export default function MobileStickyBuyBar({
  product,
  priceLabel,
}: {
  product: any;
  priceLabel: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onResize = () => setVisible(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: "12px",
        right: "12px",
        bottom: "12px",
        zIndex: 50,
        background: "#ffffff",
        border: "1px solid #dbe1ea",
        boxShadow: "0 12px 32px rgba(15,23,42,0.12)",
        borderRadius: "18px",
        padding: "12px",
        display: "flex",
        gap: "12px",
        alignItems: "center",
      }}
    >
      <div style={{ minWidth: "0", flex: 1 }}>
        <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>
          Швидка покупка
        </div>
        <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>
          {priceLabel}
        </div>
      </div>

      <div style={{ width: "170px", flexShrink: 0 }}>
        <AddToCartButton product={product} fullWidth />
      </div>
    </div>
  );
}
