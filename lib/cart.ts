export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

const STORAGE_KEY = "alitek-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(product: {
  id: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
}) {
  const cart = getCart();
  const existing = cart.find((item) => String(item.id) === String(product.id));

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: String(product.id),
      slug: product.slug,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image || "",
      quantity: 1,
    });
  }

  saveCart(cart);
}

export function removeFromCart(id: string) {
  const cart = getCart().filter((item) => String(item.id) !== String(id));
  saveCart(cart);
}

export function updateCartQuantity(id: string, quantity: number) {
  const cart = getCart()
    .map((item) =>
      String(item.id) === String(id)
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    );
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount(cart?: CartItem[]) {
  const source = cart || getCart();
  return source.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

export function getCartTotal(cart?: CartItem[]) {
  const source = cart || getCart();
  return source.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
}

export function buildTelegramOrderLink({
  username,
  cart,
  customerName,
  customerPhone,
  comment,
}: {
  username: string;
  cart: CartItem[];
  customerName: string;
  customerPhone: string;
  comment?: string;
}) {
  const lines = cart.map(
    (item, index) =>
      `${index + 1}. ${item.name} — ${item.quantity} шт. × ${item.price} ₴ = ${
        item.quantity * item.price
      } ₴`
  );

  const total = getCartTotal(cart);

  const text =
    `Добрий день! Хочу оформити замовлення:\n\n` +
    `Ім'я: ${customerName}\n` +
    `Телефон: ${customerPhone}\n` +
    (comment?.trim() ? `Коментар: ${comment.trim()}\n` : "") +
    `\nТовари:\n${lines.join("\n")}\n\nРазом: ${total} ₴`;

  return `https://t.me/${username}?text=${encodeURIComponent(text)}`;
}
