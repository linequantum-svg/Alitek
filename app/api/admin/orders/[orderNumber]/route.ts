import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthorizedRequest } from "@/lib/admin-auth";

const allowedStatuses = ["new", "confirmed", "processing", "shipped", "completed", "cancelled"] as const;
type OrderStatusValue = (typeof allowedStatuses)[number];

export async function GET(request: Request, context: { params: Promise<{ orderNumber: string }> }) {
  try {
    if (!isAdminAuthorizedRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { orderNumber } = await context.params;
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: { orderBy: { createdAt: "asc" } } },
    });

    if (!order) {
      return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
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
        updatedAt: order.updatedAt,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku,
          price: Number(item.price),
          quantity: item.quantity,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ orderNumber: string }> }) {
  try {
    if (!isAdminAuthorizedRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { orderNumber } = await context.params;
    const body = await request.json();
    const status = String(body?.status || "").trim() as OrderStatusValue;

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { orderNumber },
      data: { status },
      include: { items: { orderBy: { createdAt: "asc" } } },
    });

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
        updatedAt: order.updatedAt,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku,
          price: Number(item.price),
          quantity: item.quantity,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
