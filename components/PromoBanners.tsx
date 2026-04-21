import Link from "next/link";

const banners = [
  {
    title: "Акції тижня",
    text: "Знижки на популярні товари та аксесуари. Оновлюй каталог і знаходь кращі пропозиції.",
    cta: "Дивитися акції",
    href: "/catalog",
    gradient: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
  },
  {
    title: "Швидке замовлення",
    text: "Оформлення через Telegram, кошик, обране та актуальні ціни з Prom в одному місці.",
    cta: "Перейти в кошик",
    href: "/cart",
    gradient: "linear-gradient(135deg, #2f63f6 0%, #2752d8 100%)",
  },
  {
    title: "Підбір подарунків",
    text: "Добірки навушників, годинників, аксесуарів та інших корисних гаджетів.",
    cta: "Відкрити каталог",
    href: "/catalog",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
  },
];

export default function PromoBanners() {
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
          Банери та акції
        </h2>
        <Link
          href="/catalog"
          style={{ color: "#2f63f6", textDecoration: "none", fontWeight: 800 }}
        >
          В каталог
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "14px",
        }}
      >
        {banners.map((banner) => (
          <div
            key={banner.title}
            style={{
              background: banner.gradient,
              color: "#ffffff",
              borderRadius: "24px",
              padding: "24px",
              minHeight: "220px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.16)",
                  borderRadius: "999px",
                  padding: "8px 12px",
                  fontWeight: 800,
                  fontSize: "13px",
                  marginBottom: "14px",
                }}
              >
                Спецпропозиція
              </div>

              <div
                style={{
                  fontSize: "30px",
                  lineHeight: 1.05,
                  fontWeight: 900,
                  marginBottom: "10px",
                }}
              >
                {banner.title}
              </div>

              <div style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.7 }}>
                {banner.text}
              </div>
            </div>

            <div style={{ marginTop: "18px" }}>
              <Link
                href={banner.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "46px",
                  padding: "0 18px",
                  borderRadius: "14px",
                  background: "#ffffff",
                  color: "#0f172a",
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                {banner.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
