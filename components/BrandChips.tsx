import Link from "next/link";

export default function BrandChips({
  brands,
}: {
  brands: string[];
}) {
  if (!brands.length) return null;

  return (
    <section style={{ marginTop: "32px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "14px",
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 900 }}>Популярні бренди</h2>
        <div style={{ color: "#64748b", fontWeight: 700 }}>
          Швидкий перехід по брендах
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {brands.map((brand) => (
          <Link
            key={brand}
            href={`/catalog?brand=${encodeURIComponent(brand)}`}
            style={{
              background: "#ffffff",
              border: "1px solid #dbe1ea",
              borderRadius: "999px",
              padding: "10px 14px",
              textDecoration: "none",
              color: "#0f172a",
              fontWeight: 800,
            }}
          >
            {brand}
          </Link>
        ))}
      </div>
    </section>
  );
}
