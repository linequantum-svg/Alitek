"use client";

import { useEffect } from "react";
import { pushRecentlyViewed } from "@/lib/recently-viewed";

export default function RecentlyViewedTracker({
  product,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image?: string;
  };
}) {
  useEffect(() => {
    pushRecentlyViewed(product);
  }, [product]);

  return null;
}
