
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendTelegramOrderNotification } from "@/lib/telegram";

type OrderItemInput = {
  productId: string;
  quantity: number;
};

type OrderPayload = {
  customerName?: string;
  phone?: string;
  email?: string;
  comment?: string;
  items?: OrderItemInput[];
};

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "").trim();
}

function generateOrderNumber() {
  const now = new Date();
  const part = now.toISOString().slice(2, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `NM-${part}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderPayload;

    const customerName = String(body.customerName || "").trim();
    const phone = normalizePhone(String(body.phone || ""));
    const email = String(body.email || "").trim() || null;
    const comment = String(body.comment || "").trim() || null;
    const items = Array.isArray(body.items) ? body.items.filter(Boolean) : [];

    if (customerName.length < 2) {
      return NextResponse.json({ ok: false, error: "Вкажи ім'я покупця" }, { status: 400 });
    }

    if (phone.length < 8) {
      return NextResponse.json({ ok: false, error: "Вкажи коректний номер телефону" }, { status: 400 });
    }

    if (!items.length) {
      return NextResponse.json({ ok: false, error: "Кошик порожній" }, { status: 400 });
    }

    const productIds = items.map((item) => String(item.productId));
    const products = await prisma.product.findMany({
      where: { externalId: { in: productIds }, isActive: true, available: true },
      select: {
        id: true,
        externalId: true,
        name: true,
        sku: true,
        price: true,
      },
    });

    if (!products.length) {
      return NextResponse.json({ ok: false, error: "Товари не знайдено" }, { status: 400 });
    }

    const productMap = new Map(products.map((product) => [product.externalId, product]));
    const normalizedItems = items
      .map((item) => {
        const product = productMap.get(String(item.productId));
        const quantity = Math.max(1, Math.min(Number(item.quantity || 1), 99));
        if (!product) return null;
        return { product, quantity, lineTotal: Number(product.price) * quantity };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    if (!normalizedItems.length) {
      return NextResponse.json({ ok: false, error: "Жоден товар недоступний для замовлення" }, { status: 400 });
    }

    const totalAmount = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      return tx.order.create({
        data: {
          orderNumber,
          customerName,
          phone,
          email,
          comment,
          totalAmount: new Prisma.Decimal(totalAmount),
          itemsCount: normalizedItems.reduce((sum, item) => sum + item.quantity, 0),
          items: {
            create: normalizedItems.map((item) => ({
              productId: item.product.id,
              productName: item.product.name,
              productSku: item.product.sku,
              price: item.product.price,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });
    });

    let telegramNotification = { ok: false, skipped: true as boolean, reason: "Not attempted" };

    try {
      telegramNotification = await sendTelegramOrderNotification({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        phone: order.phone,
        email: order.email,
        comment: order.comment,
        totalAmount: Number(order.totalAmount),
        itemsCount: order.itemsCount,
        items: order.items.map((item) => ({
          productName: item.productName,
          productSku: item.productSku,
          price: Number(item.price),
          quantity: item.quantity,
        })),
      });
    } catch (telegramError) {
      telegramNotification = {
        ok: false,
        skipped: false,
        reason: telegramError instanceof Error ? telegramError.message : "Telegram error",
      };
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
      telegramNotification,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
