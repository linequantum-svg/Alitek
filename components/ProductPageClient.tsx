"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CartBadge from "@/components/CartBadge";
import FavoritesBadge from "@/components/FavoritesBadge";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import ShareButton from "@/components/ShareButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductInfoCards from "@/components/ProductInfoCards";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import WhyBuyBlock from "@/components/WhyBuyBlock";
import ProductFaqMini from "@/components/ProductFaqMini";
import ProductSupportCard from "@/components/ProductSupportCard";
import ProductBrandBlock from "@/components/ProductBrandBlock";
import ProductClientExtras from "@/components/ProductClientExtras";
import { slugifyCategory } from "@/lib/storefront-data";
import { getProductCache, setProductCache } from "@/lib/storefront-client-cache";
import { formatPrice } from "@/lib/utils";
import { getShortCharacteristics, getWhyBuyItems } from "@/lib/product-helpers";

type ProductDto = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categoryName: string;
  price: number;
  oldPrice: number | null;
  available: boolean;
  image: string;
  images: string[];
  description: string;
  params: Array<{ name: string; value: string }>;
  vendorCode: string | null;
};

type ProductResponse =
  | { ok: true; product: ProductDto; related: ProductDto[] }
  | { ok: false; error: string };

function normalizeCategory(value: string) {
  return String(value || "").toLowerCase().trim();
}

function tg(product: { name: string; price: number }) {
  const text = encodeURIComponent(
    `Добрий день! Хочу замовити товар: ${product.name}. Ціна: ${formatPrice(Number(product.price))}.`
  );
  return `https://t.me/share/url?text=${text}`;
}

function ProductHeroSkeleton() {
  return (
    <div className="container">
      <div className="topBar">
        <div className="sk sk-pill" style={{ width: 220, height: 20, borderRadius: 999 }} />
        <div className="badges">
          <div className="sk" style={{ width: 132, height: 52, borderRadius: 16 }} />
          <div className="sk" style={{ width: 132, height: 52, borderRadius: 16 }} />
        </div>
      </div>

      <section className="heroGrid">
        <div className="galleryCard">
          <div className="sk imageWrap" />
        </div>
        <div className="infoCard">
          <div className="sk" style={{ width: 90, height: 34, borderRadius: 999, marginBottom: 16 }} />
          <div className="sk" style={{ width: "85%", height: 44, borderRadius: 18, marginBottom: 10 }} />
          <div className="sk" style={{ width: "72%", height: 44, borderRadius: 18, marginBottom: 20 }} />
          <div className="sk" style={{ width: "55%", height: 18, borderRadius: 12, marginBottom: 12 }} />
          <div className="sk" style={{ width: "74%", height: 18, borderRadius: 12, marginBottom: 10 }} />
          <div className="sk" style={{ width: "62%", height: 18, borderRadius: 12, marginBottom: 20 }} />
          <div className="sk" style={{ width: "100%", height: 150, borderRadius: 22, marginBottom: 18 }} />
          <div className="sk" style={{ width: "100%", height: 56, borderRadius: 16, marginBottom: 12 }} />
          <div className="sk" style={{ width: "100%", height: 56, borderRadius: 16 }} />
        </div>
      </section>
    </div>
  );
}

