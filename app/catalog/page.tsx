import { Suspense } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import CartBadge from "@/components/CartBadge";
import CatalogClient from "@/components/CatalogClient";
import FavoritesBadge from "@/components/FavoritesBadge";
import { getCatalogPageData } from "@/lib/storefront-data";

export const revalidate = 300;

export default async function CatalogPage() {
  const initialData = await getCatalogPageData({
    page: 1,
    pageSize: 20,
  });

  return (
    <>
      <main className="page">
        <div className="container">
          <div className="topBar">
            <div className="titleBlock">
              <Breadcrumbs items={[{ href: "/", label: "Головна" }, { label: "Каталог" }]} />
              <h1>Каталог товарів</h1>
              <p>Зручний каталог з лівою колонкою фільтрів і щільною сіткою товарів.</p>
            </div>

            <div className="badges">
              <FavoritesBadge />
              <CartBadge />
            </div>
          </div>

          <Suspense fallback={null}>
            <CatalogClient
              initialData={{
                ok: true,
                total: initialData.total,
                totalPages: initialData.totalPages,
                categories: initialData.categories.map((item) => item.name),
                products: initialData.products.map((product) => ({
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  brand: product.brand,
                  categoryName: product.categoryName,
                  price: product.price,
                  oldPrice: product.oldPrice || 0,
                  available: product.available,
                  image: product.image,
                  images: product.images,
                })),
              }}
              initialRequestKey={JSON.stringify({
                q: "",
                category: "",
                available: false,
                sort: "popular",
                page: 1,
              })}
            />
          </Suspense>
        </div>
      </main>

      <style>{`
        .page {
          background:
            radial-gradient(circle at top left, rgba(148, 163, 184, 0.14), transparent 24%),
            linear-gradient(180deg, #f5f7fa 0%, #eef2f6 100%);
          min-height: 100vh;
          color: #0f172a;
          font-family: var(--font-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .container {
          max-width: 1680px;
          margin: 0 auto;
          padding: 20px 18px 42px;
        }
        .topBar {
          margin-bottom: 18px;
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: start;
          flex-wrap: wrap;
        }
        .titleBlock {
          display: grid;
          gap: 10px;
          max-width: 880px;
        }
        .titleBlock h1 {
          margin: 0;
          font-size: 46px;
          line-height: 0.98;
          font-weight: 800;
          letter-spacing: -0.04em;
        }
        .titleBlock p {
          margin: 0;
          color: #475569;
          font-size: 16px;
          line-height: 1.7;
        }
        .badges {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        @media (max-width: 720px) {
          .container { padding: 16px 12px 32px; }
          .titleBlock h1 { font-size: 32px; line-height: 1.02; }
        }
      `}</style>
    </>
  );
}
