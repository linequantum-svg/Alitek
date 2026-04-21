export default function ProductCharacteristics({
  items,
}: {
  items: Array<{ name?: string; value?: string }>;
}) {
  if (!items.length) return null;

  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #dbe1ea",
        borderRadius: "28px",
        padding: "24px",
        marginTop: "18px",
      }}
    >
      <h2
        style={{
          margin: "0 0 16px",
          fontSize: "24px",
          fontWeight: 900,
          color: "#0f172a",
        }}
      >
        Характеристики
      </h2>

      <div style={{ display: "grid", gap: "10px" }}>
        {items.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            style={{
              display: "grid",
              gridTemplateColumns: "220px 1fr",
              gap: "14px",
              padding: "12px 0",
              borderBottom: index === items.length - 1 ? "none" : "1px solid #eef2f7",
            }}
          >
            <div style={{ color: "#64748b", fontWeight: 700 }}>{item.name || "Параметр"}</div>
            <div style={{ color: "#0f172a", fontWeight: 600 }}>{item.value || "—"}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
