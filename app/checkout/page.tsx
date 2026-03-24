"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  return (
    <main style={{ padding: 24 }}>
      <h1>Checkout</h1>
      {productSlug ? <p>Product: {productSlug}</p> : null}
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main style={{ padding: 24 }}>Loading...</main>}>
      <CheckoutContent />
    </Suspense>
  );
}