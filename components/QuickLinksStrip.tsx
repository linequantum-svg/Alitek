import Link from "next/link";

const links = [
  { href: "/catalog", label: "Каталог", tone: "primary" },
  { href: "/favorites", label: "Обране" },
  { href: "/cart", label: "Кошик" },
  { href: "/delivery-payment", label: "Доставка та оплата", wide: true },
  { href: "/contact", label: "Контакти" },
];

export default function QuickLinksStrip() {
  return (
    <section style={{ marginTop: "18px" }}>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {links.map((item) => {
          const isPrimary = item.tone === "primary";

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                minHeight: "46px",
                padding: item.wide ? "0 18px" : "0 16px",
                borderRadius: "999px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                color: isPrimary ? "#111827" : "#0f172a",
                background: isPrimary
                  ? "rgba(255,255,255,0.96)"
                  : "rgba(255,255,255,0.82)",
                border: "1px solid #dbe1ea",
                boxShadow: isPrimary
                  ? "0 10px 20px rgba(15, 23, 42, 0.06)"
                  : "0 8px 20px rgba(15, 23, 42, 0.05)",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                backdropFilter: "blur(8px)",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
