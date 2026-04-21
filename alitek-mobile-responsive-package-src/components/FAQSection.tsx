const items = [
  { q: "Як оформити замовлення?", a: "Додайте товар у кошик, заповніть форму та відкрийте готове замовлення в Telegram." },
  { q: "Чи актуальна наявність?", a: "Так, товари оновлюються із Prom, тому ціни та наявність максимально актуальні." },
  { q: "Скільки триває доставка?", a: "У середньому 1–3 дні по Україні, залежно від регіону та служби доставки." },
];

export default function FAQSection() {
  return (
    <>
      <section className="section">
        <div className="header">
          <h2>FAQ</h2>
          <div>Часті запитання покупців</div>
        </div>
        <div className="grid">
          {items.map((item) => (
            <div key={item.q} className="card">
              <div className="q">{item.q}</div>
              <div className="a">{item.a}</div>
            </div>
          ))}
        </div>
      </section>
      <style jsx>{`
        .section { margin-top:32px; }
        .header { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:14px; flex-wrap:wrap; }
        .header h2 { margin:0; font-size:28px; font-weight:900; }
        .header div { color:#64748b; font-weight:700; }
        .grid { display:grid; gap:12px; }
        .card { background:#fff; border:1px solid #dbe1ea; border-radius:22px; padding:20px 22px; }
        .q { font-size:20px; font-weight:900; margin-bottom:8px; }
        .a { color:#64748b; line-height:1.8; }
        @media (max-width:768px) { .header h2 { font-size:24px; } .card { padding:18px; } .q { font-size:18px; } }
      `}</style>
    </>
  );
}
