export function getDiscountPercent(product: any) {
  if (!product?.oldPrice || Number(product.oldPrice) <= Number(product.price)) return null;
  return Math.round((1 - Number(product.price) / Number(product.oldPrice)) * 100);
}

export function getProductParams(product: any) {
  const raw = product?.params || product?.parameters || [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  return [];
}

export function getShortCharacteristics(product: any, limit = 6) {
  return getProductParams(product).slice(0, limit);
}

export function getWhyBuyItems(product: any) {
  const items: string[] = [];

  if (product?.available) items.push("Товар є в наявності");
  if (product?.brand) items.push(`Бренд: ${product.brand}`);
  if (product?.oldPrice && Number(product.oldPrice) > Number(product.price)) {
    items.push("Є вигідна ціна зі знижкою");
  }
  if (product?.categoryName) items.push(`Категорія: ${product.categoryName}`);
  if (product?.vendorCode) items.push(`Артикул: ${product.vendorCode}`);

  return items.slice(0, 5);
}
