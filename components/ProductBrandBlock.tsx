import Link from "next/link";

export default function ProductBrandBlock({
  brand,
}: {
  brand?: string;
}) {
  if (!brand) return null;

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
      <div
        style={{
          fontSize: "24px",
          fontWeight: 900,
          marginBottom: "10px",
        }}
      >
        Бренд товару
      </div>

      <div
        style={{
          color: "#64748b",
          lineHeight: 1.8,
          marginBottom: "14px",
        }}
      >
        Подивись інші товари цього бренду в каталозі.
      </div>

      <Link
        href={`/catalog?brand=${encodeURIComponent(brand)}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          height: "46px",
          padding: "0 18px",
          borderRadius: "14px",
          background: "#eef4ff",
          color: "#2f63f6",
          textDecoration: "none",
          fontWeight: 900,
        }}
      >
        {brand}
      </Link>
    </section>
  );
}
