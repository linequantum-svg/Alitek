"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CheckoutForm from "@/components/CheckoutForm";
import FreeShippingProgress from "@/components/FreeShippingProgress";
import {
  clearCart,
  getCart,
  getCartTotal,
  removeFromCart,
  updateCartQuantity,
  type CartItem,
} from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setCart(getCart() as CartItem[]);
    sync();
    window.addEventListener("cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const total = useMemo(() => getCartTotal(cart), [cart]);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <main className="page">
        <div className="container">
          <div className="crumbs">
            <Breadcrumbs items={[{ href: "/", label: "Головна" }, { label: "Кошик" }]} />
          </div>

          <section className="titleCard">
            <div className="pill">Покупка в один крок</div>
            <h1>Кошик</h1>
            <div className="titleText">У кошику товарів: {count}</div>
          </section>

          {cart.length === 0 ? (
            <section className="emptyCard">
              <div className="emptyTitle">Кошик поки порожній</div>
              <div className="emptyText">
                Додай товари з каталогу або зі сторінки товару, щоб перейти до оформлення.
              </div>
              <Link href="/catalog" className="catalogBtn">Перейти в каталог</Link>
            </section>
          ) : (
            <div className="layoutGrid">
              <section className="itemsColumn">
                <FreeShippingProgress total={total} />

                {cart.map((item) => (
                  <div key={item.id} className="itemCard">
                    <Link href={`/product/${item.slug}`} className="imageLink">
                      <Image
                        src={item.image || "/no-image.png"}
                        alt={item.name}
                        fill
                        sizes="120px"
                        style={{ objectFit: "contain" }}
                        unoptimized
                      />
                    </Link>

                    <div className="itemInfo">
                      <Link href={`/product/${item.slug}`} className="itemName">
                        {item.name}
                      </Link>
                      <div className="itemPrice">{formatPrice(Number(item.price))}</div>
                    </div>

                    <div className="itemActions">
                      <div className="qtyBox">
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="qtyBtn">−</button>
                        <div className="qtyValue">{item.quantity}</div>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="qtyBtn">+</button>
                      </div>

                      <div className="lineTotal">{formatPrice(Number(item.price) * Number(item.quantity))}</div>

                      <button onClick={() => removeFromCart(item.id)} className="removeBtn">Видалити</button>
                    </div>
                  </div>
                ))}

                <div className="totalCard">
                  <div>
                    <div className="totalLabel">Підсумок</div>
                    <div className="totalText">Разом: {formatPrice(total)}</div>
                  </div>
                  <button onClick={() => clearCart()} className="clearBtn">Очистити кошик</button>
                </div>
              </section>

              <aside className="sidebar">
                <CheckoutForm cart={cart} onSuccess={() => {}} />

                <div className="contactBox">
                  <div className="contactTitle">Швидкий зв'язок</div>
                  <a href="tel:+380000000000" className="contactLink">+38 (000) 000-00-00</a>
                  <Link href="/contact" className="contactLink">Контакти магазину</Link>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .page { background:linear-gradient(180deg,#f8f8f7 0%,#eef1f4 100%); min-height:100vh; color:#0f172a; font-family:var(--font-sans),ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
        .container { max-width:1360px; margin:0 auto; padding:24px 18px 40px; }
        .crumbs { margin-bottom:18px; }
        .titleCard, .emptyCard, .itemCard, .totalCard, .sidebar { background:#ffffff; border:1px solid rgba(219,225,234,.95); box-shadow:0 18px 36px rgba(15,23,42,.05); }
        .titleCard { border-radius:28px; padding:28px 30px; margin-bottom:18px; background:linear-gradient(135deg,#ffffff 0%,#f5f7fa 52%,#eceff3 100%); }
        .pill { display:inline-block; background:linear-gradient(135deg,#fff4e8 0%,#f4e5d7 100%); color:#8b5e3c; padding:8px 14px; border-radius:999px; font-weight:700; font-size:14px; margin-bottom:16px; }
        .titleCard h1 { margin:0; font-size:38px; font-weight:800; letter-spacing:-.03em; }
        .titleText { margin-top:10px; color:#64748b; font-size:16px; }
        .emptyCard { border-radius:28px; padding:28px; }
        .emptyTitle { font-size:24px; font-weight:800; margin-bottom:10px; }
        .emptyText { color:#64748b; margin-bottom:18px; line-height:1.6; }
        .catalogBtn { display:inline-flex; align-items:center; height:50px; padding:0 20px; border-radius:14px; background:linear-gradient(135deg,#c96a2b 0%,#de8a52 100%); color:#ffffff; text-decoration:none; font-weight:800; box-shadow:0 14px 24px rgba(201,106,43,.22); }
        .layoutGrid { display:grid; grid-template-columns:minmax(0,1fr) 420px; gap:18px; align-items:start; }
        .itemsColumn { display:grid; gap:14px; }
        .itemCard { border-radius:24px; padding:16px; display:grid; grid-template-columns:120px minmax(0,1fr) auto; gap:16px; align-items:center; }
        .imageLink { position:relative; height:120px; background:linear-gradient(180deg,#fafafa 0%,#f1f5f9 100%); border-radius:16px; overflow:hidden; }
        .itemName { color:#0f172a; text-decoration:none; font-weight:800; font-size:18px; line-height:1.4; }
        .itemPrice { margin-top:10px; font-size:28px; font-weight:800; }
        .itemActions { display:grid; gap:10px; justify-items:end; }
        .qtyBox { display:flex; align-items:center; gap:10px; border:1px solid #dbe1ea; border-radius:14px; padding:8px 10px; background:#ffffff; }
        .qtyBtn { width:34px; height:34px; border-radius:10px; border:1px solid #dbe1ea; background:#ffffff; cursor:pointer; font-weight:800; }
        .qtyValue { min-width:28px; text-align:center; font-weight:800; }
        .lineTotal { font-weight:800; font-size:22px; }
        .removeBtn { min-height:40px; padding:0 14px; border-radius:12px; border:1px solid #fecaca; background:#fff1f2; color:#b91c1c; font-weight:800; cursor:pointer; }
        .totalCard { border-radius:24px; padding:18px 20px; display:flex; justify-content:space-between; align-items:center; gap:18px; flex-wrap:wrap; }
        .totalLabel { color:#64748b; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; }
        .totalText { margin-top:4px; font-size:22px; font-weight:800; }
        .clearBtn { min-height:48px; padding:0 18px; border-radius:14px; border:1px solid #dbe1ea; background:#ffffff; color:#0f172a; font-weight:800; cursor:pointer; }
        .sidebar { border-radius:24px; padding:22px; position:sticky; top:18px; background:linear-gradient(180deg,#ffffff 0%,#fbfcfd 100%); }
        .contactBox { margin-top:18px; padding-top:18px; border-top:1px solid #e5e7eb; display:grid; gap:10px; }
        .contactTitle { font-weight:800; font-size:18px; }
        .contactLink { color:#9a3412; text-decoration:none; font-weight:700; }
        @media (max-width:960px) { .layoutGrid { grid-template-columns:1fr; } .sidebar { position:static; } }
        @media (max-width:720px) { .container { padding:18px 12px 32px; } .titleCard { padding:22px 20px; } .titleCard h1 { font-size:30px; } .itemCard { grid-template-columns:84px minmax(0,1fr); } .imageLink { height:84px; } .itemActions { grid-column:1 / -1; justify-items:stretch; } .lineTotal { text-align:left; } .qtyBox { justify-content:center; } }
      `}</style>
    </>
  );
}
