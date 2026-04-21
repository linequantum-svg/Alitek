"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getFavorites, removeFavorite, type FavoriteItem } from "@/lib/favorites";
import { formatPrice } from "@/lib/utils";

export default function FavoritesPage() {
  const [items, setItems] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(getFavorites());
    sync();
    window.addEventListener("favorites-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("favorites-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <>
      <main className="page">
        <div className="container">
          <div className="crumbs">
            <Breadcrumbs items={[{ href: "/", label: "Головна" }, { label: "Обране" }]} />
          </div>

          <section className="titleCard">
            <h1>Обрані товари</h1>
            <div>Збережено товарів: {items.length}</div>
          </section>

          {!items.length ? (
            <section className="emptyCard">
              <div className="emptyTitle">В обраному поки нічого немає</div>
              <div className="emptyText">
                Додай товари в обране з каталогу або зі сторінки товару.
              </div>
              <Link href="/catalog" className="catalogBtn">Перейти в каталог</Link>
            </section>
          ) : (
            <div className="productsGrid">
              {items.map((item) => (
                <div key={item.id} className="productCard">
                  <Link href={`/product/${item.slug}`} className="productLink">
                    <div className="productImageWrap">
                      <Image
                        src={item.image || "/no-image.png"}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        style={{ objectFit: "contain" }}
                        unoptimized
                      />
                    </div>
                    <div className="productName">{item.name}</div>
                    <div className="productPrice">{formatPrice(Number(item.price))}</div>
                  </Link>

                  <div className="actions">
                    <AddToCartButton product={item} fullWidth />
                    <button onClick={() => removeFavorite(item.id)} className="removeBtn">
                      Видалити з обраного
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <style>{`
        .page { background:linear-gradient(180deg,#f8f8f7 0%,#eef1f4 100%); min-height:100vh; color:#0f172a; font-family:var(--font-sans),ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
        .container { max-width:1360px; margin:0 auto; padding:24px 18px 40px; }
        .crumbs { margin-bottom:16px; }
        .titleCard,.emptyCard,.productCard { background:#fff; border:1px solid rgba(219,225,234,.95); box-shadow:0 18px 36px rgba(15,23,42,.05); }
        .titleCard { border-radius:28px; padding:22px; margin-bottom:18px; }
        .titleCard h1 { margin:0; font-size:36px; font-weight:800; }
        .titleCard div { margin-top:10px; color:#64748b; }
        .emptyCard { border-radius:28px; padding:28px; }
        .emptyTitle { font-size:24px; font-weight:800; margin-bottom:10px; }
        .emptyText { color:#64748b; margin-bottom:18px; }
        .catalogBtn { display:inline-flex; align-items:center; height:50px; padding:0 20px; border-radius:14px; background:linear-gradient(135deg,#c96a2b 0%,#de8a52 100%); color:#fff; text-decoration:none; font-weight:800; box-shadow:0 14px 24px rgba(201,106,43,.22); }
        .productsGrid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; }
        .productCard { border-radius:22px; padding:14px; }
        .productLink { text-decoration:none; color:#0f172a; display:block; }
        .productImageWrap { position:relative; height:220px; border-radius:18px; background:linear-gradient(180deg,#fafafa 0%,#f1f5f9 100%); overflow:hidden; margin-bottom:12px; }
        .productName { font-size:15px; line-height:1.45; min-height:66px; font-weight:700; }
        .productPrice { margin-top:10px; font-weight:800; font-size:28px; }
        .actions { margin-top:12px; display:grid; gap:10px; }
        .removeBtn { height:46px; border-radius:14px; border:1px solid #fecaca; background:#fff1f2; color:#b91c1c; font-weight:800; cursor:pointer; }
        @media (max-width:1024px) { .productsGrid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
        @media (max-width:768px) { .container { padding:18px 12px 32px; } .titleCard h1 { font-size:30px; } .productsGrid { grid-template-columns:1fr; } .productImageWrap { height:200px; } }
      `}</style>
    </>
  );
}
