import Breadcrumbs from "@/components/Breadcrumbs";

const cards = [
  {
    title: "Доставка",
    text: "Відправлення по Україні популярними службами доставки. У більшості випадків замовлення прибуває протягом 1-3 днів.",
  },
  {
    title: "Оплата",
    text: "Після оформлення менеджер уточнить деталі та допоможе обрати зручний спосіб оплати: передплата, післяплата або інший погоджений варіант.",
  },
  {
    title: "Перевірка замовлення",
    text: "Перед відправкою варто ще раз уточнити модель, колір, комплектацію та актуальну наявність товару.",
  },
  {
    title: "Повернення",
    text: "Питання повернення та обміну вирішуються відповідно до чинного законодавства та правил магазину.",
  },
  {
    title: "Підтвердження",
    text: "Після оформлення замовлення покупець отримує підтвердження в Telegram або телефоном.",
  },
  {
    title: "Уточнення умов",
    text: "Перед запуском сайту на домені радимо адаптувати цю сторінку під реальні умови доставки, оплати та гарантії саме твого магазину.",
  },
];

export default function DeliveryPaymentPage() {
  return (
    <>
      <main className="page">
        <div className="container">
          <div className="crumbs">
            <Breadcrumbs items={[{ href: "/", label: "Головна" }, { label: "Доставка та оплата" }]} />
          </div>

          <section className="heroCard">
            <div className="pill">Умови покупки</div>
            <h1>Доставка та оплата</h1>
            <div className="intro">
              Зібрали коротко найважливіше: як відправляємо замовлення, як узгоджується оплата
              і що варто знати перед покупкою.
            </div>
          </section>

          <div className="grid">
            {cards.map((item) => (
              <div key={item.title} className="card">
                <div className="title">{item.title}</div>
                <div className="text">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        .page { background:linear-gradient(180deg,#f8f8f7 0%,#eef1f4 100%); min-height:100vh; color:#0f172a; font-family:var(--font-sans),ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
        .container { max-width:1360px; margin:0 auto; padding:24px 18px 40px; }
        .crumbs { margin-bottom:16px; }
        .heroCard, .card { background:#ffffff; border:1px solid rgba(219,225,234,.95); box-shadow:0 18px 36px rgba(15,23,42,.05); }
        .heroCard { border-radius:28px; padding:30px 32px; margin-bottom:18px; background:linear-gradient(135deg,#ffffff 0%,#f5f7fa 52%,#eceff3 100%); }
        .pill { display:inline-block; background:linear-gradient(135deg,#fff4e8 0%,#f4e5d7 100%); color:#8b5e3c; padding:8px 14px; border-radius:999px; font-weight:700; font-size:14px; margin-bottom:16px; }
        .heroCard h1 { margin:0; font-size:40px; font-weight:800; letter-spacing:-.03em; }
        .intro { margin-top:12px; color:#475569; line-height:1.8; max-width:760px; }
        .grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
        .card { border-radius:22px; padding:22px; }
        .title { font-size:24px; font-weight:800; margin-bottom:10px; }
        .text { color:#64748b; line-height:1.8; }
        @media (max-width:768px) {
          .container { padding:18px 12px 32px; }
          .heroCard { padding:20px; }
          .heroCard h1 { font-size:30px; }
          .grid { grid-template-columns:1fr; }
          .card { padding:18px; }
          .title { font-size:20px; }
        }
      `}</style>
    </>
  );
}
