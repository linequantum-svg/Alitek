
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, context: { params: Promise<{ orderNumber: string }> }) {
  try {
    const { orderNumber } = await context.params;
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: { orderBy: { createdAt: "asc" } } },
    });

    if (!order) {
      return NextResponse.json({ ok: false, error: "Замовлення не знайдено" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      order: {
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
        items: order.items.map((item) => ({
          id: item.id,
          productName: item.productName,
          productSku: item.productSku,
          price: Number(item.price),
          quantity: item.quantity,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
