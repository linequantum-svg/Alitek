export function getUniqueBrands(products: any[]) {
  return Array.from(
    new Set(
      (products || [])
        .map((item: any) => String(item?.brand || "").trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b, "uk"));
}

export function matchesBrand(product: any, brand: string) {
  if (!brand) return true;
  return String(product?.brand || "").trim().toLowerCase() === brand.trim().toLowerCase();
}

export function hasDiscount(product: any) {
  return Boolean(
    product?.oldPrice && Number(product.oldPrice) > Number(product.price)
  );
}

export function getDiscountPercent(product: any) {
  if (!hasDiscount(product)) return null;
  return Math.round((1 - Number(product.price) / Number(product.oldPrice)) * 100);
}
