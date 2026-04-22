import Link from "next/link";
import Image from "next/image";
import CartBadge from "@/components/CartBadge";
import FavoritesBadge from "@/components/FavoritesBadge";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import FAQSection from "@/components/FAQSection";
import DealOfDay from "@/components/DealOfDay";
import HoverProductImage from "@/components/HoverProductImage";
import HomeProductLink from "@/components/HomeProductLink";
import HomeRecentlyViewed from "@/components/HomeRecentlyViewed";
import { getCatalogCategoryGroups } from "@/lib/catalog-taxonomy";
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

function getCategoryIcon(title: string) {
  switch (title) {
    case "Маркери":
      return "🖊️";
    case "Годинники":
      return "⌚";
    case "Навушники":
      return "🎧";
    case "Комплекти":
      return "🎁";
    case "Світильники":
      return "💡";
    case "Адаптери":
      return "🔌";
    case "Павербанки, зарядні пристрої":
      return "🔋";
    case "Чохли для телефонів":
      return "📱";
    case "Інше":
      return "📦";
    default:
      return "•";
  }
}

export default async function Home() {
  const { categories, popularProducts, showcaseProducts, deal } = await getHomepageData();
  const homepageCategoryGroups = getCatalogCategoryGroups(categories.map((item) => item.name));
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
              <div className="sidebarKicker">Категорії</div>

              {homepageCategoryGroups.map((group) => {
                const isStandaloneGroup = group.title === "Маркери";
                const hasVisibleChildren = !isStandaloneGroup && group.items.length > 0;
                const titleToShow = isStandaloneGroup ? group.items[0] : group.title;
                const parentHref = isStandaloneGroup
                  ? `/catalog/${slugifyCategory(group.items[0])}`
                  : `/catalog?category=${encodeURIComponent(group.title)}`;

                return (
                  <div className="categoryGroup" key={group.title}>
                    <Link href={parentHref} className="categoryParentCard">
                      <span className="categoryParentIcon">{getCategoryIcon(group.title)}</span>
                      <span>{titleToShow}</span>
                    </Link>

                    {hasVisibleChildren ? (
                      <div className="subcategoryRail">
                        {group.items.map((categoryName) => (
                          <Link
                            key={categoryName}
                            href={`/catalog/${slugifyCategory(categoryName)}`}
                            className="subcategoryItem"
                          >
                            <span className="subcategoryDot" />
                            <span>{categoryName}</span>
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
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
                      <HoverProductImage
                        image={product.image || "/no-image.png"}
                        images={product.images || []}
                        alt={product.name}
                        sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 20vw"
                        className="productImageHover"
                      />
                    </div>

                    <div className="productName">
                      <span className="productNameClamp">{product.name}</span>
                      <span className="productNameFull">{product.name}</span>
                    </div>
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
        .headerMenu a {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          padding: 0 12px;
          border-radius: 14px;
          transition:
            color 0.2s ease,
            background-color 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }
        .headerMenu a:hover,
        .headerMenu a:focus-visible {
          color: #2563eb;
          background: #eff6ff;
          box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.18);
          transform: translateY(-1px);
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
          grid-template-columns: 280px minmax(0, 1fr);
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
          padding: 16px 12px 12px;
          display: grid;
          gap: 6px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.99), rgba(249, 251, 253, 0.98)),
            radial-gradient(circle at top right, rgba(148, 163, 184, 0.08), transparent 34%);
          border: 1px solid #e6edf5;
        }
        .sidebarKicker {
          color: #3b82f6;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0 6px;
        }
        .infoCard {
        }
        .categoryGroup {
          display: grid;
          gap: 4px;
        }
        .categoryParentCard {
          min-height: 46px;
          padding: 0 12px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #111827;
          background: linear-gradient(180deg, #ffffff, #fcfdff);
          border: 1px solid #e3eaf2;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.03);
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.03em;
          transition:
            border-color 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease,
            color 0.2s ease;
        }
        .categoryParentCard:hover,
        .categoryParentCard:focus-visible {
          border-color: #bfdbfe;
          background: linear-gradient(180deg, #ffffff, #f3f8ff);
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.08);
          color: #2563eb;
          transform: translateX(4px);
        }
        .categoryParentCard:hover .categoryParentIcon,
        .categoryParentCard:focus-visible .categoryParentIcon {
          border-color: #bfdbfe;
          background: linear-gradient(180deg, #ffffff, #eff6ff);
          box-shadow: 0 6px 14px rgba(37, 99, 235, 0.1);
        }
        .categoryParentIcon {
          width: 28px;
          height: 28px;
          border-radius: 10px;
          background: linear-gradient(180deg, #ffffff, #f4f8fc);
          border: 1px solid #e3eaf2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .subcategoryRail {
          margin-left: 12px;
          padding-left: 8px;
          border-left: 2px solid #e2eaf4;
          display: grid;
          gap: 4px;
        }
        .subcategoryItem {
          min-height: 34px;
          padding: 4px 8px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #111827;
          background: linear-gradient(180deg, #ffffff, #fbfcfe);
          border: 1px solid #e6edf4;
          box-shadow: 0 5px 12px rgba(15, 23, 42, 0.025);
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.15;
          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }
        .subcategoryItem:hover,
        .subcategoryItem:focus-visible {
          border-color: #bfdbfe;
          background: linear-gradient(180deg, #ffffff, #f2f7ff);
          box-shadow: 0 8px 16px rgba(37, 99, 235, 0.07);
          color: #2563eb;
          transform: translateX(3px);
        }
        .subcategoryItem:hover .subcategoryDot,
        .subcategoryItem:focus-visible .subcategoryDot {
          background: #dbeafe;
        }
        .subcategoryItem:hover .subcategoryDot::after,
        .subcategoryItem:focus-visible .subcategoryDot::after {
          background: #2563eb;
        }
        .subcategoryDot {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #eff5fb;
          flex-shrink: 0;
          position: relative;
        }
        .subcategoryDot::after {
          content: "";
          width: 3px;
          height: 3px;
          border-radius: 999px;
          background: #60a5fa;
          display: block;
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
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
          border: 1px solid transparent;
        }
        .productCard:hover,
        .productCard:focus-within {
          transform: translateY(-4px);
          border-color: #d8e3f0;
          background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.12);
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
        .productImageHover {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .productName {
          min-height: calc(1.45em * 4);
          margin-bottom: 12px;
          font-size: 15px;
          line-height: 1.45;
          font-weight: 700;
          position: relative;
          color: #0f172a;
          transition: color 0.22s ease;
        }
        .productNameClamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .productNameFull {
          position: absolute;
          inset: 0;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s ease;
          min-height: calc(1.45em * 4);
        }
        .productCard:hover .productName,
        .productCard:focus-within .productName {
          color: #d97706;
        }
        .productCard:hover .productNameFull,
        .productCard:focus-within .productNameFull {
          opacity: 1;
        }
        .productCard:hover .productNameClamp,
        .productCard:focus-within .productNameClamp {
          opacity: 0;
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
          .categorySidebar {
            padding: 14px 10px 10px;
          }
          .categoryParentCard {
            min-height: 42px;
            padding: 0 10px;
            border-radius: 12px;
            font-size: 15px;
          }
          .categoryParentIcon {
            width: 24px;
            height: 24px;
            border-radius: 9px;
            font-size: 14px;
          }
          .subcategoryRail {
            margin-left: 10px;
            padding-left: 8px;
            gap: 4px;
          }
          .subcategoryItem {
            min-height: 32px;
            padding: 4px 7px;
            border-radius: 10px;
            font-size: 13px;
          }
          .subcategoryDot {
            width: 13px;
            height: 13px;
          }
        }
      `}</style>
    </>
  );
}



