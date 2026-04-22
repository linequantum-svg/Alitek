import { unstable_cache } from "next/cache";
import type { Prisma } from "@prisma/client";
import {
  normalizeCatalogCategory,
  sortCatalogCategories,
  getCatalogCategoryRank,
  type CatalogCategoryRecord,
} from "@/lib/catalog-taxonomy";
import { prisma } from "@/lib/prisma";
import { getPromCategories, getPromProducts } from "@/lib/prom-feed";

type ProductWithImages = Prisma.ProductGetPayload<{
  include: { images: { orderBy: { sortOrder: "asc" } } };
}>;

type CategoryRecord = {
  id: string;
  name: string;
  parentExternalId: string | null;
};

const DB_FALLBACK_TTL_MS = 5 * 60 * 1000;
const PRIMARY_SOURCE_TIMEOUT_MS = 2500;
let forcePromFallbackUntil = 0;

export type StorefrontProduct = {
  id: string;
  externalId: string;
  slug: string;
  name: string;
  brand: string;
  categoryId: string | null;
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

function parseAttributes(raw: string | null) {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is { name: string; value: string } => !!item?.name && !!item?.value)
      : [];
  } catch {
    return [];
  }
}

function mapProduct(product: ProductWithImages): StorefrontProduct {
  const categoryName =
    String(product.categoryName || "").trim() ||
    normalizeCatalogCategory(product.categoryName, product.name, product.brand, product.description);

  return {
    id: product.externalId,
    externalId: product.externalId,
    slug: product.slug,
    name: product.name,
    brand: product.brand || "Без бренду",
    categoryId: product.categoryId || null,
    categoryName: categoryName || "Без категорії",
    price: Number(product.price),
    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
    available: product.available,
    image: product.image || product.images[0]?.imageUrl || "/no-image.png",
    images: product.images.map((item) => item.imageUrl),
    description: product.description || "",
    params: parseAttributes(product.attributesJson),
    vendorCode: product.sku || null,
  };
}

function mapFallbackProduct(product: any): StorefrontProduct {
  const id = String(product?.id || product?.externalId || product?.slug || product?.name || crypto.randomUUID());
  const params = Array.isArray(product?.params)
    ? product.params
    : Array.isArray(product?.attributes)
      ? product.attributes
      : [];

  const categoryName =
    String(product?.categoryName || product?.category || "").trim() ||
    normalizeCatalogCategory(product?.categoryName, product?.category, product?.name, product?.brand, product?.description);

  return {
    id,
    externalId: String(product?.externalId || product?.id || id),
    slug: String(product?.slug || ""),
    name: String(product?.name || "Товар"),
    brand: String(product?.brand || "Без бренду"),
    categoryId: product?.categoryId ? String(product.categoryId) : null,
    categoryName: categoryName || "Без категорії",
    price: Number(product?.price || 0),
    oldPrice: product?.oldPrice ? Number(product.oldPrice) : null,
    available: Boolean(product?.available),
    image: String(product?.image || "/no-image.png"),
    images: Array.isArray(product?.images) ? product.images.map(String) : [String(product?.image || "/no-image.png")],
    description: String(product?.description || ""),
    params: params
      .map((item: any) => ({ name: String(item?.name || "Характеристика"), value: String(item?.value || "") }))
      .filter((item: { name: string; value: string }) => item.value),
    vendorCode: product?.vendorCode ? String(product.vendorCode) : product?.sku ? String(product.sku) : null,
  };
}

function normalizeText(value: string) {
  return String(value || "").toLowerCase().trim();
}

function sortCategorySourceByPromOrder(
  categories: Array<{ id: string; name: string; parentExternalId: string | null }>,
  promCategories: Array<{ id: string; name: string; parentExternalId: string | null }>,
) {
  if (!promCategories.length) return categories;

  const indexById = new Map(promCategories.map((item, index) => [String(item.id).trim(), index]));

  return [...categories].sort((a, b) => {
    const aIndex = indexById.get(String(a.id).trim());
    const bIndex = indexById.get(String(b.id).trim());

    if (typeof aIndex === "number" && typeof bIndex === "number") {
      return aIndex - bIndex;
    }

    if (typeof aIndex === "number") return -1;
    if (typeof bIndex === "number") return 1;

    return a.name.localeCompare(b.name, "uk");
  });
}

