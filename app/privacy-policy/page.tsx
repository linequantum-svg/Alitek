import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_CONFIG, getTelegramProfileUrl } from "@/lib/site-config";

const policyItems = [
  {
    title: "Які дані ми можемо отримувати",
    text:
      "Під час оформлення замовлення або звернення до магазину ми можемо отримувати ім'я, номер телефону, email, дані для доставки, а також іншу інформацію, яку покупець добровільно надає для обробки замовлення.",
  },
  {
    title: "Для чого використовуються дані",
    text:
      "Персональні дані використовуються для приймання та підтвердження замовлень, зв'язку з покупцем, організації доставки, інформування про статус замовлення, а також для виконання вимог законодавства.",
  },
  {
    title: "Передача третім сторонам",
    text:
      "Магазин не продає персональні дані користувачів. Дані можуть передаватися лише тим сервісам, які беруть участь у виконанні замовлення: службі доставки, платіжному сервісу або технічним підрядникам сайту в межах, необхідних для роботи магазину.",
  },
  {
    title: "Захист інформації",
    text:
      "Ми вживаємо розумних організаційних і технічних заходів для захисту персональної інформації від несанкціонованого доступу, втрати, зміни або поширення.",
  },
  {
    title: "Права користувача",
    text:
      "Користувач має право уточнити, оновити або попросити видалити свої персональні дані, якщо це не суперечить вимогам законодавства та не перешкоджає виконанню вже оформленого замовлення.",
  },
  {
    title: "Зв'язок щодо персональних даних",
    text:
      "З усіх питань щодо обробки персональних даних можна звернутися до магазину за контактами, наведеними нижче на сторінці.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <main className="page">
        <div className="container">
          <div className="crumbs">
            <Breadcrumbs
              items={[
                { href: "/", label: "Головна" },
                { label: "Політика конфіденційності" },
              ]}
            />
          </div>

          <section className="heroCard">
            <div className="pill">Юридична інформація</div>
            <h1>Політика конфіденційності</h1>
            <p>
              Ця сторінка пояснює, які дані може обробляти магазин {SITE_CONFIG.brandName},
              з якою метою вони використовуються та як покупець може звернутися з питаннями
              щодо персональної інформації.
            </p>
          </section>

          <section className="grid">
            {policyItems.map((item) => (
              <article className="card" key={item.title}>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </article>
            ))}
          </section>

          <section className="contactsCard">
            <h2>Контакти магазину</h2>
            <div className="contactList">
              <a href={SITE_CONFIG.phoneHref}>{SITE_CONFIG.phoneDisplay}</a>
              <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
              <a href={getTelegramProfileUrl()} target="_blank" rel="noreferrer">
                {SITE_CONFIG.telegramDisplay}
              </a>
              <div>{SITE_CONFIG.address}</div>
            </div>
          </section>
        </div>
      </main>

      <style>{`
        .page { background:linear-gradient(180deg,#f8f8f7 0%,#eef1f4 100%); min-height:100vh; color:#0f172a; font-family:var(--font-sans),ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
        .container { max-width:1360px; margin:0 auto; padding:24px 18px 40px; }
        .crumbs { margin-bottom:16px; }
        .heroCard, .card, .contactsCard { background:#ffffff; border:1px solid rgba(219,225,234,.95); box-shadow:0 18px 36px rgba(15,23,42,.05); }
        .heroCard { border-radius:28px; padding:30px 32px; margin-bottom:18px; background:linear-gradient(135deg,#ffffff 0%,#f5f7fa 52%,#eceff3 100%); }
        .pill { display:inline-block; background:linear-gradient(135deg,#fff4e8 0%,#f4e5d7 100%); color:#8b5e3c; padding:8px 14px; border-radius:999px; font-weight:700; font-size:14px; margin-bottom:16px; }
        .heroCard h1 { margin:0; font-size:40px; font-weight:800; letter-spacing:-.03em; }
        .heroCard p { margin:12px 0 0; max-width:820px; color:#475569; line-height:1.8; }
        .grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
        .card, .contactsCard { border-radius:22px; padding:22px; }
        .card h2, .contactsCard h2 { margin:0 0 10px; font-size:24px; font-weight:800; }
        .card p { margin:0; color:#64748b; line-height:1.8; }
        .contactsCard { margin-top:18px; }
        .contactList { display:grid; gap:10px; color:#475569; }
        .contactList a { color:#0f172a; text-decoration:none; font-weight:700; }
        @media (max-width:768px) {
          .container { padding:18px 12px 32px; }
          .heroCard { padding:20px; }
          .heroCard h1 { font-size:30px; }
          .grid { grid-template-columns:1fr; }
          .card, .contactsCard { padding:18px; }
          .card h2, .contactsCard h2 { font-size:20px; }
        }
      `}</style>
    </>
  );
}
