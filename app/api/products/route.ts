import { NextResponse } from "next/server";
import { getCatalogPageData } from "@/lib/storefront-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const brand = searchParams.get("brand")?.trim() || "";
    const availableParam = searchParams.get("available");
    const available = availableParam === "true" || availableParam === "1";
    const sort = searchParams.get("sort")?.trim() || "popular";
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || 20), 1), 100);

    const data = await getCatalogPageData({
      query,
      categoryName: category,
      brand,
      availableOnly: available,
      sort,
      page,
      pageSize: limit,
    });

    const response = NextResponse.json({
      ok: true,
      total: data.total,
      page,
      limit,
      totalPages: data.totalPages,
      categories: data.categories,
      updatedAt: new Date().toISOString(),
      products: data.products.map((product) => ({
        id: product.id,
        sku: product.vendorCode || product.externalId,
        vendorCode: product.vendorCode || product.externalId,
        name: product.name,
        brand: product.brand || "Без бренду",
        category: product.categoryName || "Без категорії",
        categoryName: product.categoryName || "Без категорії",
        categoryId: product.categoryId,
        price: product.price,
        oldPrice: Number(product.oldPrice || product.price),
        available: product.available,
        sold: 0,
        rating: 4.7,
        image: product.image || "https://placehold.co/800x800?text=No+Image",
        description: product.description || "",
        attributes: product.params,
        params: product.params,
        images: product.images,
        slug: product.slug,
      })),
    });

    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response;
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