function buildStorefrontCategories(
  products: StorefrontProduct[],
  sourceCategories: Array<{ id: string; name: string; parentExternalId: string | null }>
): CategoryRecord[] {
  const usedIds = new Set(products.map((item) => String(item.categoryId || "").trim()).filter(Boolean));
  const usedNames = new Set(products.map((item) => normalizeText(item.categoryName)).filter(Boolean));
  const byId = new Map(sourceCategories.map((item) => [item.id, item]));
  const includedIds = new Set<string>();

  const includeWithParents = (id: string) => {
    let currentId: string | null = id;
    const visited = new Set<string>();

    while (currentId && byId.has(currentId) && !visited.has(currentId)) {
      visited.add(currentId);
      includedIds.add(currentId);
      currentId = byId.get(currentId)?.parentExternalId || null;
    }
  };

  for (const id of usedIds) includeWithParents(id);

  const categoriesFromSource = sourceCategories.filter(
    (item) => includedIds.has(item.id) || usedNames.has(normalizeText(item.name)),
  );

  const existingNames = new Set(categoriesFromSource.map((item) => normalizeText(item.name)));
  const unmatchedNames = sortCatalogCategories(
    products
      .map((item) => item.categoryName)
      .filter((name) => name && !existingNames.has(normalizeText(name))),
  );

  return [
    ...categoriesFromSource.map((item) => ({
      id: item.id,
      name: item.name,
      parentExternalId: item.parentExternalId,
    })),
    ...unmatchedNames.map((name) => ({
      id: slugifyCategory(name),
      name,
      parentExternalId: null,
    })),
  ];
}

function safeDecodeUriComponent(value: string) {
  try {
    return decodeURIComponent(String(value || ""));
  } catch {
    return String(value || "");
  }
}

function normalizeSlug(value: string) {
  return safeDecodeUriComponent(String(value || "")).toLowerCase().trim();
}

export function slugifyCategory(value: string) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0400-\u04FF-]+/g, "");
}

function sortProducts(items: StorefrontProduct[], sort = "") {
  const arr = [...items];
  const availabilityFirst = (a: StorefrontProduct, b: StorefrontProduct) => Number(b.available) - Number(a.available);
  const categoryFirst = (a: StorefrontProduct, b: StorefrontProduct) =>
    getCatalogCategoryRank(a.categoryName) - getCatalogCategoryRank(b.categoryName);
  switch (sort) {
    case "price_asc":
      return arr.sort((a, b) => availabilityFirst(a, b) || Number(a.price) - Number(b.price));
    case "price_desc":
      return arr.sort((a, b) => availabilityFirst(a, b) || Number(b.price) - Number(a.price));
    case "name_asc":
      return arr.sort((a, b) => availabilityFirst(a, b) || String(a.name).localeCompare(String(b.name), "uk"));
    case "name_desc":
      return arr.sort((a, b) => availabilityFirst(a, b) || String(b.name).localeCompare(String(a.name), "uk"));
    default:
      return arr.sort((a, b) => availabilityFirst(a, b) || categoryFirst(a, b) || String(a.name).localeCompare(String(b.name), "uk"));
  }
}

function shouldUsePromFallback(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "");
  return /Can't reach database server|PrismaClientInitializationError|PrismaClientKnownRequestError|ECONNREFUSED|Primary source timeout/i.test(message);
}

async function withPrimaryTimeout<T>(getPrimary: () => Promise<T>) {
  return Promise.race<T>([
    getPrimary(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Primary source timeout")), PRIMARY_SOURCE_TIMEOUT_MS),
    ),
  ]);
}

async function withPromFallback<T>(label: string, getPrimary: () => Promise<T>, getFallback: () => Promise<T>) {
  if (Date.now() < forcePromFallbackUntil) {
    return getFallback();
  }

  try {
    return await withPrimaryTimeout(getPrimary);
  } catch (error) {
    if (!shouldUsePromFallback(error)) throw error;
    forcePromFallbackUntil = Date.now() + DB_FALLBACK_TTL_MS;
    console.warn(`[storefront-data] ${label}: falling back to Prom feed`);
    return getFallback();
  }
}

const getCachedCategorySource = unstable_cache(
  async (): Promise<CatalogCategoryRecord[]> => {
    const categories = await prisma.category.findMany({
      orderBy: [{ createdAt: "asc" }, { name: "asc" }],
      select: {
        externalId: true,
        name: true,
        parentExternalId: true,
      },
    });

    const mappedCategories = categories.map((item) => ({
      id: item.externalId,
      name: item.name,
      parentExternalId: item.parentExternalId || null,
    }));

    const promCategories = await getPromCategories().catch(() => []);

    return sortCategorySourceByPromOrder(mappedCategories, promCategories);
  },
  ["storefront-category-source"],
  { revalidate: 300, tags: ["storefront-categories"] }
);

