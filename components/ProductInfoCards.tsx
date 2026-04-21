export default function ProductInfoCards() {
  const items = [
    {
      title: "Доставка",
      text: "Швидка відправка по Україні. Уточнення деталей замовлення після оформлення.",
    },
    {
      title: "Оплата",
      text: "Оплата на карту, післяплата або інші доступні способи після підтвердження.",
    },
    {
      title: "Гарантія",
      text: "Перевірка товару перед відправкою та допомога з питаннями після покупки.",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "14px",
        marginTop: "18px",
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
          <div style={{ fontSize: "20px", fontWeight: 900, marginBottom: "8px" }}>
            {item.title}
          </div>
          <div style={{ color: "#64748b", lineHeight: 1.7 }}>{item.text}</div>
        </div>
      ))}
    </div>
  );
}
