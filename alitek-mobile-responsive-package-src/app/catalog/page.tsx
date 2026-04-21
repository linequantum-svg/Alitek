import { getPromProducts } from "@/lib/prom-feed";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import CartBadge from "@/components/CartBadge";
import FavoritesBadge from "@/components/FavoritesBadge";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import Breadcrumbs from "@/components/Breadcrumbs";

type SearchParams = { q?: string; page?: string };

export default async function CatalogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const products = await getPromProducts();
  const q = String(params.q || "").trim().toLowerCase();
  const filtered = (products || []).filter((p: any) => !q || String(p.name || "").toLowerCase().includes(q));
  const page = Math.max(1, Number(params.page || "1") || 1);
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <>
      <main className="page">
        <div className="container">
          <div className="topRow">
            <Breadcrumbs items={[{ href: "/", label: "Головна" }, { label: "Каталог" }]} />
            <div className="badges"><FavoritesBadge /><CartBadge /></div>
          </div>
          <section className="card">
            <h1>Каталог товарів</h1>
            <form action="/catalog" method="get" className="searchForm">
              <input type="text" name="q" defaultValue={q} placeholder="Пошук товарів" className="field" />
              <button type="submit" className="submitBtn">Показати</button>
            </form>
          </section>
          <div className="productsGrid">
            {paged.map((product: any) => (
              <div key={product.id} className="productCard">
                <Link href={`/product/${product.slug}`} className="productLink">
                  <div className="imageWrap"><img src={product.image || "/no-image.png"} alt={product.name} className="image" /></div>
                  <div className="name">{product.name}</div>
                  <div className="price">{formatPrice(Number(product.price))}</div>
                </Link>
                <div className="actions">
                  <AddToCartButton product={product} fullWidth />
                  <FavoriteButton product={product} fullWidth />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <style jsx>{`
        .page { background:#f3f5f9; min-height:100vh; color:#0f172a; font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .container { max-width:1360px; margin:0 auto; padding:24px 18px 40px; }
        .topRow { margin-bottom:16px; display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap; }
        .badges { display:flex; gap:12px; flex-wrap:wrap; }
        .card,.productCard { background:#fff; border:1px solid #dbe1ea; }
        .card { border-radius:28px; padding:22px; margin-bottom:18px; }
        h1 { margin:0 0 18px; font-size:36px; font-weight:900; }
        .searchForm { display:grid; grid-template-columns:minmax(0,1fr) 180px; gap:12px; }
        .field { height:52px; border-radius:14px; border:1px solid #dbe1ea; padding:0 16px; font-size:15px; box-sizing:border-box; }
        .submitBtn { height:52px; border:none; border-radius:14px; background:#2f63f6; color:#fff; font-weight:800; cursor:pointer; }
        .productsGrid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; }
        .productCard { border-radius:22px; padding:14px; }
        .productLink { text-decoration:none; color:#0f172a; display:block; }
        .imageWrap { height:220px; border-radius:18px; background:#f8fafc; display:flex; align-items:center; justify-content:center; overflow:hidden; margin-bottom:12px; }
        .image { width:100%; height:100%; object-fit:contain; }
        .name { font-size:15px; line-height:1.45; min-height:66px; font-weight:700; }
        .price { margin-top:10px; font-weight:900; font-size:28px; }
        .actions { margin-top:12px; display:grid; gap:10px; }
        @media (max-width:1024px) { .productsGrid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
        @media (max-width:768px) { .container { padding:18px 12px 32px; } h1 { font-size:28px; } .searchForm { grid-template-columns:1fr; } .productsGrid { grid-template-columns:1fr; } .badges { width:100%; } .badges :global(a) { flex:1 1 auto; } }
      `}</style>
    </>
  );
}
