import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { hasDiscount, getDiscountPercent } from "@/lib/catalog-helpers";

export default function SaleShowcase({
  products,
}: {
  products: any[];
}) {
  const saleProducts = (products || []).filter(hasDiscount).slice(0, 4);

  if (!saleProducts.length) return null;

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
        <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 900 }}>Товари зі знижкою</h2>
        <Link
          href="/catalog"
          style={{
            color: "#2f63f6",
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          Дивитися всі
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "14px",
        }}
      >
        {saleProducts.map((product) => {
          const discount = getDiscountPercent(product);
          return (
            <div
              key={product.id}
              style={{
                background: "#ffffff",
                border: "1px solid #dbe1ea",
                borderRadius: "22px",
                padding: "14px",
              }}
            >
              <Link
                href={`/product/${product.slug}`}
                style={{
                  textDecoration: "none",
                  color: "#0f172a",
                  display: "block",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: "220px",
                    borderRadius: "18px",
                    background: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    marginBottom: "12px",
                  }}
                >
                  {discount ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "#dc2626",
                        color: "#ffffff",
                        borderRadius: "999px",
                        padding: "6px 10px",
                        fontSize: "12px",
                        fontWeight: 800,
                      }}
                    >
                      −{discount}%
                    </div>
                  ) : null}

                  <img
                    src={product.image || "/no-image.png"}
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>

                <div
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.45,
                    minHeight: "66px",
                    fontWeight: 700,
                  }}
                >
                  {product.name}
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    fontWeight: 900,
                    fontSize: "28px",
                  }}
                >
                  {formatPrice(Number(product.price))}
                </div>

                <div
                  style={{
                    marginTop: "6px",
                    color: "#94a3b8",
                    textDecoration: "line-through",
                    fontWeight: 700,
                  }}
                >
                  {formatPrice(Number(product.oldPrice))}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
