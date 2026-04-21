const faq = [
  {
    q: "Чи актуальна наявність?",
    a: "Так, на сторінці відображається актуальна наявність із поточного каталогу.",
  },
  {
    q: "Як оформити замовлення?",
    a: "Можна додати товар у кошик або одразу відкрити замовлення через Telegram.",
  },
  {
    q: "Чи можна уточнити характеристики?",
    a: "Так, перед покупкою можна зв’язатися з магазином і уточнити деталі.",
  },
];

export default function ProductFaqMini() {
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
        Питання та відповіді
      </h2>

      <div style={{ display: "grid", gap: "12px" }}>
        {faq.map((item) => (
          <div
            key={item.q}
            style={{
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "16px",
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: "8px", color: "#0f172a" }}>{item.q}</div>
            <div style={{ color: "#64748b", lineHeight: 1.7 }}>{item.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
