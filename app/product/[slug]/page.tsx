import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value) + " ₴";
}

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Товар не знайдено | NovaMart",
    };
  }

  const title = `${product.name} — купити в NovaMart`;
  const description = (product.description || `${product.name}. Актуальна ціна, наявність та швидке замовлення в NovaMart.`)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const images = [product.image, ...product.images.map((img) => img.imageUrl)].filter(Boolean) as string[];
  const uniqueImages = Array.from(new Set(images));
  const attributes: Array<{ name: string; value: string }> = product.attributesJson ? JSON.parse(product.attributesJson) : [];

  const related = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      externalId: { not: product.externalId },
    },
    take: 4,
    orderBy: { updatedAt: "desc" },
  });

  const descriptionText = (product.description || "Опис товару буде підтягнуто з Prom.").replace(/<[^>]*>/g, " ");

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: 16 }}>
      <div style={{ marginBottom: 16, fontSize: 14, color: "#64748b" }}>
        <Link href="/" style={{ color: "#0f172a", textDecoration: "none", fontWeight: 600 }}>Головна</Link>
        <span> / </span>
        <span>{product.category?.name || product.categoryName || "Товар"}</span>
        <span> / </span>
        <span>{product.name}</span>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 16, background: "white", border: "1px solid #e2e8f0", borderRadius: 28, padding: 20 }}>
        <div>
          <div style={{ overflow: "hidden", borderRadius: 24, background: "#f8fafc", marginBottom: 12 }}>
            <img src={uniqueImages[0] || "https://placehold.co/1000x1000?text=No+Image"} alt={product.name} style={{ width: "100%", height: 520, objectFit: "cover" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10 }}>
            {uniqueImages.slice(0, 4).map((img, index) => (
              <div key={`${img}-${index}`} style={{ overflow: "hidden", borderRadius: 18, border: "1px solid #e2e8f0", background: "#fff" }}>
                <img src={img} alt={`${product.name} ${index + 1}`} style={{ width: "100%", height: 110, objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", color: "#64748b", fontSize: 13, marginBottom: 10 }}>
            <span style={{ background: "#f1f5f9", padding: "6px 10px", borderRadius: 999 }}>{product.category?.name || product.categoryName || "Без категорії"}</span>
            <span>{product.brand || "Без бренду"}</span>
            <span>•</span>
            <span>{product.sku || product.externalId}</span>
          </div>

          <h1 style={{ fontSize: 38, lineHeight: 1.1, margin: "0 0 10px", color: "#0f172a" }}>{product.name}</h1>

          <div style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>Актуальна сторінка товару з SEO URL та даними з Prom</div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            <div style={{ color: "#dc2626", fontWeight: 900, fontSize: 42 }}>{formatPrice(Number(product.price))}</div>
            <div style={{ color: "#94a3b8", textDecoration: "line-through", fontSize: 20 }}>{formatPrice(Number(product.oldPrice || product.price))}</div>
            {Number(product.oldPrice || product.price) > Number(product.price) ? (
              <div style={{ background: "#fef2f2", color: "#dc2626", borderRadius: 999, padding: "8px 12px", fontWeight: 700, fontSize: 14 }}>
                Економія {formatPrice(Number(product.oldPrice) - Number(product.price))}
              </div>
            ) : null}
          </div>

          <div style={{ marginBottom: 20, fontSize: 15, fontWeight: 700, color: product.available ? "#059669" : "#94a3b8" }}>
            {product.available ? "● Є в наявності та готово до відправлення" : "● Тимчасово немає в наявності"}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
            <Link href={`/checkout?product=${product.slug}`} style={{ background: "#0f172a", color: "white", border: 0, borderRadius: 16, padding: "14px 16px", fontWeight: 800, fontSize: 15, textAlign: "center", textDecoration: "none" }}>Купити зараз</Link>
            <Link href={`/checkout?product=${product.slug}`} style={{ background: "white", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: 16, padding: "14px 16px", fontWeight: 800, fontSize: 15, textAlign: "center", textDecoration: "none" }}>Швидке замовлення</Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: "#f8fafc", borderRadius: 18, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase" }}>Артикул</div>
              <div style={{ marginTop: 4, fontWeight: 700 }}>{product.sku || product.externalId}</div>
            </div>
            <div style={{ background: "#f8fafc", borderRadius: 18, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase" }}>Бренд</div>
              <div style={{ marginTop: 4, fontWeight: 700 }}>{product.brand || "Без бренду"}</div>
            </div>
            <div style={{ background: "#f8fafc", borderRadius: 18, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase" }}>Категорія</div>
              <div style={{ marginTop: 4, fontWeight: 700 }}>{product.category?.name || product.categoryName || "Без категорії"}</div>
            </div>
            <div style={{ background: "#f8fafc", borderRadius: 18, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase" }}>Оновлено</div>
              <div style={{ marginTop: 4, fontWeight: 700 }}>{new Date(product.updatedAt).toLocaleString("uk-UA")}</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, marginTop: 16 }}>
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 28, padding: 20 }}>
          <h2 style={{ margin: 0, fontSize: 26 }}>Опис товару</h2>
          <p style={{ lineHeight: 1.8, color: "#334155", marginTop: 14 }}>{descriptionText}</p>

          {attributes.length ? (
            <>
              <h3 style={{ marginTop: 24, marginBottom: 12, fontSize: 22 }}>Характеристики</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {attributes.map((attribute, index) => (
                  <div key={`${attribute.name}-${index}`} style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 12, padding: 12, background: "#f8fafc", borderRadius: 16 }}>
                    <div style={{ color: "#64748b" }}>{attribute.name}</div>
                    <div style={{ fontWeight: 600 }}>{attribute.value}</div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <aside style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 28, padding: 20, height: "fit-content" }}>
          <h3 style={{ marginTop: 0, fontSize: 22 }}>Синхронізація з Prom</h3>
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ background: "#f8fafc", borderRadius: 16, padding: 12 }}>SEO URL формується зі slug товару.</div>
            <div style={{ background: "#f8fafc", borderRadius: 16, padding: 12 }}>Ціна, наявність і фото оновлюються з XML-фіда.</div>
            <div style={{ background: "#f8fafc", borderRadius: 16, padding: 12 }}>Сторінка готова до індексації в Google.</div>
          </div>
        </aside>
      </section>

      {related.length ? (
        <section style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 28, marginBottom: 12 }}>Схожі товари</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
            {related.map((item) => (
              <Link key={item.id} href={`/product/${item.slug}`} style={{ textDecoration: "none", color: "inherit", background: "white", border: "1px solid #e2e8f0", borderRadius: 24, overflow: "hidden" }}>
                <img src={item.image || "https://placehold.co/800x800?text=No+Image"} alt={item.name} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                <div style={{ padding: 14 }}>
                  <div style={{ minHeight: 40, fontWeight: 700 }}>{item.name}</div>
                  <div style={{ color: "#dc2626", fontWeight: 900, fontSize: 24, marginTop: 8 }}>{formatPrice(Number(item.price))}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
