const brands = [
  "Apple",
  "Samsung",
  "Xiaomi",
  "JBL",
  "Anker",
  "Plextone",
  "Skmei",
  "Sony",
];

export default function BrandsSection() {
  return (
    <section style={{ marginTop: "32px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 900 }}>
          Популярні бренди
        </h2>
        <div style={{ color: "#64748b", fontWeight: 700 }}>Блок довіри для магазину</div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "14px",
        }}
      >
        {brands.map((brand) => (
          <div
            key={brand}
            style={{
              background: "#ffffff",
              border: "1px solid #dbe1ea",
              borderRadius: "22px",
              padding: "24px",
              minHeight: "96px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.02em",
            }}
          >
            {brand}
          </div>
        ))}
      </div>
    </section>
  );
}
