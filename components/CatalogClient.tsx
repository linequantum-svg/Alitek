"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import {
  getCatalogCache,
  prefetchProductCache,
  setCatalogCache,
} from "@/lib/storefront-client-cache";
import { getCatalogCategoryGroups } from "@/lib/catalog-taxonomy";
import { slugifyCategory } from "@/lib/storefront-data";
import { formatPrice } from "@/lib/utils";

type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categoryName: string;
  price: number;
  oldPrice: number;
  available: boolean;
  image?: string;
  images?: string[];
};

type ApiPayload = {
  ok: boolean;
  total: number;
  totalPages: number;
  categories: string[];
  products: CatalogProduct[];
};

type CatalogClientProps = {
  initialData: ApiPayload;
  fixedCategory?: string;
  categoryTitle?: string;
  initialRequestKey?: string;
};

type CardProps = {
  product: CatalogProduct;
  priority?: boolean;
};

const SORT_OPTIONS = [
  { value: "popular", label: "Популярні" },
  { value: "price_asc", label: "Спочатку дешевші" },
  { value: "price_desc", label: "Спочатку дорожчі" },
  { value: "name_asc", label: "Назва: А-Я" },
  { value: "name_desc", label: "Назва: Я-А" },
];

function buildQueryString(params: {
  q?: string;
  page?: number;
  sort?: string;
  available?: boolean;
  category?: string;
}) {
  const search = new URLSearchParams();

  if (params.q) search.set("q", params.q);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  if (params.sort && params.sort !== "popular") search.set("sort", params.sort);
  if (params.available) search.set("available", "1");
  if (params.category) search.set("category", params.category);

  return search.toString();
}

function CatalogSkeleton() {
  return (
    <div className="grid" aria-hidden="true">
      {Array.from({ length: 10 }).map((_, index) => (
        <article className="card skeletonCard" key={index}>
          <div className="imageWrap skeletonBox" />
          <div className="skeletonLine short" />
          <div className="skeletonLine medium" />
          <div className="skeletonPrice" />
          <div className="skeletonButton" />
          <div className="skeletonButton" />
        </article>
      ))}
    </div>
  );
}