const getCachedStorefrontProducts = unstable_cache(
  async (): Promise<StorefrontProduct[]> => {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ available: "desc" }, { updatedAt: "desc" }],
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    return products.map(mapProduct);
  },
  ["storefront-products"],
  { revalidate: 300, tags: ["storefront-products"] }
);

const getCachedCategories = unstable_cache(
  async (): Promise<CategoryRecord[]> => {
    const [products, categories] = await Promise.all([getCachedStorefrontProducts(), getCachedCategorySource()]);
    return buildStorefrontCategories(products, categories);
  },
  ["storefront-categories"],
  { revalidate: 300, tags: ["storefront-categories"] }
);

const getCachedBrands = unstable_cache(
  async (): Promise<string[]> => {
    const products = await getCachedStorefrontProducts();
    return Array.from(new Set(products.map((item) => item.brand?.trim() || "").filter(Boolean))).sort((a, b) => a.localeCompare(b, "uk"));
  },
  ["storefront-brands"],
  { revalidate: 300, tags: ["storefront-brands"] }
);

const getCachedHomepageData = unstable_cache(
  async () => {
    const [products, brands, categories] = await Promise.all([
      getCachedStorefrontProducts(),
      getCachedBrands(),
      getCachedCategories(),
    ]);
    const mappedProducts = sortProducts(products);
    const popularProducts = mappedProducts.slice(0, 4);
    const deal =
      mappedProducts.find((item) => item.oldPrice && Number(item.oldPrice) > Number(item.price)) ||
      popularProducts[0] ||
      null;

    return {
      categories,
      popularProducts,
      showcaseProducts: mappedProducts,
      deal,
      brands: brands.slice(0, 10),
    };
  },
  ["storefront-homepage"],
  { revalidate: 300, tags: ["storefront-homepage"] }
);

const getCachedCatalogPageData = unstable_cache(
  async (
    query = "",
    categoryName = "",
    brand = "",
    availableOnly = false,
    sort = "",
    page = 1,
    pageSize = 20
  ) => {
    const safePage = Math.max(1, page || 1);
    const limit = Math.max(1, pageSize || 20);
    const q = String(query || "").trim().toLowerCase();
    const category = String(categoryName || "").trim();
    const brandName = String(brand || "").trim();

    const [products, brands, categories] = await Promise.all([
      getCachedStorefrontProducts(),
      getCachedBrands(),
      getCachedCategories(),
    ]);

    let filtered = products.filter((product) => {
      const haystack = `${product.name} ${product.brand} ${product.categoryName} ${product.vendorCode || ""}`.toLowerCase();
      if (q && !haystack.includes(q)) return false;
      if (category && normalizeText(product.categoryName) !== normalizeText(category)) return false;
      if (brandName && normalizeText(product.brand) !== normalizeText(brandName)) return false;
      if (availableOnly && !product.available) return false;
      return true;
    });

    filtered = sortProducts(filtered, sort);
    const total = filtered.length;

    return {
      products: filtered.slice((safePage - 1) * limit, safePage * limit),
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      categories,
      brands,
    };
  },
  ["storefront-catalog-page"],
  { revalidate: 300, tags: ["storefront-catalog"] }
);

const getCachedProductPageData = unstable_cache(
  async (slug: string) => {
    const decodedSlug = normalizeSlug(slug);

    const products = await getCachedStorefrontProducts();
    const product = products.find((item) => normalizeSlug(item.slug) === decodedSlug) || null;

    if (!product) return null;

    return {
      product,
      related: products
        .filter((item) => item.externalId !== product.externalId && normalizeText(item.categoryName) === normalizeText(product.categoryName))
        .slice(0, 4),
    };
  },
  ["storefront-product-page"],
  { revalidate: 300, tags: ["storefront-product"] }
);

const getCachedSitemapData = unstable_cache(
  async () => {
    const [products, categories] = await Promise.all([getCachedStorefrontProducts(), getCachedCategories()]);

    return {
      categories,
      productSlugs: products.map((item) => item.slug),
    };
  },
  ["storefront-sitemap"],
  { revalidate: 300, tags: ["storefront-sitemap"] }
);

async function getFallbackCategories(): Promise<CategoryRecord[]> {
  const [products, categories] = await Promise.all([getFallbackProducts(), getPromCategories()]);
  return buildStorefrontCategories(
    products,
    categories.map((item) => ({
      id: item.id,
      name: item.name,
      parentExternalId: item.parentExternalId || null,
    })),
  );
}

