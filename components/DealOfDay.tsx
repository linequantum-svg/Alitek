import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function DealOfDay({
  product,
}: {
  product?: any;
}) {
  if (!product) return null;

  return (
    <section
      style={{
        marginTop: "32px",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "#ffffff",
        borderRadius: "28px",
        padding: "24px",
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        gap: "20px",
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.14)",
            borderRadius: "999px",
            padding: "8px 12px",
            fontWeight: 800,
            fontSize: "13px",
            marginBottom: "14px",
          }}
        >
          Акція дня
        </div>

        <div
          style={{
            fontSize: "40px",
            lineHeight: 1.05,
            fontWeight: 900,
            marginBottom: "12px",
          }}
        >
          Спеціальна пропозиція на популярний товар
        </div>

        <div
          style={{
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.7,
            marginBottom: "18px",
            maxWidth: "680px",
          }}
        >
          Виділяй один товар на головній, щоб вести трафік у картку товару та підсилювати продажі.
        </div>

        <div
          style={{
            fontSize: "24px",
            fontWeight: 900,
            marginBottom: "16px",
          }}
        >
          {product.name}
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontSize: "34px", fontWeight: 900 }}>
            {formatPrice(Number(product.price))}
          </div>
          {product.oldPrice ? (
            <div
              style={{
                fontSize: "20px",
                color: "#94a3b8",
                textDecoration: "line-through",
                fontWeight: 700,
              }}
            >
              {formatPrice(Number(product.oldPrice))}
            </div>
          ) : null}
        </div>

        <div style={{ marginTop: "18px" }}>
          <Link
            href={`/product/${product.slug}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: "48px",
              padding: "0 18px",
              borderRadius: "14px",
              background: "#ffffff",
              color: "#0f172a",
              textDecoration: "none",
              fontWeight: 900,
            }}
          >
            Перейти до товару
          </Link>
        </div>
      </div>

      <Link
        href={`/product/${product.slug}`}
        style={{
          display: "block",
          background: "#ffffff",
          borderRadius: "24px",
          minHeight: "320px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <img
          src={product.image || "/no-image.png"}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            background: "#f8fafc",
          }}
        />
      </Link>
    </section>
  );
}
