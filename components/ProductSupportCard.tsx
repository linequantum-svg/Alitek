import Link from "next/link";

export default function ProductSupportCard() {
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
          margin: "0 0 14px",
          fontSize: "24px",
          fontWeight: 900,
        }}
      >
        Потрібна допомога з вибором?
      </h2>

      <div
        style={{
          color: "#64748b",
          lineHeight: 1.8,
          marginBottom: "14px",
        }}
      >
        Можна уточнити сумісність, характеристики, наявність та підбір аналогів.
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/contact"
          style={{
            height: "46px",
            padding: "0 18px",
            borderRadius: "14px",
            background: "#2f63f6",
            color: "#ffffff",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            fontWeight: 800,
          }}
        >
          Зв’язатися
        </Link>

        <Link
          href="/delivery-payment"
          style={{
            height: "46px",
            padding: "0 18px",
            borderRadius: "14px",
            border: "1px solid #dbe1ea",
            background: "#ffffff",
            color: "#0f172a",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            fontWeight: 800,
          }}
        >
          Умови доставки
        </Link>
      </div>
    </section>
  );
}
