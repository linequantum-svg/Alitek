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

export async function sendTelegramOrderNotification(params: {
  orderNumber: string;
  customerName: string;
  phone: string;
  total?: number | string;
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return {
      ok: false,
      skipped: true,
      reason: "Telegram env vars are not configured",
    };
  }

  try {
    const text = [
      "🛒 Нове замовлення",
      `#${params.orderNumber}`,
      `👤 ${params.customerName}`,
      `📞 ${params.phone}`,
      params.total ? `💰 ${params.total}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      return {
        ok: false,
        skipped: false,
        reason: errorText || "Telegram request failed",
      };
    }

    return {
      ok: true,
      skipped: false,
      reason: "",
    };
  } catch (error) {
    return {
      ok: false,
      skipped: false,
      reason: error instanceof Error ? error.message : "Unknown telegram error",
    };
  }
}
