import Link from "next/link";
import Image from "next/image";
import CartBadge from "@/components/CartBadge";
import FavoritesBadge from "@/components/FavoritesBadge";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import FAQSection from "@/components/FAQSection";
import DealOfDay from "@/components/DealOfDay";
import HomeProductLink from "@/components/HomeProductLink";
import HomeRecentlyViewed from "@/components/HomeRecentlyViewed";
import { getHomepageData, slugifyCategory } from "@/lib/storefront-data";
import { formatPrice } from "@/lib/utils";

function pickMixedProducts<T extends { id: string; categoryName?: string }>(items: T[], limit: number) {
  const buckets = new Map<string, T[]>();

  for (const item of items) {
    const key = String(item.categoryName || "other").trim().toLowerCase();
    const bucket = buckets.get(key) || [];
    bucket.push(item);
    buckets.set(key, bucket);
  }

  const mixed: T[] = [];
  const groups = Array.from(buckets.values()).sort((a, b) => b.length - a.length);

  while (mixed.length < limit && groups.some((group) => group.length > 0)) {
    for (const group of groups) {
      const next = group.shift();
      if (next) mixed.push(next);
      if (mixed.length >= limit) break;
    }
  }

  return mixed;
}

export default async function Home() {
  const { categories, popularProducts, showcaseProducts, deal } = await getHomepageData();
  const mixedPopularProducts = pickMixedProducts(
    [...popularProducts, ...showcaseProducts.filter((item) => !popularProducts.some((popular) => popular.id === item.id))],
    10
  );

  return (
    <>
      <main className="page">
        <div className="container">
          <header className="mainHeader">
            <div className="headerPrimary">
              <Link href="/" className="brandLink" aria-label="Головна">
                <Image
                  src="/65acd4cf-32e0-4b06-9672-c6d8b0c4bed6.png"
                  alt="Alitek"
                  width={252}
                  height={75}
                  className="brandLogoFull"
                  priority
                />
              </Link>

              <nav className="headerMenu">
                <Link href="/catalog">Каталог</Link>
                <Link href="/catalog">Тренди</Link>
                <Link href="/delivery-payment">Доставка</Link>
                <Link href="/contact">Контакти</Link>
              </nav>

              <div className="headerContact">
                <a href="tel:+380000000000">+38 (000) 000-00-00</a>
              </div>
            </div>

            <div className="headerSecondary">
              <Link href="/catalog" className="catalogButton">
                Каталог товарів
              </Link>

              <form action="/catalog" method="get" className="searchForm">
                <input type="text" name="q" placeholder="Пошук товарів" className="searchInput" />
                <button type="submit" className="searchButton" aria-label="Пошук">
                  ⌕
                </button>
              </form>

              <div className="headerBadges">
                <FavoritesBadge />
                <CartBadge />
              </div>
            </div>
          </header>

          <section className="heroSection">
            <aside className="categorySidebar">
              {categories.slice(0, 14).map((item) => (
                <Link key={item.id} href={`/catalog/${slugifyCategory(item.name)}`} className="categoryItem">
                  <span>{item.name}</span>
                  <span className="categoryArrow">›</span>
                </Link>
              ))}
            </aside>

            <div className="heroContent">
              <section className="heroBanner">
                <Link href="/catalog" className="heroBannerLink" aria-label="Перейти в каталог">
                  <img
                    src="/delivery-banner-v3.png"
                    alt="Доставка Нова пошта та Укрпошта"
                    width={1773}
                    height={886}
                    className="heroBannerImage"
                  />
                </Link>
              </section>

              <section className="quickTiles">
                <div className="quickTile">
                  <div className="quickTileIcon">✓</div>
                  <div>
                    <strong>Гарантія та перевірка</strong>
                    <span>Перед відправкою уточнюємо деталі замовлення</span>
                  </div>
                </div>

                <div className="quickTile">
                  <div className="quickTileIcon">⚡</div>
                  <div>
                    <strong>Швидка відправка</strong>
                    <span>Передаємо замовлення на доставку без затримок</span>
                  </div>
                </div>

                <div className="quickTile">
                  <div className="quickTileIcon">₴</div>
                  <div>
                    <strong>Накладений платіж</strong>
                    <span>Зручна оплата при отриманні у відділенні</span>
                  </div>
                </div>

                <div className="quickTile">
                  <div className="quickTileIcon">✉</div>
                  <div>
                    <strong>Зручний зв'язок</strong>
                    <span>Через сайт або Telegram без довгого очікування</span>
                  </div>
                </div>
              </section>
            </div>
          </section>

          <section className="sectionBlock">
            <div className="sectionHeader">
              <h2>Трендові товари</h2>
              <Link href="/catalog">Увесь каталог</Link>
            </div>

            <div className="productsGrid">
              {mixedPopularProducts.map((product, index) => (
                <div key={product.id} className="productCard">
                  <div className="productTop">
                    <div className="productBadge">{index === 0 ? "Тренд" : "У тренді"}</div>
                    <div className="productCode">{product.vendorCode || product.id}</div>
                  </div>

                  <HomeProductLink href={`/product/${product.slug}`} className="productLink">
                    <div className="productImageWrap">
                      <Image
                        src={product.image || "/no-image.png"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 20vw"
                        style={{ objectFit: "contain" }}
                        unoptimized
                      />
                    </div>

                    <div className="productName">{product.name}</div>
                    <div className="productPrice">{formatPrice(Number(product.price))}</div>
                  </HomeProductLink>

                  <div className="productActions">
                    <AddToCartButton product={product} fullWidth />
                    <FavoriteButton product={product} fullWidth />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <HomeRecentlyViewed />
          <DealOfDay product={deal} />
          <FAQSection />
        </div>
      </main>

      <style>{`
        .page {
          background: #f2f4f7;
          min-height: 100vh;
          color: #0f172a;
          font-family: var(--font-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .container {
          max-width: 1480px;
          margin: 0 auto;
          padding: 8px 18px 40px;
        }
        .mainHeader {
          margin-top: 6px;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 16px 38px rgba(15, 23, 42, 0.06);
          overflow: hidden;
        }
        .headerPrimary {
          min-height: 82px;
          padding: 0 18px;
          display: grid;
          grid-template-columns: 252px minmax(0, 1fr) auto;
          gap: 16px;
          align-items: center;
        }
        .brandLink {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }
        .brandLogoFull {
          display: block;
          width: auto;
          height: 56px;
        }
        .headerMenu {
          display: flex;
          gap: 28px;
          align-items: center;
          flex-wrap: wrap;
        }
        .headerMenu a,
        .headerContact a {
          color: #0f172a;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          line-height: 1;
        }
        .headerSecondary {
          min-height: 56px;
          background: #4b5563;
          padding: 8px 22px;
          display: grid;
          grid-template-columns: 270px minmax(0, 1fr) auto;
          gap: 16px;
          align-items: center;
        }
        .catalogButton {
          min-height: 40px;
          padding: 0 18px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          text-decoration: none;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
        }
        .searchForm {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 56px;
          gap: 10px;
        }
        .searchInput {
          min-height: 40px;
          border: none;
          border-radius: 14px;
          padding: 0 16px;
          font-size: 15px;
          outline: none;
        }
        .searchButton {
          min-height: 40px;
          border: none;
          border-radius: 14px;
          background: #ffffff;
          color: #111827;
          font-size: 20px;
          cursor: pointer;
        }
        .headerBadges {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .heroSection {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 370px minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }
        .categorySidebar,
        .heroBanner,
        .quickTiles,
        .productCard {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 16px 34px rgba(15, 23, 42, 0.05);
        }
        .categorySidebar {
          padding: 10px;
          display: grid;
          gap: 6px;
        }
        .categoryItem {
          min-height: 44px;
          padding: 0 14px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          text-decoration: none;
          color: #111827;
          font-size: 15px;
          font-weight: 700;
        }
        .categoryItem:hover {
          background: #f8fafc;
        }
        .categoryArrow {
          color: #9ca3af;
          font-size: 22px;
          line-height: 1;
        }
        .heroContent {
          display: grid;
          gap: 14px;
        }
        .heroBanner {
          min-height: 0;
          padding: 0;
          position: relative;
          overflow: hidden;
          background: linear-gradient(90deg, #f7dcae 0%, #f9e6c4 48%, #f6ddb3 100%);
        }
        .heroBannerLink {
          display: block;
          width: 100%;
          line-height: 0;
          background: linear-gradient(90deg, #f7dcae 0%, #f9e6c4 48%, #f6ddb3 100%);
        }
        .heroBanner::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(255, 197, 94, 0.08) 0%, rgba(255, 230, 179, 0.04) 46%, rgba(255, 185, 74, 0.08) 100%),
            radial-gradient(circle at top left, rgba(255, 255, 255, 0.22), transparent 22%);
          pointer-events: none;
          z-index: 1;
        }
        .heroBannerImage {
          display: block;
          width: 100%;
          height: auto;
          filter: saturate(1.06) contrast(1.03) brightness(1.02);
        }
        .quickTiles {
          min-height: 88px;
          padding: 14px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }
        .quickTile {
          min-height: 88px;
          padding: 14px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e7ecf3;
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr);
          gap: 12px;
          align-items: center;
          color: #0f172a;
        }
        .quickTileIcon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: #fff4e8;
          color: #c96a2b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 800;
          flex-shrink: 0;
        }
        .quickTile strong {
          font-size: 14px;
          font-weight: 800;
          display: block;
        }
        .quickTile span {
          margin-top: 4px;
          color: #64748b;
          font-size: 13px;
          display: block;
          line-height: 1.45;
        }
        .sectionBlock {
          margin-top: 34px;
        }
        .sectionHeader {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .sectionHeader h2 {
          margin: 0;
          font-size: 26px;
          font-weight: 800;
        }
        .sectionHeader a {
          color: #475569;
          text-decoration: none;
          font-weight: 800;
        }
        .productsGrid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
        }
        .productCard {
          padding: 14px;
          display: flex;
          flex-direction: column;
        }
        .productTop {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .productBadge {
          min-height: 26px;
          padding: 0 10px;
          border-radius: 999px;
          background: #22c55e;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
        }
        .productCode {
          color: #94a3b8;
          font-size: 13px;
          font-weight: 700;
        }
        .productLink {
          display: block;
          text-decoration: none;
          color: #0f172a;
        }
        .productImageWrap {
          position: relative;
          height: 220px;
          border-radius: 16px;
          background: linear-gradient(180deg, #fbfbfb 0%, #f1f5f9 100%);
          overflow: hidden;
          margin-bottom: 12px;
        }
        .productName {
          min-height: 64px;
          font-size: 15px;
          line-height: 1.45;
          font-weight: 700;
        }
        .productPrice {
          margin-top: 10px;
          font-size: 28px;
          font-weight: 800;
        }
        .productActions {
          margin-top: auto;
          padding-top: 14px;
          display: grid;
          gap: 10px;
        }
        @media (max-width: 1180px) {
          .headerPrimary,
          .headerSecondary,
          .heroSection,
          .heroBanner {
            grid-template-columns: 1fr;
          }
          .brandLogoFull {
            height: 46px;
            width: auto;
          }
          .quickTiles,
          .productsGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .heroBannerLink {
            min-height: 0;
          }
        }
        @media (max-width: 720px) {
          .container {
            padding: 6px 12px 32px;
          }
          .brandLogoFull {
            height: 38px;
            width: auto;
          }
          .heroBannerLink {
            min-height: 0;
          }
          .quickTiles,
          .productsGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}



