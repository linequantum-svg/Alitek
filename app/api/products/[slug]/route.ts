import { NextResponse } from "next/server";
import { getStorefrontProductBySlug } from "@/lib/storefront-data";

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const data = await getStorefrontProductBySlug(slug);

    if (!data?.product) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        ok: true,
        product: data.product,
        related: data.related || [],
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