export default function ProductPageClient({
  slug,
}: {
  slug: string;
}) {
  const [data, setData] = useState<{ product: ProductDto; related: ProductDto[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();
    const cached = getProductCache<{ ok: true; product: ProductDto; related: ProductDto[] }>(slug);
    const cachedImages = cached?.product
      ? Array.from(
          new Set(
            [cached.product.image, ...(cached.product.images || [])]
              .map((item) => String(item || "").trim())
              .filter(Boolean)
          )
        )
      : [];

    if (cached?.product && cachedImages.length > 1) {
      setData({ product: cached.product, related: cached.related || [] });
      setLoading(false);
      setError(null);
      return () => controller.abort();
    }

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/products/${encodeURIComponent(slug)}`, {
          signal: controller.signal,
        });

        const result = (await response.json()) as ProductResponse;

        if (!response.ok || !result.ok) {
          throw new Error(result.ok ? "Failed to load product" : result.error || "Failed to load product");
        }

        setProductCache(slug, result);
        setData({ product: result.product, related: result.related || [] });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Не вдалося завантажити товар.");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [slug]);

  const product = data?.product || null;
  const galleryImages = useMemo(() => {
    if (!product) return [];
    const unique = [product.image, ...(product.images || [])]
      .map((item) => String(item || "").trim())
      .filter(Boolean);
    return Array.from(new Set(unique));
  }, [product]);

  useEffect(() => {
    if (!galleryImages.length) {
      setActiveImage("");
      return;
    }

    setActiveImage((prev) => (prev && galleryImages.includes(prev) ? prev : galleryImages[0]));
  }, [galleryImages]);

  const related = useMemo(() => {
    if (!product) return [];
    return (data?.related || [])
      .filter(
        (item) =>
          String(item.id) !== String(product.id) &&
          normalizeCategory(item.categoryName) === normalizeCategory(product.categoryName || "Без категорії")
      )
      .slice(0, 4);
  }, [data, product]);

  if (loading && !product) {
    return (
      <main className="page">
        <ProductHeroSkeleton />
        <style>{styles}</style>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="page">
        <div className="container">
          <div className="descriptionCard" style={{ marginTop: 24 }}>
            <div className="descriptionTitle">Не вдалося завантажити товар</div>
            <div className="descriptionText">{error || "Спробуй оновити сторінку ще раз."}</div>
          </div>
        </div>
        <style>{styles}</style>
      </main>
    );
  }

  const categoryName = product.categoryName || "Без категорії";
  const description = product.description || "Опис товару поки що відсутній.";
  const chars = getShortCharacteristics(product, 8);
  const whyBuy = getWhyBuyItems(product);

  return (
    <>
      <main className="page">
        <div className="container">
          <div className="topBar">
            <Breadcrumbs
              items={[
                { href: "/", label: "Головна" },
                { href: "/catalog", label: "Каталог" },
                { href: `/catalog/${slugifyCategory(categoryName)}`, label: categoryName },
                { label: product.name },
              ]}
            />
            <div className="badges">
              <FavoritesBadge />
              <CartBadge />
            </div>
          </div>

          <section className="heroGrid">
            <div className="galleryCard">
              <div className="imageWrap">
                <Image
                  src={activeImage || product.image || "/no-image.png"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 960px) 100vw, 55vw"
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              </div>
              {galleryImages.length > 1 ? (
                <div className="thumbGrid">
                  {galleryImages.map((image, index) => {
                    const selected = image === (activeImage || galleryImages[0]);
                    return (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        className={`thumbButton ${selected ? "thumbButtonActive" : ""}`}
                        onClick={() => setActiveImage(image)}
                        aria-label={`Фото ${index + 1}`}
                      >
                        <span className="thumbInner">
                          <Image
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            fill
                            sizes="120px"
                            style={{ objectFit: "contain" }}
                            unoptimized
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
              <div className="galleryNote">
                Актуальні фото з картки товару. Перед відправкою можна уточнити комплектацію.
              </div>
              <ProductInfoCards />
            </div>

            <div className="detailsColumn">
              <div className="infoCard">
                <div className="pill">{categoryName}</div>
                <h1>{product.name}</h1>
                {product.brand ? <div className="brandLine">{product.brand}</div> : null}

                <div className="metaList">
                  {product.brand ? (
                    <div>
                      <strong>Бренд:</strong> {product.brand}
                    </div>
                  ) : null}
                  {product.vendorCode ? (
                    <div>
                      <strong>Артикул:</strong> {product.vendorCode}
                    </div>
                  ) : null}
                  <div>
                    <strong>Наявність:</strong>{" "}
                    {product.available ? "Готово до замовлення" : "Тимчасово немає в наявності"}
                  </div>
                </div>

                <div className="priceCard">
                  <div>
                    <div className="priceLabel">Ціна зараз</div>
                    <div className="priceMain">{formatPrice(Number(product.price))}</div>
                    {product.oldPrice ? (
                      <div className="priceOld">{formatPrice(Number(product.oldPrice))}</div>
                    ) : null}
                  </div>
                  <div
                    className={`availabilityPill ${product.available ? "availabilityOk" : "availabilityMuted"}`}
                  >
                    {product.available ? "Можна оформити зараз" : "Уточнюється наявність"}
                  </div>
                </div>

                <div className="microCopy">
                  Швидке оформлення, зручний контакт через Telegram і вся ключова інформація про товар на одній сторінці.
                </div>

                <div className="benefitsRow">
                  <div className="benefit">Швидка перевірка замовлення</div>
                  <div className="benefit">Зручний зв&apos;язок у Telegram</div>
                  <div className="benefit">Зрозуміла сторінка без зайвого</div>
                </div>

                <div className="actionsRow">
                  <a href={tg(product)} target="_blank" rel="noreferrer" className="telegramBtn">
                    Замовити в Telegram
                  </a>
                  <AddToCartButton product={product} />
                  <FavoriteButton product={product} />
                </div>

                <div className="shareRow">
                  <ShareButton title={product.name} />
                </div>
              </div>

            </div>
          </section>

          <section className="wideSection">
            <div className="descriptionCard">
              <div className="descriptionTitle">Коротко про товар</div>
              <div className="descriptionText">{description}</div>
            </div>
          </section>

          <ProductCharacteristics items={chars} />
          <WhyBuyBlock items={whyBuy} />
          <ProductBrandBlock brand={product.brand} />
          <ProductSupportCard brand={product.brand} />
          <ProductFaqMini />
          <ProductClientExtras
            currentId={String(product.id)}
            product={product}
            productName={product.name}
            priceLabel={formatPrice(Number(product.price))}
          />

          {related.length ? (
            <section className="relatedSection">
              <div className="sectionHeader">
                <h2>Схожі товари</h2>
                <Link href="/catalog">Переглянути ще</Link>
              </div>

              <div className="relatedGrid">
                {related.map((item) => (
                  <div key={item.id} className="relatedCard">
                    <Link href={`/product/${item.slug}`} className="relatedLink">
                      <div className="relatedImageWrap">
                        <Image
                          src={item.image || "/no-image.png"}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          style={{ objectFit: "contain" }}
                          unoptimized
                        />
                      </div>
                        {item.brand ? (
                          <div className="relatedMetaRow">
                            <div className="relatedBrand">{item.brand}</div>
                          </div>
                        ) : null}
                      <div className="relatedName">{item.name}</div>
                      <div className="relatedPrice">{formatPrice(Number(item.price))}</div>
                    </Link>

                    <div className="relatedActions">
                      <AddToCartButton product={item} fullWidth />
                      <FavoriteButton product={item} fullWidth />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <style>{styles}</style>
    </>
  );
}

const styles = `
  .page { background:linear-gradient(180deg,#f8f8f7 0%,#eef1f4 100%); min-height:100vh; color:#0f172a; font-family:var(--font-sans),ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; padding-bottom:96px; }
  .container { max-width:1360px; margin:0 auto; padding:24px 18px 40px; }
  .topBar { margin-bottom:18px; display:flex; justify-content:space-between; gap:18px; flex-wrap:wrap; }
  .badges { display:flex; gap:12px; flex-wrap:wrap; width:100%; max-width:fit-content; }
  .heroGrid { display:grid; grid-template-columns:minmax(0,1.1fr) minmax(340px,.9fr); gap:20px; align-items:start; }
  .galleryCard, .infoCard, .descriptionCard, .relatedCard { background:#fff; border:1px solid rgba(219,225,234,.95); box-shadow:0 18px 36px rgba(15,23,42,.05); }
  .galleryCard, .infoCard, .descriptionCard { border-radius:28px; }
  .galleryCard { padding:24px; }
  .imageWrap { position:relative; height:560px; border-radius:24px; background:linear-gradient(180deg,#fbfbfb 0%,#f1f5f9 100%); overflow:hidden; padding:12px; }
  .thumbGrid { margin-top:14px; display:grid; grid-template-columns:repeat(auto-fit,minmax(82px,1fr)); gap:10px; }
  .thumbButton { border:1px solid #dbe1ea; background:#fff; border-radius:16px; padding:6px; cursor:pointer; transition:border-color .16s ease, box-shadow .16s ease, transform .16s ease; }
  .thumbButton:hover { border-color:#c96a2b; transform:translateY(-1px); }
  .thumbButtonActive { border-color:#c96a2b; box-shadow:0 8px 18px rgba(201,106,43,.14); }
  .thumbInner { position:relative; display:block; height:78px; border-radius:12px; overflow:hidden; background:linear-gradient(180deg,#fbfbfb 0%,#f1f5f9 100%); }
  .galleryNote { margin:14px 0 0; color:#64748b; font-size:14px; line-height:1.7; }
  .detailsColumn { display:grid; gap:16px; }
  .infoCard, .descriptionCard { padding:26px; }
  .pill { display:inline-block; background:linear-gradient(135deg,#fff4e8 0%,#f4e5d7 100%); color:#8b5e3c; font-weight:800; font-size:13px; padding:8px 12px; border-radius:999px; margin-bottom:16px; }
  .infoCard h1 { margin:0; font-size:38px; line-height:1.08; font-weight:800; letter-spacing:-.03em; }
  .brandLine { margin-top:10px; color:#64748b; font-size:14px; font-weight:700; }
  .metaList { margin-top:16px; color:#64748b; font-size:15px; line-height:1.7; display:grid; gap:4px; }
  .metaList strong { color:#0f172a; }
  .priceCard { margin-top:22px; border:1px solid #e7ecf3; border-radius:22px; padding:18px; background:linear-gradient(180deg,#ffffff 0%,#fbfcfd 100%); display:flex; justify-content:space-between; gap:16px; align-items:flex-start; flex-wrap:wrap; }
  .priceLabel { color:#8b5e3c; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; }
  .priceMain { margin-top:6px; font-size:42px; font-weight:800; }
  .priceOld { margin-top:8px; font-size:20px; color:#94a3b8; text-decoration:line-through; font-weight:700; }
  .availabilityPill { display:inline-flex; align-items:center; min-height:34px; padding:0 14px; border-radius:999px; font-weight:700; font-size:13px; }
  .availabilityOk { background:#ecfdf3; color:#15803d; }
  .availabilityMuted { background:#fff7ed; color:#b45309; }
  .microCopy { margin-top:14px; color:#475569; line-height:1.7; }
  .benefitsRow { display:flex; gap:10px; flex-wrap:wrap; margin-top:16px; }
  .benefit { display:inline-flex; align-items:center; min-height:34px; padding:0 12px; border-radius:999px; background:#f8fafc; border:1px solid #e7ecf3; color:#475569; font-size:13px; font-weight:700; }
  .actionsRow { display:flex; gap:12px; margin-top:24px; flex-wrap:wrap; }
  .telegramBtn { min-height:52px; padding:0 24px; border-radius:16px; background:linear-gradient(135deg,#c96a2b 0%,#de8a52 100%); color:#fff; font-weight:800; font-size:16px; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; box-shadow:0 14px 24px rgba(201,106,43,.22); }
  .shareRow { margin-top:12px; }
  .wideSection { margin-top:20px; }
  .descriptionCard { background:linear-gradient(180deg,#ffffff 0%,#fbfcfd 100%); }
  .descriptionTitle { font-size:24px; font-weight:800; margin-bottom:14px; }
  .descriptionText { color:#475569; font-size:16px; line-height:1.8; white-space:pre-wrap; }
  .relatedSection { margin-top:30px; }
  .sectionHeader { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; flex-wrap:wrap; }
  .sectionHeader h2 { margin:0; font-size:28px; font-weight:800; }
  .sectionHeader a { color:#9a3412; text-decoration:none; font-weight:800; }
  .relatedGrid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; }
  .relatedCard { border-radius:24px; padding:14px; transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
  .relatedCard:hover { transform:translateY(-3px); border-color:#d8c2af; box-shadow:0 22px 36px rgba(15,23,42,.08); }
  .relatedLink { text-decoration:none; color:#0f172a; display:block; }
  .relatedImageWrap { position:relative; height:220px; border-radius:20px; background:linear-gradient(180deg,#fbfbfb 0%,#f1f5f9 100%); overflow:hidden; margin-bottom:12px; }
  .relatedMetaRow { display:flex; justify-content:space-between; gap:10px; margin-bottom:10px; }
  .relatedBrand { display:inline-flex; align-items:center; min-height:28px; padding:0 10px; border-radius:999px; background:#f8fafc; border:1px solid #e7ecf3; font-size:12px; color:#64748b; font-weight:700; }
  .relatedName { font-size:15px; line-height:1.45; min-height:66px; font-weight:700; }
  .relatedPrice { margin-top:10px; font-weight:800; font-size:28px; }
  .relatedActions { margin-top:12px; display:grid; gap:10px; }
  .sk { background:linear-gradient(90deg,#eef2f7 25%,#dde5ee 37%,#eef2f7 63%); background-size:400% 100%; animation:alitek-shimmer 1.3s ease infinite; }
  @keyframes alitek-shimmer { 0% { background-position:100% 0; } 100% { background-position:0 0; } }
  @media (max-width:1120px) { .heroGrid { grid-template-columns:1fr; } .relatedGrid { grid-template-columns:repeat(2,minmax(0,1fr)); } .imageWrap { height:460px; } }
  @media (max-width:720px) { .container { padding:18px 12px 32px; } .badges { max-width:100%; } .galleryCard, .infoCard, .descriptionCard { border-radius:22px; padding:18px; } .imageWrap { height:300px; border-radius:18px; } .thumbGrid { grid-template-columns:repeat(4,minmax(0,1fr)); } .thumbInner { height:64px; } .infoCard h1 { font-size:28px; line-height:1.1; } .priceMain { font-size:34px; } .actionsRow { display:grid; grid-template-columns:1fr; } .telegramBtn { width:100%; } .relatedGrid { grid-template-columns:1fr; } .relatedImageWrap { height:200px; } .sectionHeader h2, .descriptionTitle { font-size:22px; } }
`;



