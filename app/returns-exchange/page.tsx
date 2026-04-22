import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_CONFIG } from "@/lib/site-config";

const returnItems = [
  {
    title: "Загальне правило",
    text:
      "Покупець може звернутися щодо обміну або повернення товару в порядку та строки, передбачені чинним законодавством України, якщо товар зберіг товарний вигляд, споживчі властивості, пломби, ярлики та документ, що підтверджує покупку.",
  },
  {
    title: "Як подати звернення",
    text:
      "Для оформлення повернення або обміну потрібно звернутися до магазину за телефоном, email або в Telegram, повідомити номер замовлення, причину звернення та узгодити спосіб відправлення товару.",
  },
  {
    title: "Стан товару",
    text:
      "Товар має бути повернений у повній комплектації, без слідів використання понад межі, необхідні для перевірки, з упаковкою та всіма супровідними елементами, якщо це можливо.",
  },
  {
    title: "Перевірка після отримання",
    text:
      "Після надходження товару магазин перевіряє комплектність, стан і відповідність заявленій причині повернення. Після підтвердження звернення узгоджується обмін або повернення коштів.",
  },
  {
    title: "Повернення коштів",
    text:
      "Повернення коштів здійснюється тим способом, який додатково погоджується з покупцем, після прийняття повернення магазином і в строки, що відповідають законодавству та технічним можливостям платіжних сервісів.",
  },
  {
    title: "Важливо",
    text:
      "Для окремих категорій товарів можуть діяти винятки або спеціальні умови обміну й повернення відповідно до законодавства України. Якщо є сумніви щодо конкретного товару, рекомендуємо уточнити це до оформлення замовлення.",
  },
];

export default function ReturnsExchangePage() {
  return (
    <>
      <main className="page">
        <div className="container">
          <div className="crumbs">
            <Breadcrumbs
              items={[
                { href: "/", label: "Головна" },
                { label: "Повернення та обмін" },
              ]}
            />
          </div>

          <section className="heroCard">
            <div className="pill">Для покупців</div>
            <h1>Повернення та обмін</h1>
            <p>
              На цій сторінці зібрані базові правила звернення щодо повернення або обміну
              товарів, придбаних у магазині {SITE_CONFIG.brandName}.
            </p>
          </section>

          <section className="grid">
            {returnItems.map((item) => (
              <article className="card" key={item.title}>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </article>
            ))}
          </section>
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
        .heroCard p { margin:12px 0 0; max-width:820px; color:#475569; line-height:1.8; }
        .grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
        .card { border-radius:22px; padding:22px; }
        .card h2 { margin:0 0 10px; font-size:24px; font-weight:800; }
        .card p { margin:0; color:#64748b; line-height:1.8; }
        @media (max-width:768px) {
          .container { padding:18px 12px 32px; }
          .heroCard { padding:20px; }
          .heroCard h1 { font-size:30px; }
          .grid { grid-template-columns:1fr; }
          .card { padding:18px; }
          .card h2 { font-size:20px; }
        }
      `}</style>
    </>
  );
}
