import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;

    const product = await prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      product: {
        id: product.externalId,
        sku: product.sku || product.externalId,
        name: product.name,
        brand: product.brand || "Без бренду",
        category: product.category?.name || product.categoryName || "Без категорії",
        price: Number(product.price),
        oldPrice: Number(product.oldPrice || product.price),
        available: product.available,
        image: product.image || product.images[0]?.imageUrl || "https://placehold.co/800x800?text=No+Image",
        description: product.description || "",
        attributes: product.attributesJson ? JSON.parse(product.attributesJson) : [],
        images: product.images.map((img) => img.imageUrl),
        slug: product.slug,
        updatedAt: product.updatedAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
