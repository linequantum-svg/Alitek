import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          width: "100%",
          background: "#ffffff",
          border: "1px solid #dbe1ea",
          borderRadius: "28px",
          padding: "36px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: "999px",
            background: "#eef4ff",
            color: "#2f63f6",
            fontWeight: 800,
            marginBottom: "16px",
          }}
        >
          Помилка 404
        </div>

        <h1 style={{ margin: 0, fontSize: "44px", fontWeight: 900 }}>
          Сторінку не знайдено
        </h1>

        <p
          style={{
            margin: "14px 0 24px",
            color: "#64748b",
            fontSize: "18px",
            lineHeight: 1.7,
          }}
        >
          Можливо, адреса сторінки змінилася або такого товару вже немає.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              height: "52px",
              padding: "0 22px",
              borderRadius: "16px",
              background: "#2f63f6",
              color: "#ffffff",
              fontWeight: 800,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            На головну
          </Link>

          <Link
            href="/catalog"
            style={{
              height: "52px",
              padding: "0 22px",
              borderRadius: "16px",
              border: "1px solid #dbe1ea",
              background: "#ffffff",
              color: "#0f172a",
              fontWeight: 800,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            В каталог
          </Link>
        </div>
      </div>
    </main>
  );
}
