import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_CONFIG } from "@/lib/site-config";

const offerItems = [
  {
    title: "Предмет оферти",
    text:
      `Цей сайт є інформаційним ресурсом магазину ${SITE_CONFIG.brandName}. Розміщення товарів, описів і цін на сайті є запрошенням користувача оформити замовлення на умовах, викладених у цій публічній оферті та на інших сторінках сайту.`,
  },
  {
    title: "Оформлення замовлення",
    text:
      "Замовлення вважається переданим магазину після заповнення форми на сайті або узгодження деталей із менеджером через доступні канали зв'язку. Після цього магазин може зв'язатися з покупцем для підтвердження деталей замовлення.",
  },
  {
    title: "Ціни та наявність",
    text:
      "Магазин прагне підтримувати актуальність цін і наявності товарів, але остаточне підтвердження замовлення здійснюється після перевірки менеджером. У випадку технічної помилки або відсутності товару покупцеві пропонується уточнення або скасування замовлення.",
  },
  {
    title: "Оплата і доставка",
    text:
      "Умови оплати та доставки визначаються на сторінці «Доставка та оплата» та можуть уточнюватися під час підтвердження замовлення. Оформлюючи замовлення, покупець підтверджує, що ознайомився з цими умовами.",
  },
  {
    title: "Права та обов'язки сторін",
    text:
      "Магазин зобов'язується надати покупцеві інформацію про товар, прийняти й опрацювати замовлення та організувати його виконання в межах погоджених умов. Покупець зобов'язується надати достовірні дані для зв'язку та доставки й належним чином прийняти замовлення.",
  },
  {
    title: "Повернення та обмін",
    text:
      "Питання обміну та повернення товарів регулюються законодавством України та окремою сторінкою сайту «Повернення та обмін». Оформлюючи замовлення, покупець підтверджує, що ознайомився з цими умовами.",
  },
  {
    title: "Персональні дані",
    text:
      "Оформлення замовлення означає згоду покупця на обробку персональних даних у межах, необхідних для виконання замовлення, відповідно до сторінки «Політика конфіденційності».",
  },
  {
    title: "Контакти магазину",
    text:
      `З усіх питань щодо замовлень, умов продажу та виконання оферти покупець може звертатися до магазину за контактами, розміщеними на сторінці «Контакти».`,
  },
];

export default function PublicOfferPage() {
  return (
    <>
      <main className="page">
        <div className="container">
          <div className="crumbs">
            <Breadcrumbs
              items={[
                { href: "/", label: "Головна" },
                { label: "Публічна оферта" },
              ]}
            />
          </div>

          <section className="heroCard">
            <div className="pill">Умови користування</div>
            <h1>Публічна оферта</h1>
            <p>
              Ця сторінка визначає базові умови оформлення замовлень на сайті магазину{" "}
              {SITE_CONFIG.brandName}, права та обов&apos;язки сторін, а також порядок взаємодії
              між покупцем і магазином.
            </p>
          </section>

          <section className="grid">
            {offerItems.map((item) => (
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