async function getFallbackProducts(): Promise<StorefrontProduct[]> {
  const products = await getPromProducts();
  return (products || []).map(mapFallbackProduct);
}

export async function getHomepageData() {
  return withPromFallback(
    "homepage",
    () => getCachedHomepageData(),
    async () => {
      const [categories, products] = await Promise.all([getFallbackCategories(), getFallbackProducts()]);
      const sortedProducts = sortProducts(products);
      const popularProducts = sortedProducts.slice(0, 4);
      const deal =
        sortedProducts.find((item) => item.oldPrice && Number(item.oldPrice) > Number(item.price)) ||
        popularProducts[0] ||
        null;
      const brands = Array.from(new Set(sortedProducts.map((item) => item.brand).filter(Boolean))).slice(0, 10);

      return {
        categories,
        popularProducts,
        showcaseProducts: sortedProducts.slice(0, 12),
        deal,
        brands,
      };
    }
  );
}

export async function getCatalogPageData({
  query,
  categoryName,
  brand,
  availableOnly,
  sort,
  page,
  pageSize,
}: {
  query?: string;
  categoryName?: string;
  brand?: string;
  availableOnly?: boolean;
  sort?: string;
  page?: number;
  pageSize?: number;
}) {
  return withPromFallback(
    "catalog",
    () =>
      getCachedCatalogPageData(
        String(query || ""),
        String(categoryName || ""),
        String(brand || ""),
        Boolean(availableOnly),
        String(sort || ""),
        Math.max(1, page || 1),
        Math.max(1, pageSize || 20)
      ),
    async () => {
      const q = String(query || "").trim();
      const category = String(categoryName || "").trim();
      const brandName = String(brand || "").trim();
      const safePage = Math.max(1, page || 1);
      const limit = Math.max(1, pageSize || 20);
      const [products, categories] = await Promise.all([getFallbackProducts(), getFallbackCategories()]);
      let filtered = products.filter((product) => {
        const haystack = `${product.name} ${product.brand} ${product.categoryName}`.toLowerCase();
        if (q && !haystack.includes(q.toLowerCase())) return false;
        if (category && normalizeText(product.categoryName) !== normalizeText(category)) return false;
        if (brandName && normalizeText(product.brand) !== normalizeText(brandName)) return false;
        if (availableOnly && !product.available) return false;
        return true;
      });

      filtered = sortProducts(filtered, sort);
      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));

      return {
        products: filtered.slice((safePage - 1) * limit, safePage * limit),
        total,
        totalPages,
        categories,
        brands: Array.from(new Set(products.map((item) => item.brand).filter(Boolean))),
      };
    }
  );
}

export async function getCategoryPageData({
  slug,
  query,
  availableOnly,
  sort,
  page,
  pageSize,
}: {
  slug: string;
  query?: string;
  availableOnly?: boolean;
  sort?: string;
  page?: number;
  pageSize?: number;
}) {
  const decodedSlug = decodeURIComponent(slug);
  const normalizedDecodedSlug = normalizeSlug(slug);
  const categories = await withPromFallback("categories", () => getCachedCategories(), () => getFallbackCategories());
  const matchedCategory =
    categories.find((item) => slugifyCategory(item.name) === normalizedDecodedSlug) ||
    categories.find((item) => normalizeText(item.name) === normalizeText(normalizedDecodedSlug)) ||
    null;

  const categoryName = matchedCategory?.name || safeDecodeUriComponent(slug);
  const data = await getCatalogPageData({
    query,
    categoryName,
    availableOnly,
    sort,
    page,
    pageSize,
  });

  return {
    ...data,
    matchedCategory,
    categoryName,
  };
}

export async function getStorefrontProductBySlug(slug: string) {
  return withPromFallback(
    "product",
    () => getCachedProductPageData(slug),
    async () => {
      const products = await getFallbackProducts();
      const normalizedSlug = normalizeSlug(slug);
      const product = products.find((item) => normalizeSlug(item.slug) === normalizedSlug) || null;
      if (!product) return null;

      return {
        product,
        related: products
          .filter((item) => String(item.id) !== String(product.id) && normalizeText(item.categoryName) === normalizeText(product.categoryName))
          .sort((a, b) => Number(Boolean(b.available)) - Number(Boolean(a.available)))
          .slice(0, 4),
      };
    }
  );
}

export async function getSitemapData() {
  return withPromFallback(
    "sitemap",
    () => getCachedSitemapData(),
    async () => {
      const [categories, products] = await Promise.all([getFallbackCategories(), getFallbackProducts()]);
      return {
        categories,
        productSlugs: products.map((item) => item.slug),
      };
    }
  );
}
