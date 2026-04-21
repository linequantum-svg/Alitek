
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartCount } from "@/lib/cart";

export default function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(getCartCount());
    sync();
    window.addEventListener("cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <Link
      href="/cart"
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
      Кошик ({count})
    </Link>
  );
}
