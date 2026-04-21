"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clearCart, getCart, getCartTotal, removeFromCart, updateCartQuantity, type CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import CheckoutForm from "@/components/CheckoutForm";
import FreeShippingProgress from "@/components/FreeShippingProgress";
import Breadcrumbs from "@/components/Breadcrumbs";

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

  return (
    <>
      <main className="page">
        <div className="container">
          <div className="crumbs"><Breadcrumbs items={[{ href: "/", label: "Головна" }, { label: "Кошик" }]} /></div>
          <section className="titleCard"><h1>Кошик</h1><div>Товарів у кошику: {cart.reduce((sum, item) => sum + item.quantity, 0)}</div></section>
          {cart.length === 0 ? (
            <section className="emptyCard">
              <div className="emptyTitle">Кошик порожній</div>
              <div className="emptyText">Додай товари з головної, каталогу або сторінки товару.</div>
              <Link href="/catalog" className="catalogBtn">Перейти в каталог</Link>
            </section>
          ) : (
            <div className="mainGrid">
              <section className="leftCol">
                <FreeShippingProgress total={total} />
                {cart.map((item) => (
                  <div key={item.id} className="itemCard">
                    <Link href={`/product/${item.slug}`} className="imageLink"><img src={item.image || "/no-image.png"} alt={item.name} className="itemImage" /></Link>
                    <div>
                      <Link href={`/product/${item.slug}`} className="itemName">{item.name}</Link>
                      <div className="itemPrice">{formatPrice(Number(item.price))}</div>
                    </div>
                    <div className="sideActions">
                      <div className="qtyBox">
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>−</button>
                        <div>{item.quantity}</div>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <div className="sumPrice">{formatPrice(Number(item.price) * Number(item.quantity))}</div>
                      <button onClick={() => removeFromCart(item.id)} className="removeBtn">Видалити</button>
                    </div>
                  </div>
                ))}
                <div className="bottomCard">
                  <div className="totalText">Разом: {formatPrice(total)}</div>
                  <button onClick={() => clearCart()} className="clearBtn">Очистити кошик</button>
                </div>
              </section>
              <aside className="checkoutCard"><CheckoutForm cart={cart} /></aside>
            </div>
          )}
        </div>
      </main>
      <style jsx>{`
        .page { background:#f3f5f9; min-height:100vh; color:#0f172a; font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .container { max-width:1360px; margin:0 auto; padding:24px 18px 40px; }
        .crumbs { margin-bottom:18px; }
        .titleCard,.emptyCard,.itemCard,.bottomCard,.checkoutCard { background:#fff; border:1px solid #dbe1ea; }
        .titleCard { border-radius:28px; padding:22px; margin-bottom:18px; }
        .titleCard h1 { margin:0; font-size:36px; font-weight:900; }
        .titleCard div { margin-top:10px; color:#64748b; font-size:16px; }
        .emptyCard { border-radius:28px; padding:28px; }
        .emptyTitle { font-size:24px; font-weight:900; margin-bottom:10px; }
        .emptyText { color:#64748b; margin-bottom:18px; }
        .catalogBtn { display:inline-flex; align-items:center; height:50px; padding:0 20px; border-radius:14px; background:#2f63f6; color:#fff; text-decoration:none; font-weight:800; }
        .mainGrid { display:grid; grid-template-columns:minmax(0,1fr) 420px; gap:18px; align-items:start; }
        .leftCol { display:grid; gap:14px; }
        .itemCard { border-radius:24px; padding:16px; display:grid; grid-template-columns:120px minmax(0,1fr) auto; gap:16px; align-items:center; }
        .imageLink { height:120px; background:#f8fafc; border-radius:16px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
        .itemImage { width:100%; height:100%; object-fit:contain; }
        .itemName { color:#0f172a; text-decoration:none; font-weight:800; font-size:18px; line-height:1.4; }
        .itemPrice { margin-top:10px; font-size:28px; font-weight:900; }
        .sideActions { display:grid; gap:10px; justify-items:end; }
        .qtyBox { display:flex; align-items:center; gap:10px; border:1px solid #dbe1ea; border-radius:14px; padding:8px 10px; background:#fff; }
        .qtyBox button { width:34px; height:34px; border-radius:10px; border:1px solid #dbe1ea; background:#fff; cursor:pointer; font-weight:800; }
        .qtyBox div { min-width:28px; text-align:center; font-weight:800; }
        .sumPrice { font-weight:900; font-size:22px; }
        .removeBtn { height:40px; padding:0 14px; border-radius:12px; border:1px solid #fecaca; background:#fff1f2; color:#b91c1c; font-weight:800; cursor:pointer; }
        .bottomCard { border-radius:24px; padding:18px; display:flex; justify-content:space-between; align-items:center; gap:18px; flex-wrap:wrap; }
        .totalText { font-size:20px; font-weight:800; }
        .clearBtn { height:48px; padding:0 18px; border-radius:14px; border:1px solid #dbe1ea; background:#fff; color:#0f172a; font-weight:800; cursor:pointer; }
        .checkoutCard { border-radius:24px; padding:22px; position:sticky; top:18px; }
        @media (max-width:1024px) { .mainGrid { grid-template-columns:1fr; } .checkoutCard { position:static; } }
        @media (max-width:768px) { .container { padding:18px 12px 32px; } .titleCard h1 { font-size:30px; } .itemCard { grid-template-columns:1fr; } .imageLink { height:220px; } .sideActions { justify-items:stretch; } .qtyBox { justify-content:center; } .bottomCard { flex-direction:column; align-items:stretch; } .clearBtn { width:100%; } .checkoutCard { padding:18px; } }
      `}</style>
    </>
  );
}
