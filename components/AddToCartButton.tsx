"use client";

import { useState } from "react";

import { addToCart } from "@/lib/cart";

export default function AddToCartButton({
  product,
  fullWidth = false,
  variant = "default",
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image?: string;
  };
  fullWidth?: boolean;
  variant?: "default" | "primary";
}) {
  const [added, setAdded] = useState(false);
  const primary = variant === "primary";

  return (
    <button
      onClick={() => {
        addToCart(product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      style={{
        height: primary ? "50px" : "46px",
        width: fullWidth ? "100%" : "auto",
        padding: primary ? "0 20px" : "0 18px",
        borderRadius: primary ? "16px" : "14px",
        border: added
          ? "1px solid #16a34a"
          : primary
            ? "1px solid #2676e7"
            : "1px solid #dbe1ea",
        background: added ? "#dcfce7" : primary ? "#2676e7" : "#ffffff",
        color: added ? "#0f172a" : primary ? "#ffffff" : "#0f172a",
        fontWeight: 800,
        fontSize: primary ? "15px" : "14px",
        cursor: "pointer",
        boxShadow: primary && !added ? "0 12px 24px rgba(37, 99, 235, 0.18)" : "none",
      }}
      type="button"
    >
      {added ? "Додано ✓" : "У кошик"}
    </button>
  );
}
