export type TelegramOrderItem = {
  productName: string;
  productSku?: string | null;
  price: number;
  quantity: number;
};

export type TelegramOrderPayload = {
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string | null;
  comment?: string | null;
  totalAmount: number;
  itemsCount: number;
  items: TelegramOrderItem[];
};

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value) + " ₴";
}

function buildOrderMessage(order: TelegramOrderPayload) {
  const itemsText = order.items
    .map((item, index) => {
      const sku = item.productSku ? ` (${escapeHtml(item.productSku)})` : "";
      return `${index + 1}. <b>${escapeHtml(item.productName)}</b>${sku} — ${item.quantity} × ${formatPrice(item.price)}`;
    })
    .join("\n");

  const comment = order.comment ? `\n<b>Коментар:</b> ${escapeHtml(order.comment)}` : "";
  const email = order.email ? `\n<b>Email:</b> ${escapeHtml(order.email)}` : "";

  return [
    "🛒 <b>Нове замовлення NovaMart</b>",
    `\n<b>Номер:</b> ${escapeHtml(order.orderNumber)}`,
    `\n<b>Клієнт:</b> ${escapeHtml(order.customerName)}`,
    `\n<b>Телефон:</b> ${escapeHtml(order.phone)}`,
    email,
    comment,
    `\n<b>Позицій:</b> ${order.itemsCount}`,
    `\n<b>Сума:</b> ${formatPrice(order.totalAmount)}`,
    `\n\n<b>Товари:</b>\n${itemsText}`,
  ].join("");
}

export async function sendTelegramOrderNotification(order: TelegramOrderPayload) {
  if (!BOT_TOKEN || !CHAT_ID) {
    return { ok: false, skipped: true, reason: "Telegram env vars are not configured" as const };
  }

  const message = buildOrderMessage(order);
  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.ok) {
    throw new Error(data?.description || `Telegram request failed: ${response.status}`);
  }

  return { ok: true, skipped: false };
}