function CatalogCard({ product, priority = false }: CardProps) {
  const galleryImages = useMemo(() => {
    const merged = [product.image, ...(product.images ?? [])].filter(Boolean) as string[];
    return Array.from(new Set(merged));
  }, [product.image, product.images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentImage = galleryImages[activeIndex] || product.image || "/no-image.png";
  const showHotBadge =
    product.oldPrice > product.price ||
    Array.from(String(product.id)).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 6 === 0;

  useEffect(() => {
    setActiveIndex(0);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [product.id]);

  const startHoverPreview = () => {
    prefetchProductCache(product.slug);

    if (galleryImages.length <= 1 || intervalRef.current) return;

    setActiveIndex((prev) => (prev + 1) % galleryImages.length);

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % galleryImages.length);
    }, 900);
  };

  const stopHoverPreview = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveIndex(0);
  };

  return (
    <article
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        height: "100%",
        padding: "14px",
        borderRadius: "18px",
        background: "#fff",
        border: "1px solid #d5dfeb",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
        overflow: "hidden",
        alignSelf: "stretch",
      }}
    >
      <Link
        className="productLink"
        href={`/product/${product.slug}`}
        prefetch
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          color: "#0f172a",
          textDecoration: "none",
        }}
      >
        <div
          className="imageWrap"
          style={{
            position: "relative",
            height: "250px",
            borderRadius: "14px",
            background: "#f8fafc",
            border: "1px solid #eef2f7",
            overflow: "hidden",
            marginBottom: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          onMouseEnter={startHoverPreview}
          onMouseLeave={stopHoverPreview}
          onFocus={startHoverPreview}
          onBlur={stopHoverPreview}
        >
          {showHotBadge ? (
            <span aria-label="Хіт продажів" className="hotBadge">
              <img alt="" aria-hidden="true" className="hotBadgeFlame" src="/flame-badge-user.png" />
            </span>
          ) : null}
          <Image
            alt={product.name}
            className="productImage"
            height={360}
            priority={priority}
            sizes="(max-width: 900px) 50vw, (max-width: 1200px) 33vw, (max-width: 1600px) 20vw, 16vw"
            src={currentImage}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
            width={360}
          />
        </div>

        <div
          className="cardBody"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: "1 1 auto",
            minHeight: 0,
          }}
        >
          <div
            className="metaRow statusOnly"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
              minHeight: "20px",
            }}
          >
            <span
              className={`stock ${product.available ? "ok" : "out"}`}
              style={{
                fontSize: "14px",
                fontWeight: 800,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                color: product.available ? "#16a34a" : "#c2410c",
                textDecoration: "none",
              }}
            >
              {product.available ? "В наявності" : "Немає в наявності"}
            </span>
          </div>

          <h3
            className="name"
            style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: 700,
              lineHeight: 1.3,
              color: "#0f172a",
              textDecoration: "none",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "34px",
            }}
          >
            {product.name}
          </h3>

          <div
            className="priceRow"
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "0",
              marginTop: "2px",
              marginBottom: 0,
            }}
          >
            <strong
              className="price"
              style={{
                fontSize: "24px",
                lineHeight: 1.05,
                color: "#0f172a",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              {formatPrice(product.price)}
            </strong>
          </div>
        </div>
      </Link>

      <div
        className="actions"
        style={{
          display: "grid",
          gap: "10px",
          marginTop: "8px",
          paddingTop: "10px",
          borderTop: "1px solid #edf2f7",
        }}
      >
        <AddToCartButton
          fullWidth
          product={{
            id: product.id,
            image: product.image || "/no-image.png",
            name: product.name,
            price: product.price,
            slug: product.slug,
          }}
          variant="primary"
        />
        <FavoriteButton
          product={{
            id: product.id,
            image: product.image || "/no-image.png",
            name: product.name,
            price: product.price,
            slug: product.slug,
          }}
        />
      </div>
    </article>
  );
}

