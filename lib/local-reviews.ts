export type ProductReview = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  text: string;
  createdAt: string;
};

const STORAGE_KEY = "alitek-product-reviews";

export function getAllReviews(): ProductReview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAllReviews(reviews: ProductReview[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  window.dispatchEvent(new Event("reviews-updated"));
}

export function getReviewsByProductId(productId: string): ProductReview[] {
  return getAllReviews()
    .filter((item) => String(item.productId) === String(productId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addReview(input: {
  productId: string;
  author: string;
  rating: number;
  text: string;
}) {
  const reviews = getAllReviews();

  const review: ProductReview = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    productId: String(input.productId),
    author: input.author.trim(),
    rating: Math.max(1, Math.min(5, Number(input.rating) || 5)),
    text: input.text.trim(),
    createdAt: new Date().toISOString(),
  };

  saveAllReviews([review, ...reviews]);
}

export function getAverageRating(productId: string) {
  const reviews = getReviewsByProductId(productId);
  if (!reviews.length) return 0;
  const total = reviews.reduce((sum, item) => sum + item.rating, 0);
  return total / reviews.length;
}

export function formatReviewDate(date: string) {
  try {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}
