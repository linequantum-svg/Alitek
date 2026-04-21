export type ViewedProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
};

const STORAGE_KEY = "alitek-recently-viewed";

export function getRecentlyViewed(): ViewedProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecentlyViewed(items: ViewedProduct[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("recently-viewed-updated"));
}

export function pushRecentlyViewed(product: ViewedProduct) {
  const items = getRecentlyViewed().filter((item) => String(item.id) !== String(product.id));
  items.unshift({
    id: String(product.id),
    slug: product.slug,
    name: product.name,
    price: Number(product.price) || 0,
    image: product.image || "",
  });
  saveRecentlyViewed(items.slice(0, 8));
}
