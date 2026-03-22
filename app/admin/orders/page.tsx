"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  productSku?: string | null;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  phone: string;
  email?: string | null;
  comment?: string | null;
  totalAmount: number;
  itemsCount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

const STATUSES = [
  { value: "", label: "Усі статуси" },
  { value: "new", label: "Нові" },
  { value: "confirmed", label: "Підтверджені" },
  { value: "processing", label: "В обробці" },
  { value: "shipped", label: "Відправлені" },
  { value: "completed", label: "Завершені" },
  { value: "cancelled", label: "Скасовані" },
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value) + " ₴";
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("uk-UA");
}

function getStatusLabel(status: string) {
  return STATUSES.find((item) => item.value === status)?.label || status;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  async function loadOrders({ currentStatus = status, currentSearch = search, currentPage = page }: { currentStatus?: string; currentSearch?: string; currentPage?: number } = {}) {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const params = new URLSearchParams();
      if (currentStatus) params.set("status", currentStatus);
      if (currentSearch) params.set("q", currentSearch);
      params.set("page", String(currentPage));
      params.set("limit", String(limit));

      const response = await fetch(`/api/admin/orders?${params.toString()}`, { cache: "no-store" });
      const data = await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Не вдалося завантажити замовлення");
      }

      setOrders(data.orders || []);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);

      if (data.orders?.length) {
        setSelectedOrderNumber((prev) => {
          const exists = data.orders.some((item: Order) => item.orderNumber === prev);
          return exists ? prev : data.orders[0].orderNumber;
        });
      } else {
        setSelectedOrderNumber("");
      }
    } catch (e) {
      setOrders([]);
      setSelectedOrderNumber("");
      setError(e instanceof Error ? e.message : "Помилка");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders({ currentStatus: "", currentSearch: "", currentPage: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(orderNumber: string, newStatus: string) {
    try {
      setMessage("");
      setError("");
      const response = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Не вдалося оновити статус");
      }

      setOrders((prev) => prev.map((item) => (item.orderNumber === orderNumber ? data.order : item)));
      setMessage(`Статус замовлення ${orderNumber} оновлено`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Помилка");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const selectedOrder = useMemo(
    () => orders.find((item) => item.orderNumber === selectedOrderNumber) || null,
    [orders, selectedOrderNumber]
  );

  const pageButtons = useMemo(() => {
    const items: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i += 1) items.push(i);
    return items;
  }, [page, totalPages]);

  return (
    <main style={{ maxWidth: 1400, margin: "0 auto", padding: 16 }}>
      <section style={{ background: "linear-gradient(90deg,#0f172a,#1e293b)", color: "white", padding: 24, borderRadius: 24, marginBottom: 16, display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.75, marginBottom: 8 }}>Адмін-панель</div>
          <h1 style={{ margin: 0, fontSize: 36 }}>Замовлення</h1>
          <p style={{ maxWidth: 760, lineHeight: 1.6, opacity: 0.9 }}>
            Тут можна шукати замовлення за номером, покупцем, телефоном або товаром, а також перегортати сторінки, коли замовлень стане багато.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/admin" style={{ background: "white", color: "#0f172a", borderRadius: 14, padding: "12px 16px", textDecoration: "none", fontWeight: 700 }}>Dashboard</a>
          <button onClick={logout} style={{ background: "white", color: "#0f172a", borderRadius: 14, padding: "12px 16px", border: "none", fontWeight: 700, cursor: "pointer" }}>Вийти</button>
        </div>
      </section>

      <section style={{ display: "grid", gap: 16, gridTemplateColumns: "380px 1fr" }}>
        <aside style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 24, padding: 16, alignSelf: "start" }}>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Пошук і фільтр</div>

          <div style={{ display: "grid", gap: 10 }}>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearch(searchInput.trim());
                  loadOrders({ currentStatus: status, currentSearch: searchInput.trim(), currentPage: 1 });
                }
              }}
              placeholder="Номер, ім'я, телефон, email, товар"
              style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 14, padding: 12 }}
            />

            <select
              value={status}
              onChange={(e) => {
                const next = e.target.value;
                setStatus(next);
                loadOrders({ currentStatus: next, currentSearch: search, currentPage: 1 });
              }}
              style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 14, padding: 12 }}
            >
              {STATUSES.map((item) => (
                <option key={item.value || "all"} value={item.value}>{item.label}</option>
              ))}
            </select>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button
                onClick={() => {
                  const next = searchInput.trim();
                  setSearch(next);
                  loadOrders({ currentStatus: status, currentSearch: next, currentPage: 1 });
                }}
                style={{ width: "100%", background: "#0f172a", color: "white", borderRadius: 14, padding: 12, border: "none", fontWeight: 700, cursor: "pointer" }}
              >
                Знайти
              </button>
              <button
                onClick={() => {
                  setStatus("");
                  setSearch("");
                  setSearchInput("");
                  loadOrders({ currentStatus: "", currentSearch: "", currentPage: 1 });
                }}
                style={{ width: "100%", background: "#f8fafc", color: "#0f172a", borderRadius: 14, padding: 12, border: "1px solid #cbd5e1", fontWeight: 700, cursor: "pointer" }}
              >
                Скинути
              </button>
            </div>
          </div>

          {error ? <div style={{ marginTop: 14, color: "#b91c1c", fontSize: 14 }}>{error}</div> : null}
          {message ? <div style={{ marginTop: 14, color: "#15803d", fontSize: 14 }}>{message}</div> : null}

          <div style={{ height: 1, background: "#e2e8f0", margin: "16px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 800 }}>Список замовлень</div>
            <div style={{ fontSize: 13, color: "#64748b" }}>Усього: {total}</div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {loading ? <div>Завантаження...</div> : null}
            {!loading && !orders.length ? <div style={{ color: "#64748b" }}>Немає замовлень</div> : null}
            {orders.map((order) => (
              <button key={order.orderNumber} onClick={() => setSelectedOrderNumber(order.orderNumber)} style={{ textAlign: "left", border: selectedOrderNumber === order.orderNumber ? "1px solid #0f172a" : "1px solid #e2e8f0", background: selectedOrderNumber === order.orderNumber ? "#f8fafc" : "white", borderRadius: 16, padding: 12, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
                  <div style={{ fontWeight: 800 }}>{order.orderNumber}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{getStatusLabel(order.status)}</div>
                </div>
                <div style={{ fontSize: 14, color: "#334155", marginTop: 4 }}>{order.customerName}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{order.phone}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{formatPrice(order.totalAmount)} • {formatDate(order.createdAt)}</div>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <button
              disabled={page <= 1 || loading}
              onClick={() => loadOrders({ currentStatus: status, currentSearch: search, currentPage: page - 1 })}
              style={{ border: "1px solid #cbd5e1", background: page <= 1 ? "#f8fafc" : "white", color: page <= 1 ? "#94a3b8" : "#0f172a", borderRadius: 12, padding: "10px 12px", cursor: page <= 1 ? "not-allowed" : "pointer", fontWeight: 700 }}
            >
              Назад
            </button>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {pageButtons.map((item) => (
                <button
                  key={item}
                  onClick={() => loadOrders({ currentStatus: status, currentSearch: search, currentPage: item })}
                  style={{ border: item === page ? "1px solid #0f172a" : "1px solid #cbd5e1", background: item === page ? "#0f172a" : "white", color: item === page ? "white" : "#0f172a", borderRadius: 12, minWidth: 40, padding: "10px 12px", cursor: "pointer", fontWeight: 700 }}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              disabled={page >= totalPages || loading}
              onClick={() => loadOrders({ currentStatus: status, currentSearch: search, currentPage: page + 1 })}
              style={{ border: "1px solid #cbd5e1", background: page >= totalPages ? "#f8fafc" : "white", color: page >= totalPages ? "#94a3b8" : "#0f172a", borderRadius: 12, padding: "10px 12px", cursor: page >= totalPages ? "not-allowed" : "pointer", fontWeight: 700 }}
            >
              Далі
            </button>
          </div>
        </aside>

        <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 24, padding: 20 }}>
          {!selectedOrder ? <div style={{ color: "#64748b" }}>Оберіть замовлення зліва</div> : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 12, textTransform: "uppercase", color: "#64748b" }}>Замовлення</div>
                  <h2 style={{ margin: "4px 0 0", fontSize: 28 }}>{selectedOrder.orderNumber}</h2>
                  <div style={{ color: "#64748b", marginTop: 8 }}>Створено: {formatDate(selectedOrder.createdAt)}</div>
                </div>
                <div style={{ minWidth: 240 }}>
                  <div style={{ fontSize: 12, textTransform: "uppercase", color: "#64748b", marginBottom: 8 }}>Статус</div>
                  <select value={selectedOrder.status} onChange={(e) => updateStatus(selectedOrder.orderNumber, e.target.value)} style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: 14, padding: 12 }}>
                    {STATUSES.filter((item) => item.value).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(3, minmax(0, 1fr))", marginTop: 20 }}>
                <div style={{ background: "#f8fafc", borderRadius: 18, padding: 14 }}><div style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase" }}>Покупець</div><div style={{ fontWeight: 800, marginTop: 6 }}>{selectedOrder.customerName}</div><div style={{ marginTop: 6 }}>{selectedOrder.phone}</div><div style={{ marginTop: 6 }}>{selectedOrder.email || "—"}</div></div>
                <div style={{ background: "#f8fafc", borderRadius: 18, padding: 14 }}><div style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase" }}>Сума</div><div style={{ fontWeight: 800, marginTop: 6 }}>{formatPrice(selectedOrder.totalAmount)}</div><div style={{ marginTop: 6 }}>Позицій: {selectedOrder.itemsCount}</div></div>
                <div style={{ background: "#f8fafc", borderRadius: 18, padding: 14 }}><div style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase" }}>Коментар</div><div style={{ marginTop: 6 }}>{selectedOrder.comment || "—"}</div></div>
              </div>

              <div style={{ marginTop: 20 }}>
                <div style={{ fontWeight: 800, marginBottom: 12 }}>Товари у замовленні</div>
                <div style={{ display: "grid", gap: 10 }}>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, border: "1px solid #e2e8f0", borderRadius: 16, padding: 12, alignItems: "center" }}>
                      <div><div style={{ fontWeight: 700 }}>{item.productName}</div><div style={{ color: "#64748b", fontSize: 14 }}>{item.productSku || "—"}</div></div>
                      <div style={{ color: "#334155" }}>x{item.quantity}</div>
                      <div style={{ fontWeight: 800 }}>{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}
