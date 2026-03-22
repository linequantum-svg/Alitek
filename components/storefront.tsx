"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number;
  available: boolean;
  sold: number;
  rating: number;
  image: string;
  description: string;
  attributes: Array<{ name: string; value: string }>;
  images?: string[];
  slug?: string;
};

type ApiResponse = {
  products: Product[];
  categories: string[];
  total: number;
  page: number;
  totalPages: number;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value) + " ₴";
}

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sort, setSort] = useState("popular");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (selectedCategory) params.set("category", selectedCategory);
        if (onlyAvailable) params.set("available", "true");
        if (sort) params.set("sort", sort);
        params.set("limit", "24");

        const response = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Не вдалося завантажити товари");

        const data: ApiResponse = await response.json();
        setProducts(data.products || []);
        setCategories(data.categories || []);
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setError("Не вдалося підключитися до каталогу. Спочатку виконай синхронізацію з Prom.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [query, selectedCategory, onlyAvailable, sort]);

  const selectedCount = useMemo(() => products.length, [products]);

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: 16 }}>
      <section style={{ background: "linear-gradient(90deg,#0f172a,#b91c1c)", color: "white", padding: 24, borderRadius: 28, marginBottom: 16 }}>
        <div style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.8, marginBottom: 10 }}>Новий магазин електроніки</div>
        <h1 style={{ fontSize: 40, lineHeight: 1.1, margin: 0 }}>NovaMart</h1>
        <p style={{ maxWidth: 720, lineHeight: 1.6, opacity: 0.9 }}>
          Сучасний український магазин з автоматичним оновленням цін і наявності з Prom.
        </p>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 }}>
        <aside style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 24, padding: 16, height: "fit-content" }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Фільтри</div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук товарів"
            style={{ width: "100%", padding: 12, borderRadius: 14, border: "1px solid #cbd5e1", marginBottom: 12 }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: "100%", padding: 12, borderRadius: 14, border: "1px solid #cbd5e1", marginBottom: 12 }}
          >
            <option value="">Усі категорії</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ width: "100%", padding: 12, borderRadius: 14, border: "1px solid #cbd5e1", marginBottom: 12 }}
          >
            <option value="popular">Спочатку новіші</option>
            <option value="cheap">Спочатку дешеві</option>
            <option value="expensive">Спочатку дорожчі</option>
          </select>
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14 }}>
            <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
            Лише в наявності
          </label>
        </aside>

        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>Каталог</div>
              <div style={{ color: "#64748b" }}>Знайдено: {selectedCount}</div>
            </div>
          </div>

          {loading ? <div>Завантаження...</div> : null}
          {error ? <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div> : null}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
            {products.map((product) => (
              <article key={product.id} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 24, overflow: "hidden" }}>
                <Link href={product.slug ? `/product/${product.slug}` : "#"} style={{ color: "inherit", textDecoration: "none" }}>
                  <img src={product.image} alt={product.name} style={{ width: "100%", height: 220, objectFit: "cover" }} />
                </Link>
                <div style={{ padding: 14 }}>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{product.brand} • {product.sku}</div>
                  <Link href={product.slug ? `/product/${product.slug}` : "#"} style={{ color: "inherit", textDecoration: "none" }}>
                    <div style={{ minHeight: 44, fontWeight: 700, marginBottom: 8 }}>{product.name}</div>
                  </Link>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                    <div style={{ color: "#dc2626", fontWeight: 900, fontSize: 28 }}>{formatPrice(product.price)}</div>
                    <div style={{ color: "#94a3b8", textDecoration: "line-through" }}>{formatPrice(product.oldPrice)}</div>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 14, color: product.available ? "#059669" : "#94a3b8" }}>
                    {product.available ? "● Є в наявності" : "● Немає в наявності"}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                    <Link href={product.slug ? `/checkout?product=${product.slug}` : "#"} style={{ background: "#0f172a", color: "white", border: 0, borderRadius: 14, padding: "10px 12px", fontWeight: 700, textAlign: "center", textDecoration: "none" }}>
                      Купити
                    </Link>
                    <Link
                      href={product.slug ? `/product/${product.slug}` : "#"}
                      style={{ border: "1px solid #cbd5e1", borderRadius: 14, padding: "10px 12px", textAlign: "center", textDecoration: "none", color: "#0f172a", fontWeight: 700 }}
                    >
                      Детальніше
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
