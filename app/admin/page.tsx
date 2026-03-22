"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type DashboardResponse = {
  ok: boolean;
  stats: {
    totalOrders: number;
    newOrders: number;
    processingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
  };
  statusBreakdown: Array<{ status: string; count: number }>;
  recentOrders: Array<{
    orderNumber: string;
    customerName: string;
    status: string;
    totalAmount: number;
    createdAt: string;
  }>;
  topProducts: Array<{
    productName: string;
    productSku?: string | null;
    quantity: number;
    orders: number;
  }>;
  updatedAt: string;
  error?: string;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value) + " ₴";
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("uk-UA");
}

const statusLabels: Record<string, string> = {
  new: "Нові",
  confirmed: "Підтверджені",
  processing: "В обробці",
  shipped: "Відправлені",
  completed: "Завершені",
  cancelled: "Скасовані",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/stats", { cache: "no-store" });
      const result = await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "Не вдалося завантажити dashboard");
      }
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Помилка");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const cards = useMemo(() => {
    if (!data) return [];
    return [
      { label: "Усього замовлень", value: data.stats.totalOrders.toString() },
      { label: "Нові", value: data.stats.newOrders.toString() },
      { label: "В обробці", value: data.stats.processingOrders.toString() },
      { label: "Завершені", value: data.stats.completedOrders.toString() },
      { label: "Скасовані", value: data.stats.cancelledOrders.toString() },
      { label: "Сума продажів", value: formatPrice(data.stats.totalRevenue) },
    ];
  }, [data]);

  return (
    <main style={{ maxWidth: 1400, margin: "0 auto", padding: 16 }}>
      <section style={{ background: "linear-gradient(90deg,#0f172a,#1e293b)", color: "white", padding: 24, borderRadius: 24, marginBottom: 16, display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.75, marginBottom: 8 }}>Адмін-панель</div>
          <h1 style={{ margin: 0, fontSize: 36 }}>Dashboard</h1>
          <p style={{ maxWidth: 760, lineHeight: 1.6, opacity: 0.9 }}>
            Коротка аналітика по замовленнях, виручці та найпопулярніших товарах.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <Link href="/admin/orders" style={{ background: "white", color: "#0f172a", borderRadius: 14, padding: "12px 16px", textDecoration: "none", fontWeight: 700 }}>Перейти до замовлень</Link>
            <button onClick={loadDashboard} style={{ background: "transparent", color: "white", borderRadius: 14, padding: "12px 16px", border: "1px solid rgba(255,255,255,0.25)", fontWeight: 700, cursor: "pointer" }}>Оновити</button>
          </div>
        </div>
        <button onClick={logout} style={{ background: "white", color: "#0f172a", borderRadius: 14, padding: "12px 16px", border: "none", fontWeight: 700, cursor: "pointer" }}>Вийти</button>
      </section>

      {loading ? <div style={{ color: "#64748b" }}>Завантаження...</div> : null}
      {error ? <div style={{ color: "#b91c1c", marginBottom: 16 }}>{error}</div> : null}

      {data ? (
        <>
          <section style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(3, minmax(0, 1fr))", marginBottom: 16 }}>
            {cards.map((card) => (
              <div key={card.label} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 24, padding: 18 }}>
                <div style={{ fontSize: 12, textTransform: "uppercase", color: "#64748b" }}>{card.label}</div>
                <div style={{ marginTop: 8, fontSize: 28, fontWeight: 800 }}>{card.value}</div>
              </div>
            ))}
          </section>

          <section style={{ display: "grid", gap: 16, gridTemplateColumns: "1.15fr 0.85fr", marginBottom: 16 }}>
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 24, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 20 }}>Останні замовлення</div>
                <Link href="/admin/orders" style={{ color: "#0f172a", fontWeight: 700, textDecoration: "none" }}>Дивитись усі</Link>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {data.recentOrders.length ? data.recentOrders.map((order) => (
                  <div key={order.orderNumber} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, border: "1px solid #e2e8f0", borderRadius: 16, padding: 12, alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 800 }}>{order.orderNumber}</div>
                      <div style={{ color: "#334155", marginTop: 4 }}>{order.customerName}</div>
                      <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>{formatDate(order.createdAt)}</div>
                    </div>
                    <div style={{ fontSize: 14, color: "#334155" }}>{statusLabels[order.status] || order.status}</div>
                    <div style={{ fontWeight: 800 }}>{formatPrice(order.totalAmount)}</div>
                  </div>
                )) : <div style={{ color: "#64748b" }}>Поки що немає замовлень</div>}
              </div>
            </div>

            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 24, padding: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 12 }}>Статуси</div>
              <div style={{ display: "grid", gap: 10 }}>
                {data.statusBreakdown.length ? data.statusBreakdown.map((item) => (
                  <div key={item.status} style={{ display: "flex", justifyContent: "space-between", gap: 12, background: "#f8fafc", borderRadius: 16, padding: 12 }}>
                    <span>{statusLabels[item.status] || item.status}</span>
                    <strong>{item.count}</strong>
                  </div>
                )) : <div style={{ color: "#64748b" }}>Ще немає даних</div>}
              </div>
            </div>
          </section>

          <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 24, padding: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 12 }}>Топ товарів</div>
            <div style={{ display: "grid", gap: 10 }}>
              {data.topProducts.length ? data.topProducts.map((item, index) => (
                <div key={`${item.productName}-${index}`} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, border: "1px solid #e2e8f0", borderRadius: 16, padding: 12, alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.productName}</div>
                    <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>{item.productSku || "Без SKU"}</div>
                  </div>
                  <div style={{ color: "#334155" }}>Замовлень: {item.orders}</div>
                  <div style={{ fontWeight: 800 }}>Продано: {item.quantity}</div>
                </div>
              )) : <div style={{ color: "#64748b" }}>Ще немає проданих товарів</div>}
            </div>
            <div style={{ marginTop: 12, color: "#64748b", fontSize: 13 }}>Оновлено: {formatDate(data.updatedAt)}</div>
          </section>
        </>
      ) : null}
    </main>
  );
}
