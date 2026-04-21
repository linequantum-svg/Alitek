"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getFavoritesCount } from "@/lib/favorites";

export default function FavoritesBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(getFavoritesCount());
    sync();
    window.addEventListener("favorites-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("favorites-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <Link
      href="/favorites"
      style={{
        height: "52px",
        borderRadius: "14px",
        border: "1px solid #dbe1ea",
        background: "#ffffff",
        fontWeight: 700,
        color: "#0f172a",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 18px",
      }}
    >
      Обране ({count})
    </Link>
  );
}