export default function CatalogClient({
  initialData,
  fixedCategory,
  categoryTitle,
}: CatalogClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = useMemo(
    () => ({
      q: searchParams.get("q") ?? "",
      page: Number(searchParams.get("page") ?? "1") || 1,
      sort: searchParams.get("sort") ?? "popular",
      available: searchParams.get("available") === "1",
      category: fixedCategory || searchParams.get("category") || "",
    }),
    [fixedCategory, searchParams],
  );

  const [draftQ, setDraftQ] = useState(current.q);
  const [draftSort, setDraftSort] = useState(current.sort);
  const [draftAvailable, setDraftAvailable] = useState(current.available);
  const [draftCategory, setDraftCategory] = useState(current.category);
  const [data, setData] = useState<ApiPayload>(initialData);
  const [products, setProducts] = useState<CatalogProduct[]>(initialData.products);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [loadedPage, setLoadedPage] = useState(current.page);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const navigationGroups = useMemo(
    () => getCatalogCategoryGroups(data.categories),
    [data.categories],
  );

  useEffect(() => {
    setDraftQ(current.q);
    setDraftSort(current.sort);
    setDraftAvailable(current.available);
    setDraftCategory(current.category);
  }, [current.available, current.category, current.q, current.sort]);

  const requestKey = useMemo(
    () =>
      JSON.stringify({
        category: current.category,
        page: current.page,
        q: current.q,
        sort: current.sort,
        available: current.available,
      }),
    [current.available, current.category, current.page, current.q, current.sort],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const initialKey = JSON.stringify({
        category: fixedCategory || "",
        page: 1,
        q: "",
        sort: "popular",
        available: false,
      });

      if (requestKey === initialKey) {
        setData(initialData);
        setProducts(initialData.products);
        setLoadedPage(current.page);
        setCatalogCache(requestKey, initialData);
        return;
      }

      const cached = getCatalogCache<ApiPayload>(requestKey);
      if (cached) {
        setData(cached);
        setProducts(cached.products);
        setLoadedPage(current.page);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const qs = buildQueryString({
          q: current.q,
          page: current.page,
          sort: current.sort,
          available: current.available,
          category: current.category,
        });
        const response = await fetch(`/api/products?${qs}`, { cache: "no-store" });
        const payload: ApiPayload = await response.json();

        if (!response.ok || !payload.ok) {
          throw new Error("Не вдалося завантажити товари.");
        }

        if (!cancelled) {
          setData(payload);
          setProducts(payload.products);
          setLoadedPage(current.page);
          setCatalogCache(requestKey, payload);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            fetchError instanceof Error ? fetchError.message : "Не вдалося завантажити товари.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [current.available, current.category, current.page, current.q, current.sort, fixedCategory, initialData, requestKey]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (loading || loadingMore) return;
    if (loadedPage >= data.totalPages) return;

    const node = loadMoreRef.current;
    let cancelled = false;

    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || cancelled) return;

        observer.disconnect();
        const nextPage = loadedPage + 1;
        const nextKey = JSON.stringify({
          category: current.category,
          page: nextPage,
          q: current.q,
          sort: current.sort,
          available: current.available,
        });

        const applyPayload = (payload: ApiPayload) => {
          setData(payload);
          setProducts((prev) => {
            const seen = new Set(prev.map((item) => item.id));
            const merged = [...prev];
            for (const item of payload.products) {
              if (!seen.has(item.id)) {
                merged.push(item);
                seen.add(item.id);
              }
            }
            return merged;
          });
          setLoadedPage(nextPage);
        };

        const cached = getCatalogCache<ApiPayload>(nextKey);
        if (cached) {
          applyPayload(cached);
          return;
        }

        setLoadingMore(true);
        try {
          const qs = buildQueryString({
            q: current.q,
            page: nextPage,
            sort: current.sort,
            available: current.available,
            category: current.category,
          });
          const response = await fetch(`/api/products?${qs}`, { cache: "no-store" });
          const payload: ApiPayload = await response.json();

          if (!response.ok || !payload.ok) {
            throw new Error("Не вдалося підвантажити товари.");
          }

          if (!cancelled) {
            setCatalogCache(nextKey, payload);
            applyPayload(payload);
          }
        } catch (fetchError) {
          if (!cancelled) {
            setError(
              fetchError instanceof Error
                ? fetchError.message
                : "Не вдалося підвантажити товари.",
            );
          }
        } finally {
          if (!cancelled) setLoadingMore(false);
        }
      },
      { rootMargin: "280px 0px" },
    );

    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [
    current.available,
    current.category,
    current.q,
    current.sort,
    data.totalPages,
    loadedPage,
    loading,
    loadingMore,
  ]);

  const updateUrl = (next: {
    q?: string;
    page?: number;
    sort?: string;
    available?: boolean;
    category?: string;
  }) => {
    const query = buildQueryString({
      q: next.q,
      page: next.page,
      sort: next.sort,
      available: next.available,
      category: fixedCategory || next.category,
    });

    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const goToCategory = (category: string) => {
    const nextCategory = String(category || "").trim();
    if (!nextCategory) return;

    if (fixedCategory) {
      router.push(`/catalog/${slugifyCategory(nextCategory)}`, { scroll: false });
      return;
    }

    updateUrl({
      q: current.q,
      page: 1,
      sort: current.sort,
      available: current.available,
      category: nextCategory,
    });
  };

  const submitFilters = () => {
    updateUrl({
      q: draftQ.trim(),
      page: 1,
      sort: draftSort,
      available: draftAvailable,
      category: draftCategory,
    });
  };

  const resetFilters = () => {
    setDraftQ("");
    setDraftSort("popular");
    setDraftAvailable(false);
    setDraftCategory(fixedCategory || "");
    updateUrl({
      q: "",
      page: 1,
      sort: "popular",
      available: false,
      category: fixedCategory || "",
    });
  };

  const title = categoryTitle || fixedCategory || "Каталог товарів";

  return (
    <section className="shell">
      <aside className="sidebar">
        <div className="blueBtn">Каталог товарів</div>

        <div className="panel filterPanel">
          <h2 className="filterTitle">Фільтри</h2>

          <input
            className="field"
            onChange={(event) => setDraftQ(event.target.value)}
            placeholder="Пошук товарів"
            type="search"
            value={draftQ}
          />

          <select
            className="field"
            disabled={Boolean(fixedCategory)}
            onChange={(event) => setDraftCategory(event.target.value)}
            value={draftCategory}
          >
            <option value="">Усі категорії</option>
            {data.categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select className="field" onChange={(event) => setDraftSort(event.target.value)} value={draftSort}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="checkboxRow">
            <input
              checked={draftAvailable}
              onChange={(event) => setDraftAvailable(event.target.checked)}
              type="checkbox"
            />
            <span>Лише в наявності</span>
          </label>

          <div className="buttonRow">
            <button className="primaryButton" onClick={submitFilters} type="button">
              {loading ? "Оновлюємо..." : "Показати"}
            </button>
            <button className="ghostButton" onClick={resetFilters} type="button">
              Скинути
            </button>
          </div>
        </div>

        <div className="panel sideLinks">
          <h2 className="filterTitle">Категорії</h2>
          {navigationGroups.map((group) => (
            <div className="sideGroup" key={group.title}>
              {group.title !== group.items[0] ? (
                <div className="sideGroupTitle">{group.title}</div>
              ) : null}
              <div className="sideGroupItems">
                {group.items.map((item) => {
                  const active = item === (fixedCategory || current.category);
                  return (
                    <button
                      className={`sideLink ${active ? "active" : ""}`}
                      key={item}
                      onClick={() => goToCategory(item)}
                      type="button"
                    >
                      <span>{item}</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="content">
        <div className="toolbar panel">
          <div>
            <h1 className="toolbarTitle">
              {loading ? "Оновлюємо товари..." : `Знайдено: ${data.total}`}
            </h1>
            <p className="toolbarMeta">
              {current.q
                ? `Пошук: ${current.q}`
                : fixedCategory || current.category
                  ? `Категорія: ${title}`
                  : "Увесь каталог"}
            </p>
          </div>

          <div className="toolbarControls">
            <select
              className="compact"
              onChange={(event) =>
                updateUrl({
                  q: current.q,
                  page: 1,
                  sort: event.target.value,
                  available: current.available,
                  category: current.category,
                })
              }
              value={current.sort}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              className={`availabilityToggle ${current.available ? "active" : ""}`}
              onClick={() =>
                updateUrl({
                  q: current.q,
                  page: 1,
                  sort: current.sort,
                  available: !current.available,
                  category: current.category,
                })
              }
              type="button"
            >
              Лише в наявності
            </button>
          </div>
        </div>

        {error ? <div className="panel errorBox">{error}</div> : null}
        {loading && !data.products.length ? <CatalogSkeleton /> : null}
        {!loading && !data.products.length ? (
          <div className="panel emptyBox">За цими параметрами товари не знайдено.</div>
        ) : null}

        {!!products.length ? (
          <div className="grid">
            {products.map((product, index) => (
              <CatalogCard key={`${product.id}-${index}`} priority={index < 5} product={product} />
            ))}
          </div>
        ) : null}

        {products.length > 0 && loadedPage < data.totalPages ? (
          <div className="loadMoreState panel" ref={loadMoreRef}>
            {loadingMore ? "Завантажуємо ще товари..." : "Прокрути нижче, щоб побачити більше товарів"}
          </div>
        ) : null}
      </div>

      <style jsx>{`
        .shell {
          display: grid;
          grid-template-columns: minmax(300px, 320px) minmax(0, 1fr);
          gap: 18px;
          align-items: start;
          min-width: 0;
        }
        .sidebar {
          position: sticky;
          top: 16px;
          display: grid;
          gap: 18px;
          min-width: 0;
          width: 100%;
          z-index: 0;
        }
        .content {
          display: grid;
          gap: 16px;
          min-width: 0;
        }
        .panel {
          background: #fff;
          border: 1px solid #dbe5f1;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.04);
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
        }
        .blueBtn {
          background: linear-gradient(135deg, #5aa2ff, #2676e7);
          color: #fff;
          border-radius: 18px;
          padding: 18px 20px;
          font-size: 16px;
          font-weight: 800;
          box-shadow: 0 14px 28px rgba(37, 99, 235, 0.18);
        }
        .filterPanel,
        .sideLinks {
          display: grid;
          gap: 16px;
          padding: 18px;
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
        }
        .sideLinks {
          gap: 16px;
          padding: 16px;
        }
        .filterTitle {
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
        }
        .sideLinks .filterTitle {
          padding: 8px 8px 14px;
        }
        .sideGroup {
          display: grid;
          gap: 4px;
        }
        .sideGroupTitle {
          padding: 2px 8px 8px;
          color: #64748b;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .sideGroupItems {
          display: grid;
          gap: 2px;
        }
        .field {
          width: 100%;
          max-width: 100%;
          border: 1px solid #dbe5f1;
          border-radius: 20px;
          background: #fff;
          padding: 18px 20px;
          font-size: 16px;
          color: #0f172a;
          outline: none;
          box-sizing: border-box;
        }
        select.field,
        .compact {
          padding-right: 26px;
        }
        .checkboxRow {
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid #dbe5f1;
          border-radius: 20px;
          padding: 18px 20px;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }
        .checkboxRow input {
          width: 20px;
          height: 20px;
        }
        .buttonRow {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 12px;
          min-width: 0;
        }
        .primaryButton,
        .ghostButton,
        .pageButton,
        .pageNumber,
        .availabilityToggle,
        .sideLink {
          border: 1px solid #dbe5f1;
          border-radius: 20px;
          background: #fff;
          color: #0f172a;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
        }
        .primaryButton {
          background: #dd843e;
          border-color: #dd843e;
          color: #fff;
          padding: 18px 20px;
        }
        .ghostButton {
          padding: 18px 20px;
        }
        .sideLink {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 64px;
          padding: 0 16px;
          text-align: left;
          font-size: 17px;
          line-height: 1.25;
          border-color: transparent;
          box-shadow: none;
        }
        .sideLink:hover {
          background: #f3f6fa;
          color: #d97706;
          transform: translateX(4px);
        }
        .sideLink.active {
          border-color: transparent;
          background: #edf4fb;
          color: #0f172a;
        }
        .sideLink span:last-child {
          color: #94a3b8;
          font-size: 30px;
          line-height: 1;
          font-weight: 400;
        }
        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 20px;
          min-width: 0;
        }
        .toolbarTitle {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
        }
        .toolbarMeta {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 14px;
        }
        .toolbarControls {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .compact {
          min-width: 240px;
          max-width: 100%;
          border: 1px solid #dbe5f1;
          border-radius: 14px;
          background: #fff;
          padding: 14px 16px;
          font-size: 16px;
          color: #0f172a;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
          box-sizing: border-box;
        }
        select.field,
        .compact {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          padding-right: 52px;
          background-color: #fff;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%230f172a' stroke-width='2.25' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 18px center;
          background-size: 18px;
        }
        .availabilityToggle {
          padding: 14px 18px;
        }
        .availabilityToggle.active {
          background: #ecfdf5;
          border-color: #86efac;
          color: #166534;
        }
        .errorBox,
        .emptyBox {
          padding: 18px 20px;
          font-size: 16px;
          color: #0f172a;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          column-gap: 14px;
          row-gap: 28px;
          align-items: start;
          min-width: 0;
        }
        :global(.card) {
          display: flex;
          flex-direction: column;
          min-height: 0;
          height: 100%;
          padding: 14px;
          border-radius: 18px;
          background: #fff;
          border: 1px solid #d5dfeb;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
          overflow: hidden;
        }
        :global(.productLink) {
          display: flex;
          flex-direction: column;
          flex: 1;
          color: #0f172a;
          text-decoration: none !important;
        }
        :global(.card a),
        :global(.card a:visited),
        :global(.card a:hover),
        :global(.card a:active),
        :global(.card a:focus) {
          color: inherit !important;
          text-decoration: none !important;
        }
        :global(.productLink:visited),
        :global(.productLink:hover),
        :global(.productLink:active),
        :global(.productLink:focus) {
          color: #0f172a;
          text-decoration: none !important;
        }
        :global(.productLink *) {
          text-decoration: none !important;
        }
        :global(.imageWrap) {
          position: relative;
          height: 250px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #eef2f7;
          overflow: hidden;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        :global(.hotBadge) {
          position: absolute;
          top: 20px;
          right: 8px;
          z-index: 2;
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          background: transparent;
          overflow: visible;
        }
        :global(.hotBadgeFlame) {
          display: block;
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          background: transparent;
          filter: drop-shadow(0 3px 6px rgba(216, 58, 58, 0.18));
        }
        :global(.imageWrap img) {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        :global(.productImage) {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        :global(.cardBody) {
          display: grid;
          gap: 8px;
          align-content: start;
          flex: 1;
        }
        :global(.metaRow) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          min-height: 24px;
        }
        :global(.metaRow.statusOnly) {
          justify-content: flex-end;
          min-height: 20px;
        }
        :global(.stock) {
          font-size: 14px;
          font-weight: 800;
          line-height: 1.2;
          text-decoration: none !important;
          white-space: nowrap;
        }
        :global(.stock.ok) {
          color: #16a34a;
        }
        :global(.stock.out) {
          color: #c2410c;
        }
        :global(.cat) {
          margin: 0;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #64748b;
          text-decoration: none !important;
          line-height: 1.2;
        }
        :global(.name) {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.3;
          color: #0f172a;
          text-decoration: none !important;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 34px;
        }
        :global(.productLink:hover .name),
        :global(.productLink:focus-visible .name) {
          color: #d97706;
        }
        :global(.priceRow) {
          display: flex;
          align-items: baseline;
          gap: 0;
          margin-top: 0;
          padding-top: 0;
          margin-bottom: 0;
        }
        :global(.price) {
          font-size: 24px;
          line-height: 1.05;
          color: #0f172a;
          text-decoration: none !important;
          font-weight: 800;
        }
        :global(.actions) {
          display: grid;
          gap: 10px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #edf2f7;
        }
        .loadMoreState {
          padding: 16px 20px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
          font-weight: 700;
        }
        .skeletonCard {
          gap: 10px;
        }
        .skeletonBox,
        .skeletonLine,
        .skeletonPrice,
        .skeletonButton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 37%, #f1f5f9 63%);
          background-size: 400% 100%;
          animation: shimmer 1.4s ease infinite;
          border-radius: 12px;
        }
        .skeletonLine {
          height: 16px;
        }
        .skeletonLine.short {
          width: 30%;
        }
        .skeletonLine.medium {
          width: 72%;
        }
        .skeletonPrice {
          width: 35%;
          height: 28px;
        }
        .skeletonButton {
          width: 100%;
          height: 44px;
        }
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @media (max-width: 1600px) {
          .grid {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }
        }
        @media (max-width: 1400px) {
          .grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        @media (max-width: 1200px) {
          .shell {
            grid-template-columns: 1fr;
          }
          .sidebar {
            position: static;
          }
          .grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 900px) {
          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }
          .toolbarControls {
            flex-direction: column;
            align-items: stretch;
          }
          .compact {
            width: 100%;
            min-width: 0;
          }
          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .buttonRow {
            grid-template-columns: 1fr;
          }
          .sideLink {
            min-height: 58px;
            padding: 0 14px;
            font-size: 16px;
          }
        }
      `}</style>
    </section>
  );
}
