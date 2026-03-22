import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const available = searchParams.get("available") === "true";
    const sort = searchParams.get("sort")?.trim() || "popular";
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || 24), 1), 100);
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      ...(available ? { available: true } : {}),
      ...(category ? { categoryName: category } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" as const } },
              { brand: { contains: query, mode: "insensitive" as const } },
              { sku: { contains: query, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const orderBy =
      sort === "cheap"
        ? { price: "asc" as const }
        : sort === "expensive"
          ? { price: "desc" as const }
          : { updatedAt: "desc" as const };

    const [products, total, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { images: { orderBy: { sortOrder: "asc" } } },
      }),
      prisma.product.count({ where }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);

    return NextResponse.json({
      ok: true,
      total,
      page,
      limit,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      categories: categories.map((item) => item.name),
      updatedAt: new Date().toISOString(),
      products: products.map((product) => ({
        id: product.externalId,
        sku: product.sku || product.externalId,
        name: product.name,
        brand: product.brand || "Без бренду",
        category: product.categoryName || "Без категорії",
        price: Number(product.price),
        oldPrice: Number(product.oldPrice || product.price),
        available: product.available,
        sold: 0,
        rating: 4.7,
        image: product.image || product.images[0]?.imageUrl || "https://placehold.co/800x800?text=No+Image",
        description: product.description || "",
        attributes: product.attributesJson ? JSON.parse(product.attributesJson) : [],
        images: product.images.map((img) => img.imageUrl),
        slug: product.slug,
        updatedAt: product.updatedAt,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        products: [],
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
