"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CheckoutForm from "@/components/CheckoutForm";
import { getCart, getCartTotal, type CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setCart(getCart());
    sync();
    window.addEventListener("cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const total = useMemo(() => getCartTotal(cart), [cart]);
  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  return (
    <>
      <main className="page">
        <div className="container">
          <div className="crumbs">
            <Breadcrumbs items={[{ href: "/", label: "Головна" }, { href: "/cart", label: "Кошик" }, { label: "Оформлення" }]} />
          </div>

          <section className="heroCard">
            <div className="pill">Фінальний крок</div>
            <h1>Оформлення замовлення</h1>
            <p>
              Перевір товари, заповни контактні дані та обери зручний спосіб оформлення:
              через сайт або в Telegram.
            </p>
          </section>

          {cart.length === 0 ? (
            <section className="emptyCard">
              <div className="emptyTitle">Кошик поки порожній</div>
              <div className="emptyText">
                Додай кілька товарів до кошика, і після цього можна буде перейти до оформлення.
              </div>
              <div className="emptyActions">
                <Link href="/catalog" className="primaryBtn">Перейти в каталог</Link>
                <Link href="/cart" className="secondaryBtn">Повернутись у кошик</Link>
              </div>
            </section>
          ) : (
            <div className="layoutGrid">
              <section className="productsList">
                {cart.map((item) => (
                  <div key={item.id} className="productCard">
                    <Link href={`/product/${item.slug}`} className="imageWrap">
                      <Image
                        src={item.image || "/no-image.png"}
                        alt={item.name}
                        fill
                        sizes="96px"
                        style={{ objectFit: "contain" }}
                        unoptimized
                      />
                    </Link>

                    <div>
                      <Link href={`/product/${item.slug}`} className="productName">{item.name}</Link>
                      <div className="productMeta">Кількість: {item.quantity}</div>
                    </div>

                    <div className="productPrice">{formatPrice(Number(item.price) * Number(item.quantity))}</div>
                  </div>
                ))}
              </section>

              <aside className="sidebar">
                <div className="summaryCard">
                  <div className="summaryEyebrow">Підсумок</div>
                  <div className="summaryTitle">Замовлення готове до оформлення</div>
                  <div className="summaryText">Позицій у кошику: {cart.length}</div>
                  <div className="summaryText">Загальна кількість товарів: {itemCount}</div>
                  <div className="summaryTotal">{formatPrice(total)}</div>
                </div>

                <CheckoutForm cart={cart} />
              </aside>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .page { background:linear-gradient(180deg,#f8f8f7 0%,#eef1f4 100%); min-height:100vh; color:#0f172a; font-family:var(--font-sans),ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
        .container { max-width:1360px; margin:0 auto; padding:24px 18px 40px; }
        .crumbs { margin-bottom:18px; }
        .heroCard, .emptyCard, .productCard, .sidebar, .summaryCard { background:#ffffff; border:1px solid rgba(219,225,234,.95); box-shadow:0 18px 36px rgba(15,23,42,.05); }
        .heroCard, .emptyCard, .sidebar { border-radius:28px; }
        .heroCard { padding:28px 30px; margin-bottom:18px; background:linear-gradient(135deg,#ffffff 0%,#f5f7fa 52%,#eceff3 100%); }
        .pill { display:inline-block; background:linear-gradient(135deg,#fff4e8 0%,#f4e5d7 100%); color:#8b5e3c; padding:8px 14px; border-radius:999px; font-weight:700; font-size:14px; margin-bottom:16px; }
        .heroCard h1 { margin:0; font-size:38px; font-weight:800; letter-spacing:-.03em; }
        .heroCard p { margin:10px 0 0; color:#64748b; font-size:16px; line-height:1.6; max-width:760px; }
        .emptyCard { padding:28px; }
        .emptyTitle { font-size:24px; font-weight:800; margin-bottom:10px; }
        .emptyText { color:#64748b; margin-bottom:18px; line-height:1.6; }
        .emptyActions { display:flex; gap:12px; flex-wrap:wrap; }
        .primaryBtn, .secondaryBtn { display:inline-flex; align-items:center; justify-content:center; min-height:50px; padding:0 20px; border-radius:14px; text-decoration:none; font-weight:800; }
        .primaryBtn { background:linear-gradient(135deg,#c96a2b 0%,#de8a52 100%); color:#ffffff; box-shadow:0 14px 24px rgba(201,106,43,.22); }
        .secondaryBtn { border:1px solid #dbe1ea; background:#ffffff; color:#0f172a; }
        .layoutGrid { display:grid; grid-template-columns:minmax(0,1fr) 420px; gap:18px; align-items:start; }
        .productsList { display:grid; gap:14px; }
        .productCard { border-radius:24px; padding:16px; display:grid; grid-template-columns:96px minmax(0,1fr) auto; gap:16px; align-items:center; }
        .imageWrap { position:relative; height:96px; background:linear-gradient(180deg,#fafafa 0%,#f1f5f9 100%); border-radius:16px; overflow:hidden; }
        .productName { color:#0f172a; text-decoration:none; font-weight:800; font-size:17px; line-height:1.4; }
        .productMeta { margin-top:8px; color:#64748b; font-weight:700; }
        .productPrice { font-weight:800; font-size:22px; text-align:right; }
        .sidebar { padding:22px; position:sticky; top:18px; background:linear-gradient(180deg,#ffffff 0%,#fbfcfd 100%); }
        .summaryCard { border-radius:20px; padding:18px; margin-bottom:18px; display:grid; gap:8px; background:linear-gradient(180deg,#f8fafc 0%,#f3f6fa 100%); }
        .summaryEyebrow { color:#8b5e3c; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; }
        .summaryTitle { font-weight:800; font-size:20px; line-height:1.3; }
        .summaryText { color:#64748b; }
        .summaryTotal { font-size:30px; font-weight:800; margin-top:4px; }
        @media (max-width:960px) { .layoutGrid { grid-template-columns:1fr; } .sidebar { position:static; } }
        @media (max-width:640px) { .container { padding:18px 12px 32px; } .heroCard, .emptyCard, .sidebar { border-radius:22px; } .heroCard { padding:22px 20px; } .heroCard h1 { font-size:30px; } .productCard { grid-template-columns:84px minmax(0,1fr); } .productPrice { grid-column:2; text-align:left; } }
      `}</style>
    </>
  );
}
