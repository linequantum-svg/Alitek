const items = [
  {
    title: "Актуальні ціни",
    text: "Каталог регулярно оновлюється, щоб ти бачив актуальну ціну та наявність без неприємних сюрпризів.",
  },
  {
    title: "Швидке оформлення",
    text: "Замовлення можна оформити через сайт або одразу перейти до покупки в Telegram, якщо так зручніше.",
  },
  {
    title: "Зручний вибір",
    text: "Категорії, бренди, пошук, обране та кошик зібрані так, щоб потрібний товар знаходився за кілька кліків.",
  },
  {
    title: "Більше довіри",
    text: "Контакти, сторінка доставки й оплати та зрозуміла структура магазину допомагають купувати спокійніше.",
  },
];

export default function TrustBadges() {
  return (
    <section style={{ marginTop: "32px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "14px",
        }}
      >
        {items.map((item) => (
          <div
            key={item.title}
            style={{
              background: "#ffffff",
              border: "1px solid #dbe1ea",
              borderRadius: "22px",
              padding: "18px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: 900,
                marginBottom: "8px",
                color: "#0f172a",
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                color: "#64748b",
                lineHeight: 1.7,
              }}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}