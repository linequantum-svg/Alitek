import { formatPrice } from "@/lib/utils";

export default function FreeShippingProgress({
  total,
  threshold = 1500,
}: {
  total: number;
  threshold?: number;
}) {
  const percent = Math.min(100, Math.round((total / threshold) * 100));
  const left = Math.max(0, threshold - total);

  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        padding: "16px",
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: "8px" }}>
        Безкоштовна доставка від {formatPrice(threshold)}
      </div>

      <div style={{ color: "#64748b", lineHeight: 1.6, marginBottom: "10px" }}>
        {left > 0
          ? `Додайте товарів ще на ${formatPrice(left)}, щоб отримати безкоштовну доставку.`
          : "Вітаємо! Ви вже отримали безкоштовну доставку."}
      </div>

      <div
        style={{
          height: "12px",
          borderRadius: "999px",
          background: "#e5e7eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: left > 0 ? "#2f63f6" : "#16a34a",
          }}
        />
      </div>
    </div>
  );
}
