import { getPromCategories, getPromProducts } from "@/lib/prom-feed";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import CartBadge from "@/components/CartBadge";
import FavoritesBadge from "@/components/FavoritesBadge";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import PromoBanners from "@/components/PromoBanners";
import BrandsSection from "@/components/BrandsSection";
import FAQSection from "@/components/FAQSection";

function slugifyCategory(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\u0400-\u04FF-]+/g, "");
}

export default async function Home() {
  const [products, promCategories] = await Promise.all([getPromProducts(), getPromCategories()]);
  const categories = (promCategories || []).map((item: any) => item.name).filter(Boolean).slice(0, 8);
  const popularProducts = (products || []).slice(0, 4);

  return (
    <>
      <main className="page">
        <div className="container">
          <header className="header">
            <Link href="/" className="logo">
              <div className="logoTitle">Alitek</div>
              <div className="logoSub">Магазин електроніки</div>
            </Link>
            <Link href="/catalog" className="headerBtn">≡ Каталог</Link>
            <form action="/catalog" method="get" className="searchForm">
              <input type="text" name="q" placeholder="Пошук товарів, брендів, категорій" className="searchInput" />
              <button type="submit" className="searchBtn">Знайти</button>
            </form>
            <div className="headerActions">
              <FavoritesBadge />
              <CartBadge />
            </div>
          </header>

          <section className="heroGrid">
            <aside className="sidebar">
              <div className="sectionTitle">Категорії</div>
              <div className="categoryList">
                {categories.map((item) => (
                  <Link key={item} href={`/catalog/${slugifyCategory(item)}`} className="categoryItem">
                    <span>{item}</span><span>→</span>
                  </Link>
                ))}
              </div>
            </aside>

            <div className="heroMain">
              <div className="pill">Alitek — сучасний магазин електроніки</div>
              <h1>Електроніка для дому, роботи та відпочинку</h1>
              <p>Зручний каталог, актуальні ціни, швидкий пошук і чистий сучасний інтерфейс без перевантаження.</p>
              <div className="heroButtons">
                <Link href="/catalog" className="primaryBtn">Перейти в каталог</Link>
                <Link href="/launch-checklist" className="secondaryBtn">Підготовка до запуску</Link>
              </div>
            </div>
          </section>

          <PromoBanners />
          <BrandsSection />

          <section className="section">
            <div className="sectionHeader">
              <h2>Популярні категорії</h2>
              <Link href="/catalog">Весь каталог</Link>
            </div>
            <div className="categoriesGrid">
              {categories.map((item, index) => {
                const icons = ["📱","💻","📺","🎧","🏠","⌚","🎮","🔊"];
                return (
                  <Link key={item} href={`/catalog/${slugifyCategory(item)}`} className="categoryCard">
                    <div className="iconBox">{icons[index % icons.length]}</div>
                    <div>
                      <div className="categoryCardTitle">{item}</div>
                      <div className="categoryCardText">Перейти в розділ</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="section">
            <div className="sectionHeader">
              <h2>Хіти продажу</h2>
              <Link href="/catalog">Дивитися всі</Link>
            </div>
            <div className="productsGrid">
              {popularProducts.map((product: any) => (
                <div key={product.id} className="productCard">
                  <Link href={`/product/${product.slug}`} className="productLink">
                    <div className="productImageWrap">
                      <img src={product.image || "/no-image.png"} alt={product.name} className="productImage" />
                    </div>
                    <div className="productName">{product.name}</div>
                    <div className="productPrice">{formatPrice(Number(product.price))}</div>
                    <div className={`stock ${product.available ? "in" : "out"}`}>{product.available ? "В наявності" : "Немає в наявності"}</div>
                  </Link>
                  <div className="productActions">
                    <AddToCartButton product={product} fullWidth />
                    <FavoriteButton product={product} fullWidth />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <FAQSection />
        </div>
      </main>

      <style jsx>{`
        .page { background:#f3f5f9; min-height:100vh; color:#0f172a; font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .container { max-width:1360px; margin:0 auto; padding:14px 18px 40px; }
        .header { display:grid; grid-template-columns:140px 124px minmax(0,1fr) auto; gap:12px; align-items:center; padding:6px 0 16px; }
        .logo { text-decoration:none; color:#0f172a; display:block; }
        .logoTitle { font-size:34px; font-weight:900; line-height:1; }
        .logoSub { font-size:12px; color:#64748b; margin-top:6px; }
        .headerBtn { height:52px; border-radius:14px; border:1px solid #dbe1ea; background:#fff; color:#0f172a; text-decoration:none; display:flex; align-items:center; justify-content:center; font-weight:700; }
        .searchForm { display:grid; grid-template-columns:minmax(0,1fr) 92px; gap:12px; min-width:0; }
        .searchInput { height:52px; border-radius:14px; border:1px solid #dbe1ea; background:#fff; padding:0 16px; font-size:15px; min-width:0; box-sizing:border-box; }
        .searchBtn { height:52px; border-radius:14px; border:none; background:#2f63f6; color:#fff; font-weight:800; cursor:pointer; }
        .headerActions { display:flex; gap:12px; flex-wrap:wrap; justify-content:flex-end; }
        .heroGrid { display:grid; grid-template-columns:220px minmax(0,1fr); gap:16px; align-items:stretch; }
        .sidebar, .productCard { background:#fff; border:1px solid #dbe1ea; }
        .sidebar { border-radius:22px; padding:14px; }
        .sectionTitle { font-size:20px; font-weight:900; margin-bottom:12px; }
        .categoryList { display:grid; gap:8px; }
        .categoryItem { min-height:44px; border-radius:12px; border:1px solid #e7ecf3; background:#f8fafc; display:flex; align-items:center; justify-content:space-between; padding:0 12px; font-size:14px; font-weight:600; text-decoration:none; color:#0f172a; }
        .heroMain { background:linear-gradient(135deg, #2f63f6 0%, #2752d8 100%); border-radius:28px; color:#fff; padding:26px 28px; min-height:310px; display:flex; flex-direction:column; justify-content:center; }
        .pill { display:inline-block; align-self:flex-start; background:rgba(255,255,255,.16); padding:8px 14px; border-radius:999px; font-weight:700; font-size:14px; margin-bottom:18px; }
        .heroMain h1 { margin:0; font-size:62px; line-height:.95; font-weight:900; letter-spacing:-0.03em; max-width:780px; }
        .heroMain p { margin:18px 0 0; max-width:720px; font-size:17px; line-height:1.6; color:rgba(255,255,255,.95); }
        .heroButtons { display:flex; gap:14px; margin-top:24px; flex-wrap:wrap; }
        .primaryBtn, .secondaryBtn { text-decoration:none; font-weight:800; border-radius:14px; display:inline-flex; align-items:center; justify-content:center; min-height:48px; padding:0 18px; }
        .primaryBtn { background:#2563eb; color:#fff; border:1px solid rgba(255,255,255,.15); }
        .secondaryBtn { background:#fff; color:#0f172a; }
        .section { margin-top:26px; }
        .sectionHeader { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; flex-wrap:wrap; }
        .sectionHeader h2 { margin:0; font-size:24px; font-weight:900; }
        .sectionHeader a { color:#2f63f6; text-decoration:none; font-weight:800; }
        .categoriesGrid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; }
        .categoryCard { background:#fff; border:1px solid #dbe1ea; border-radius:18px; padding:16px 18px; display:flex; align-items:center; gap:14px; text-decoration:none; color:#0f172a; }
        .iconBox { width:42px; height:42px; border-radius:14px; background:#eef4ff; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
        .categoryCardTitle { font-weight:800; font-size:16px; }
        .categoryCardText { color:#94a3b8; font-size:14px; margin-top:4px; }
        .productsGrid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; }
        .productCard { border-radius:22px; padding:14px; }
        .productLink { text-decoration:none; color:#0f172a; display:block; }
        .productImageWrap { height:220px; border-radius:18px; background:#f8fafc; display:flex; align-items:center; justify-content:center; overflow:hidden; margin-bottom:12px; }
        .productImage { width:100%; height:100%; object-fit:contain; }
        .productName { font-size:15px; line-height:1.45; min-height:66px; font-weight:700; }
        .productPrice { margin-top:10px; font-weight:900; font-size:28px; }
        .stock { margin-top:8px; font-weight:700; }
        .stock.in { color:#16a34a; } .stock.out { color:#64748b; }
        .productActions { margin-top:12px; display:grid; gap:10px; }
        @media (max-width:1024px) {
          .header { grid-template-columns:1fr 1fr; }
          .searchForm { grid-column:1 / -1; }
          .headerActions { grid-column:1 / -1; justify-content:flex-start; }
          .heroGrid { grid-template-columns:1fr; }
          .categoriesGrid, .productsGrid { grid-template-columns:repeat(2,minmax(0,1fr)); }
        }
        @media (max-width:768px) {
          .container { padding:12px 12px 32px; }
          .header { grid-template-columns:1fr; }
          .headerBtn { width:100%; }
          .searchForm { grid-template-columns:1fr; }
          .headerActions { width:100%; }
          .headerActions :global(a) { flex:1 1 auto; }
          .heroMain { padding:20px; min-height:0; }
          .heroMain h1 { font-size:36px; line-height:1.02; }
          .heroMain p { font-size:15px; }
          .heroButtons { flex-direction:column; }
          .heroButtons :global(a) { width:100%; }
          .categoriesGrid, .productsGrid { grid-template-columns:1fr; }
          .productImageWrap { height:200px; }
        }
      `}</style>
    </>
  );
}
