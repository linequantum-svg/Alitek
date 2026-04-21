export type FavoriteItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
};

const STORAGE_KEY = "alitek-favorites";

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFavorites(items: FavoriteItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("favorites-updated"));
}

export function isFavorite(id: string) {
  return getFavorites().some((item) => String(item.id) === String(id));
}

export function toggleFavorite(product: FavoriteItem) {
  const items = getFavorites();
  const exists = items.some((item) => String(item.id) === String(product.id));

  if (exists) {
    saveFavorites(items.filter((item) => String(item.id) !== String(product.id)));
  } else {
    saveFavorites([
      ...items,
      {
        id: String(product.id),
        slug: product.slug,
        name: product.name,
        price: Number(product.price) || 0,
        image: product.image || "",
      },
    ]);
  }
}

export function removeFavorite(id: string) {
  saveFavorites(getFavorites().filter((item) => String(item.id) !== String(id)));
}

export function getFavoritesCount() {
  return getFavorites().length;
}
