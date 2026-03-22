import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthorizedRequest } from "@/lib/admin-auth";

export async function GET(request: Request) {
  try {
    if (!isAdminAuthorizedRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status")?.trim() || "";
    const q = searchParams.get("q")?.trim() || "";
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || 20), 1), 100);
    const skip = (page - 1) * limit;

    const where = {
      ...(status ? { status: status as any } : {}),
      ...(q
        ? {
            OR: [
              { orderNumber: { contains: q, mode: "insensitive" as const } },
              { customerName: { contains: q, mode: "insensitive" as const } },
              { phone: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
              { items: { some: { productName: { contains: q, mode: "insensitive" as const } } } },
              { items: { some: { productSku: { contains: q, mode: "insensitive" as const } } } },
            ],
          }
        : {}),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { items: { orderBy: { createdAt: "asc" } } },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      ok: true,
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        customerName: order.customerName,
        phone: order.phone,
        email: order.email,
        comment: order.comment,
        totalAmount: Number(order.totalAmount),
        itemsCount: order.itemsCount,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku,
          price: Number(item.price),
          quantity: item.quantity,
        })),
      })),
      total,
      page,
      limit,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      q,
      status,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
