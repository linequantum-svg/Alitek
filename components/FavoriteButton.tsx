"use client";

import { useEffect, useState } from "react";

import { isFavorite, toggleFavorite } from "@/lib/favorites";

export default function FavoriteButton({
  product,
  fullWidth = false,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image?: string;
  };
  fullWidth?: boolean;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isFavorite(String(product.id)));
  }, [product.id]);

  return (
    <button
      onClick={() => {
        toggleFavorite(product);
        setActive(!active);
      }}
      style={{
        height: "46px",
        width: fullWidth ? "100%" : "auto",
        padding: "0 16px",
        borderRadius: "14px",
        border: active ? "1px solid #fecdd3" : "1px solid #dbe1ea",
        background: active ? "#fff1f2" : "#ffffff",
        color: active ? "#be123c" : "#0f172a",
        fontWeight: 800,
        fontSize: "14px",
        cursor: "pointer",
      }}
      type="button"
    >
      {active ? "♥ В обраному" : "♡ В обране"}
    </button>
  );
}
