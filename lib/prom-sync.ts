import { Prisma } from "@prisma/client";
import { XMLParser } from "fast-xml-parser";
import { prisma } from "@/lib/prisma";

type RawPicture = string | string[] | undefined;
type RawParam =
  | { "@_name"?: string; "#text"?: string | number | boolean }
  | Array<{ "@_name"?: string; "#text"?: string | number | boolean }>;

type RawCategory = {
  "@_id": string | number;
  "@_parentId"?: string | number;
  "#text"?: string | number;
};

type RawOffer = {
  "@_id"?: string | number;
  "@_available"?: boolean | string;
  available?: boolean | string;
  name?: string | number;
  vendor?: string | number;
  vendorCode?: string | number;
  price?: number | string;
  oldprice?: number | string;
  description?: string | number;
  categoryId?: string | number;
  picture?: RawPicture;
  param?: RawParam;
};

type ParsedFeed = {
  yml_catalog?: {
    shop?: {
      categories?: { category?: RawCategory[] | RawCategory };
      offers?: { offer?: RawOffer[] | RawOffer };
    };
  };
};

function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function toText(value: unknown, fallback = ""): string {
  return String(value ?? fallback).trim();
}

function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return ["true", "1", "yes", "available"].includes(v);
  }
  return false;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яіїєґ]+/giu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function getPictures(picture: RawPicture): string[] {
  return toArray(picture).filter(Boolean) as string[];
}

function getAttributes(param: RawParam): Array<{ name: string; value: string }> {
  return toArray(param)
    .map((item) => ({
      name: toText(item?.["@_name"], "Характеристика") || "Характеристика",
      value: toText(item?.["#text"]),
    }))
    .filter((item) => item.value);
}

async function fetchFeed(): Promise<ParsedFeed> {
  const feedUrl = process.env.PROM_XML_FEED_URL || "";
  if (!feedUrl) throw new Error("PROM_XML_FEED_URL is not configured");

  const response = await fetch(feedUrl, {
    method: "GET",
    headers: { Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
  }

  const xml = await response.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseTagValue: true,
    trimValues: true,
  });

  return parser.parse(xml) as ParsedFeed;
}

async function syncCategories(feed: ParsedFeed) {
  const categories = toArray(feed.yml_catalog?.shop?.categories?.category);

  for (const category of categories) {
    const externalId = toText(category?.["@_id"]);
    if (!externalId) continue;

    const name = toText(category?.["#text"], "Без категорії") || "Без категорії";

    await prisma.category.upsert({
      where: { externalId },
      update: {
        name,
        parentExternalId: toText(category?.["@_parentId"]) || null,
      },
      create: {
        externalId,
        name,
        parentExternalId: toText(category?.["@_parentId"]) || null,
      },
    });
  }

  return categories.length;
}

async function syncProducts(feed: ParsedFeed) {
  const offers = toArray(feed.yml_catalog?.shop?.offers?.offer);
  const syncedExternalIds = new Set<string>();
  let syncedCount = 0;

  for (const offer of offers) {
    const externalId = toText(offer?.["@_id"]);
    const name = toText(offer?.name);
    if (!externalId || !name) continue;

    const price = toNumber(offer.price, 0);
    const oldPriceRaw = toNumber(offer.oldprice, 0);
    const oldPrice = oldPriceRaw > price ? oldPriceRaw : price;
    const categoryId = toText(offer?.categoryId) || null;
    const category = categoryId
      ? await prisma.category.findUnique({
          where: { externalId: categoryId },
          select: { name: true },
        })
      : null;
    const brand = toText(offer?.vendor) || null;
    const sku = toText(offer?.vendorCode, externalId) || externalId;
    const description = toText(offer?.description) || null;
    const available = toBoolean(offer?.available ?? offer?.["@_available"]);
    const pictures = getPictures(offer?.picture);
    const attributes = getAttributes(offer?.param);
    const baseSlug = slugify(name);
    const slug = baseSlug ? `${baseSlug}-${externalId}` : `product-${externalId}`;

    await prisma.product.upsert({
      where: { externalId },
      update: {
        sku,
        name,
        slug,
        brand,
        categoryId,
        categoryName: category?.name || "Без категорії",
        price: new Prisma.Decimal(price),
        oldPrice: new Prisma.Decimal(oldPrice),
        available,
        image: pictures[0] || null,
        description,
        attributesJson: JSON.stringify(attributes),
        isActive: true,
        source: "prom",
      },
      create: {
        externalId,
        sku,
        name,
        slug,
        brand,
        categoryId,
        categoryName: category?.name || "Без категорії",
        price: new Prisma.Decimal(price),
        oldPrice: new Prisma.Decimal(oldPrice),
        available,
        image: pictures[0] || null,
        description,
        attributesJson: JSON.stringify(attributes),
        isActive: true,
        source: "prom",
      },
    });

    const product = await prisma.product.findUnique({
      where: { externalId },
      select: { id: true },
    });

    if (product) {
      await prisma.productImage.deleteMany({ where: { productId: product.id } });
      if (pictures.length) {
        await prisma.productImage.createMany({
          data: pictures.map((imageUrl, index) => ({
            productId: product.id,
            imageUrl,
            sortOrder: index,
          })),
        });
      }
    }

    syncedExternalIds.add(externalId);
    syncedCount += 1;
  }

  await prisma.product.updateMany({
    where: {
      source: "prom",
      externalId: { notIn: Array.from(syncedExternalIds) },
    },
    data: { isActive: false, available: false },
  });

  await prisma.product.updateMany({
    where: { source: "prom", categoryName: null },
    data: { categoryName: "Без категорії" },
  });

  return { syncedCount, activeIds: syncedExternalIds.size };
}

export async function runPromSync() {
  const startedAt = new Date();
  const feed = await fetchFeed();
  const categoriesSynced = await syncCategories(feed);
  const { syncedCount, activeIds } = await syncProducts(feed);

  return {
    ok: true,
    startedAt: startedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    categoriesSynced,
    productsSynced: syncedCount,
    activeIds,
  };
}
