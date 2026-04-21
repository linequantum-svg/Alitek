"use client";

import Link from "next/link";
import { prefetchProductCache } from "@/lib/storefront-client-cache";

export default function HomeProductLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const slug = href.split("/product/")[1] || "";

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={() => {
        if (slug) void prefetchProductCache(slug);
      }}
      onFocus={() => {
        if (slug) void prefetchProductCache(slug);
      }}
    >
      {children}
    </Link>
  );
}
