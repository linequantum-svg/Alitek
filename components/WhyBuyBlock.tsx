export default function WhyBuyBlock({
  items,
}: {
  items: string[];
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
        Чому варто купити
      </h2>

      <div style={{ display: "grid", gap: "10px" }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "14px 16px",
              color: "#0f172a",
              fontWeight: 700,
            }}
          >
            • {item}
          </div>
        ))}
      </div>
    </section>
  );
}
