import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthorizedRequest } from "@/lib/admin-auth";

export async function GET(request: Request) {
  try {
    if (!isAdminAuthorizedRequest(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalOrders,
      newOrders,
      processingOrders,
      completedOrders,
      cancelledOrders,
      revenueAgg,
      recentOrders,
      orderStatusGroups,
      topItems,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "new" } }),
      prisma.order.count({ where: { status: "processing" } }),
      prisma.order.count({ where: { status: "completed" } }),
      prisma.order.count({ where: { status: "cancelled" } }),
      prisma.order.aggregate({ _sum: { totalAmount: true } }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
      prisma.order.groupBy({ by: ["status"], _count: { status: true } }),
      prisma.orderItem.groupBy({ by: ["productName", "productSku"], _sum: { quantity: true }, _count: { productName: true }, orderBy: { _sum: { quantity: "desc" } }, take: 5 }),
    ]);

    return NextResponse.json({
      ok: true,
      stats: {
        totalOrders,
        newOrders,
        processingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue: Number(revenueAgg._sum.totalAmount || 0),
      },
      statusBreakdown: orderStatusGroups.map((item) => ({ status: item.status, count: item._count.status })),
      recentOrders: recentOrders.map((order) => ({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        status: order.status,
        totalAmount: Number(order.totalAmount),
        createdAt: order.createdAt,
      })),
      topProducts: topItems.map((item) => ({
        productName: item.productName,
        productSku: item.productSku,
        quantity: item._sum.quantity || 0,
        orders: item._count.productName,
      })),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
