
"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice: number;
  image: string;
  available: boolean;
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("product") || "";
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(Boolean(slug));
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; orderNumber?: string } | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadProduct() {
      if (!slug) {
        setLoadingProduct(false);
        return;
      }
      try {
        setLoadingProduct(true);
        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();
        if (!ignore) {
          if (response.ok && data?.product) {
            setProduct(data.product);
          } else {
            setResult({ ok: false, message: "Товар для замовлення не знайдено" });
          }
        }
      } catch {
        if (!ignore) setResult({ ok: false, message: "Не вдалося завантажити товар" });
      } finally {
        if (!ignore) setLoadingProduct(false);
      }
    }
    loadProduct();
    return () => {
      ignore = true;
    };
  }, [slug]);

  const total = useMemo(() => (product ? product.price * quantity : 0), [product, quantity]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setResult(null);

    if (!product) {
      setResult({ ok: false, message: "Оберіть товар для замовлення" });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          email,
          comment,
          items: [{ productId: product.id, quantity }],
        }),
      });

      const data = await response.json();
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Не вдалося створити замовлення");
      }

      setResult({
        ok: true,
        message: "Замовлення успішно збережено в базу",
        orderNumber: data.order.orderNumber,
      });
      setCustomerName("");
      setPhone("");
      setEmail("");
      setComment("");
      setQuantity(1);
    } catch (error) {
      setResult({ ok: false, message: error instanceof Error ? error.message : "Помилка" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <div style={{ marginBottom: 16, fontSize: 14, color: "#64748b" }}>
        <Link href="/" style={{ color: "#0f172a", fontWeight: 700, textDecoration: "none" }}>Головна</Link>
        <span> / </span>
        <span>Оформлення замовлення</span>
      </div>

      <h1 style={{ fontSize: 36, marginTop: 0 }}>Оформлення замовлення</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16 }}>
        <form onSubmit={handleSubmit} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 24, padding: 20 }}>
          <div style={{ display: "grid", gap: 12 }}>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Ім'я та прізвище" style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }} />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (необов'язково)" style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }} />
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Коментар до замовлення" rows={4} style={{ padding: 12, borderRadius: 14, border: "1px solid #cbd5e1", resize: "vertical" }} />
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Кількість</div>
            <input
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
              style={{ width: 120, padding: 12, borderRadius: 14, border: "1px solid #cbd5e1" }}
            />
          </div>

          <button type="submit" disabled={submitting || !product || loadingProduct} style={{ marginTop: 20, background: "#0f172a", color: "white", border: 0, borderRadius: 16, padding: "14px 18px", fontWeight: 800 }}>
            {submitting ? "Збереження..." : "Підтвердити замовлення"}
          </button>

          {result ? (
            <div style={{ marginTop: 16, padding: 14, borderRadius: 16, background: result.ok ? "#ecfdf5" : "#fef2f2", color: result.ok ? "#065f46" : "#991b1b" }}>
              <div>{result.message}</div>
              {result.orderNumber ? (
                <div style={{ marginTop: 8, fontWeight: 800 }}>
                  Номер замовлення: <Link href={`/api/orders/${result.orderNumber}`} style={{ textDecoration: "underline" }}>{result.orderNumber}</Link>
                </div>
              ) : null}
            </div>
          ) : null}
        </form>

        <aside style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 24, padding: 20, height: "fit-content" }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Ваше замовлення</div>
          {loadingProduct ? <div>Завантаження товару...</div> : null}
          {!loadingProduct && !product ? <div>Відкрий оформлення через кнопку “Купити” на сторінці товару.</div> : null}

          {product ? (
            <>
              <img src={product.image} alt={product.name} style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 16 }} />
              <div style={{ marginTop: 12, fontWeight: 700 }}>{product.name}</div>
              <div style={{ marginTop: 8, color: product.available ? "#059669" : "#94a3b8" }}>
                {product.available ? "● Є в наявності" : "● Немає в наявності"}
              </div>
              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between" }}>
                <span>Ціна за 1 шт</span>
                <strong>{new Intl.NumberFormat("uk-UA").format(product.price)} ₴</strong>
              </div>
              <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                <span>Кількість</span>
                <strong>{quantity}</strong>
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", fontSize: 20 }}>
                <span>Разом</span>
                <strong>{new Intl.NumberFormat("uk-UA").format(total)} ₴</strong>
              </div>
            </>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
