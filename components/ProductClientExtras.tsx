"use client";

import dynamic from "next/dynamic";

const RecentlyViewedTracker = dynamic(() => import("@/components/RecentlyViewedTracker"), {
  ssr: false,
});

const RecentlyViewedSection = dynamic(() => import("@/components/RecentlyViewedSection"), {
  ssr: false,
  loading: () => null,
});

const ProductReviews = dynamic(() => import("@/components/ProductReviews"), {
  ssr: false,
  loading: () => null,
});

const MobileStickyBuyBar = dynamic(() => import("@/components/MobileStickyBuyBar"), {
  ssr: false,
  loading: () => null,
});

export default function ProductClientExtras({
  currentId,
  product,
  productName,
  priceLabel,
}: {
  currentId: string;
  product: any;
  productName: string;
  priceLabel: string;
}) {
  return (
    <>
      <RecentlyViewedTracker product={product} />
      <ProductReviews productId={currentId} productName={productName} />
      <RecentlyViewedSection currentId={currentId} />
      <MobileStickyBuyBar product={product} priceLabel={priceLabel} />
    </>
  );
}
