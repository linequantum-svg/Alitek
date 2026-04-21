"use client";

import { useMemo, useState } from "react";
import { buildTelegramOrderLink, clearCart, CartItem, getCartTotal } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/site-config";

type ValidationResult =
  | { ok: false; error: string }
  | {
      ok: true;
      customerName: string;
      customerPhone: string;
      customerEmail: string;
      customerComment: string;
    };

type OrderResponse = {
  ok: boolean;
  order?: {
    orderNumber: string;
  };
  error?: string;
};

export default function CheckoutForm({
  cart,
  onSuccess,
}: {
  cart: CartItem[];
  onSuccess?: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [telegramHint, setTelegramHint] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = useMemo(() => getCartTotal(cart), [cart]);
  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  function validateFields(): ValidationResult {
    const customerName = name.trim();
    const customerPhone = phone.trim();
    const customerEmail = email.trim();
    const customerComment = comment.trim();

    if (!cart.length) {
      return { ok: false, error: "Кошик порожній." };
    }

    if (!customerName || !customerPhone) {
      return { ok: false, error: "Будь ласка, заповни ім'я та телефон." };
    }

    return {
      ok: true,
      customerName,
      customerPhone,
      customerEmail,
      customerComment,
    };
  }

  async function handleStandardSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setTelegramHint("");

    const validated = validateFields();
    if (!validated.ok) {
      setError(validated.error);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: validated.customerName,
          phone: validated.customerPhone,
          email: validated.customerEmail || undefined,
          comment: validated.customerComment || undefined,
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const result = (await response.json()) as OrderResponse;

      if (!response.ok || !result.ok || !result.order) {
        throw new Error(result.error || "Не вдалося оформити замовлення.");
      }

      clearCart();
      setSuccess(`Замовлення ${result.order.orderNumber} успішно створено.`);
      setComment("");
      setError("");
      if (onSuccess) onSuccess();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не вдалося оформити замовлення."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleTelegramOrder() {
    setError("");
    setSuccess("");
    setTelegramHint("");

    const validated = validateFields();
    if (!validated.ok) {
      setError(validated.error);
      return;
    }

    if (!SITE_CONFIG.telegramUsername || SITE_CONFIG.telegramUsername === "YOUR_USERNAME") {
      setTelegramHint("Telegram для замовлень ще не налаштований. Додай свій username у конфіг сайту.");
      return;
    }

    const link = buildTelegramOrderLink({
      username: SITE_CONFIG.telegramUsername,
      cart,
      customerName: validated.customerName,
      customerPhone: validated.customerPhone,
      comment: validated.customerComment,
    });

    window.open(link, "_blank", "noopener,noreferrer");
    setTelegramHint("Відкрив Telegram з уже підготовленим текстом замовлення.");
  }

  const buttonsDisabled = isSubmitting || !cart.length;

  return (
    <form onSubmit={handleStandardSubmit} className="form">
      <div className="title">Оформлення замовлення</div>
      <div className="text">
        Обери зручний спосіб: швидко відправити замовлення в Telegram або
        оформити його звичайно через сайт.
      </div>

      <label className="label">
        <span>Ім'я</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Наприклад: Артем"
          className="field"
        />
      </label>

      <label className="label">
        <span>Телефон</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+380..."
          className="field"
        />
      </label>

      <label className="label">
        <span>Email</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Пошта для підтвердження замовлення"
          className="field"
        />
      </label>

      <label className="label">
        <span>Коментар до замовлення</span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Наприклад: колір, зручний час дзвінка або побажання до замовлення"
          rows={4}
          className="area"
        />
      </label>

      <div className="summary">
        <div className="sumTitle">Підсумок</div>
        <div className="muted">Позицій: {cart.length}</div>
        <div className="muted">Одиниць товару: {itemCount}</div>
        <div className="sum">{formatPrice(total)}</div>
      </div>

      {error ? <div className="message error">{error}</div> : null}
      {success ? <div className="message success">{success}</div> : null}
      {telegramHint ? <div className="message info">{telegramHint}</div> : null}

      <div className="actions">
        <button type="submit" className="submitBtn primary" disabled={buttonsDisabled}>
          {isSubmitting ? "Оформлюємо..." : "Оформити замовлення"}
        </button>

        <button
          type="button"
          className="submitBtn secondary"
          onClick={handleTelegramOrder}
          disabled={buttonsDisabled}
        >
          Замовити в Telegram
        </button>
      </div>

      <div className="hint">
        Якщо Telegram-оформлення тимчасово вимкнене, його можна швидко активувати через конфіг сайту.
      </div>

      <style jsx>{`
        .form {
          display: grid;
          gap: 14px;
        }
        .title {
          font-size: 28px;
          font-weight: 900;
          margin-bottom: 4px;
        }
        .text {
          color: #64748b;
          line-height: 1.6;
        }
        .label {
          display: grid;
          gap: 8px;
        }
        .label span {
          font-weight: 700;
        }
        .field {
          height: 50px;
          border-radius: 14px;
          border: 1px solid #dbe1ea;
          padding: 0 14px;
          font-size: 15px;
          background: #ffffff;
          box-sizing: border-box;
        }
        .area {
          border-radius: 14px;
          border: 1px solid #dbe1ea;
          padding: 14px;
          font-size: 15px;
          background: #ffffff;
          resize: vertical;
          box-sizing: border-box;
        }
        .summary {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 16px;
          display: grid;
          gap: 8px;
        }
        .sumTitle {
          font-weight: 800;
          font-size: 18px;
        }
        .muted {
          color: #64748b;
        }
        .sum {
          font-size: 28px;
          font-weight: 900;
        }
        .message {
          border-radius: 14px;
          padding: 12px 14px;
          font-size: 14px;
          line-height: 1.5;
        }
        .error {
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #b91c1c;
        }
        .success {
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
          color: #166534;
        }
        .info {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1d4ed8;
        }
        .actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .submitBtn {
          min-height: 54px;
          border-radius: 16px;
          font-weight: 900;
          font-size: 16px;
          cursor: pointer;
          transition: 0.2s ease;
          padding: 12px 16px;
        }
        .submitBtn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .primary {
          border: none;
          background: #2f63f6;
          color: #ffffff;
        }
        .secondary {
          border: 1px solid #dbe1ea;
          background: #ffffff;
          color: #0f172a;
        }
        .hint {
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.6;
        }
        @media (max-width: 720px) {
          .actions {
            grid-template-columns: 1fr;
          }
          .title {
            font-size: 24px;
          }
        }
      `}</style>
    </form>
  );
}