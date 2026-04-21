const faqItems = [
  {
    q: "Як оформити замовлення?",
    a: "Додайте товар у кошик, заповніть форму та відкрийте готове замовлення в Telegram.",
  },
  {
    q: "Чи актуальна наявність?",
    a: "Так, товари оновлюються із Prom, тому ціни та наявність максимально актуальні.",
  },
  {
    q: "Які є способи оплати?",
    a: "Після оформлення менеджер уточнить зручний спосіб: передплата, післяплата або інший доступний варіант.",
  },
  {
    q: "Скільки триває доставка?",
    a: "У середньому 1–3 дні по Україні, залежно від регіону та служби доставки.",
  },
  {
    q: "Чи можна повернути товар?",
    a: "Так, відповідно до чинних правил і умов магазину. Деталі краще уточнювати перед замовленням.",
  },
  {
    q: "Чи можна замовити консультацію?",
    a: "Так, напишіть у Telegram або зателефонуйте — допоможемо підібрати товар.",
  },
];

export default function FAQSection() {
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
          FAQ
        </h2>
        <div style={{ color: "#64748b", fontWeight: 700 }}>
          Часті запитання покупців
        </div>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {faqItems.map((item) => (
          <div
            key={item.q}
            style={{
              background: "#ffffff",
              border: "1px solid #dbe1ea",
              borderRadius: "22px",
              padding: "20px 22px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: 900, marginBottom: "8px" }}>
              {item.q}
            </div>
            <div style={{ color: "#64748b", lineHeight: 1.8 }}>{item.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
