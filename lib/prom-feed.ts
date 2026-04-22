import { unstable_cache } from "next/cache";

export type PromCategory = {
  id: string;
  name: string;
  parentExternalId: string | null;
};

export type PromProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  available: boolean;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  vendorCode?: string;
};

const FEED_URL = process.env.PROM_FEED_URL;

type PromData = {
  categories: PromCategory[];
  products: PromProduct[];
};

const PROM_CACHE_TTL_MS = 5 * 60 * 1000;
let memoryPromData: PromData | null = null;
let memoryPromDataExpiresAt = 0;
let pendingPromData: Promise<PromData> | null = null;

function decodeXml(value: string): string {
  return String(value || "")
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

function stripHtml(value: string): string {
  return decodeXml(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? match[1].trim() : "";
}

function getTags(block: string, tag: string): string[] {
  return Array.from(block.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi")))
    .map((match) => decodeXml(match[1]))
    .filter(Boolean);
}

function getAttr(block: string, tag: string, attr: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"[^>]*>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function slugify(input: string): string {
  return String(input || "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9а-яіїєґ]+/giu, "-")
    .replace(/^-+|-+$/g, "");
}

function parseAvailable(block: string): boolean {
  const availableAttr = getAttr(block, "offer", "available");
  if (availableAttr) return availableAttr.toLowerCase() === "true";
  return true;
}

function parsePrice(value: string): number {
  const normalized = String(value || "").replace(/\s+/g, "").replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

function parseCategories(xml: string): PromCategory[] {
  const categoryBlocks = xml.match(/<category\b[\s\S]*?<\/category>/gi) || [];

  return categoryBlocks
    .map((block) => {
      const idMatch = block.match(/id="([^"]+)"/i);
      const parentMatch = block.match(/parentId="([^"]+)"/i);
      const id = idMatch ? idMatch[1].trim() : "";
      const name = decodeXml(block.replace(/<category\b[^>]*>/i, "").replace(/<\/category>/i, ""));
      return {
        id,
        name,
        parentExternalId: parentMatch ? parentMatch[1].trim() : null,
      };
    })
    .filter((item) => item.id && item.name);
}

function parseOffers(xml: string, categoriesMap: Map<string, string>): PromProduct[] {
  const offerBlocks = xml.match(/<offer\b[\s\S]*?<\/offer>/gi) || [];

  return offerBlocks
    .map((block, index) => {
      const id = getAttr(block, "offer", "id") || String(index + 1);
      const name = decodeXml(getTag(block, "name")) || `Товар ${index + 1}`;
      const brand = decodeXml(getTag(block, "vendor")) || decodeXml(getTag(block, "brand")) || "Без бренду";
      const price = parsePrice(getTag(block, "price"));
      const oldPriceRaw = getTag(block, "oldprice") || getTag(block, "old_price");
      const oldPrice = oldPriceRaw ? parsePrice(oldPriceRaw) : undefined;
      const images = getTags(block, "picture");
      const image = images[0] || "https://placehold.co/600x600/f3f4f6/111827?text=No+Image";
      const categoryId = decodeXml(getTag(block, "categoryId")) || decodeXml(getTag(block, "category"));
      const description = stripHtml(getTag(block, "description"));
      const vendorCode = decodeXml(getTag(block, "vendorCode")) || decodeXml(getTag(block, "article")) || "";
      const available = parseAvailable(block);

      return {
        id,
        slug: slugify(`${name}-${id}`),
        name,
        brand,
        price,
        oldPrice,
        image,
        images,
        available,
        description,
        categoryId,
        categoryName: categoriesMap.get(categoryId) || "Інше",
        vendorCode,
      };
    })
    .filter((item) => item.price > 0 && item.name);
}

async function fetchPromData(): Promise<PromData> {
  if (!FEED_URL) {
    throw new Error("PROM_FEED_URL is not set");
  }

  const response = await fetch(FEED_URL, {
    cache: "no-store",
    headers: { "User-Agent": "AlitekFeedSync/1.0" },
  });

  if (!response.ok) {
    throw new Error(`Failed to load Prom feed: ${response.status}`);
  }

  const xml = await response.text();
  const categories = parseCategories(xml);
  const categoriesMap = new Map(categories.map((item) => [item.id, item.name]));
  const products = parseOffers(xml, categoriesMap);

  return { categories, products };
}

const getCachedPromData = unstable_cache(fetchPromData, ["alitek-prom-feed"], {
  revalidate: 300,
  tags: ["prom-feed"],
});

export async function getPromData(): Promise<PromData> {
  const now = Date.now();

  if (memoryPromData && memoryPromDataExpiresAt > now) {
    return memoryPromData;
  }

  if (pendingPromData) {
    return pendingPromData;
  }

  pendingPromData = getCachedPromData()
    .then((data) => {
      memoryPromData = data;
      memoryPromDataExpiresAt = Date.now() + PROM_CACHE_TTL_MS;
      pendingPromData = null;
      return data;
    })
    .catch((error) => {
      pendingPromData = null;
      throw error;
    });

  return pendingPromData;
}

export async function getPromProducts() {
  const data = await getPromData();
  return data.products;
}

export async function getPromCategories() {
  const data = await getPromData();
  return data.categories;
}

export async function getPromProductBySlug(slug: string): Promise<PromProduct | null> {
  const products = await getPromProducts();
  return products.find((item) => item.slug === slug) || null;
}
