"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_CONFIG, getTelegramProfileUrl } from "@/lib/site-config";

export default function ContactPage() {
  return (
    <>
      <main className="page">
        <div className="container">
          <div className="crumbs">
            <Breadcrumbs items={[{ href: "/", label: "Головна" }, { label: "Контакти" }]} />
          </div>

          <section className="heroCard">
            <div className="pill">Зв'язок з магазином</div>
            <h1>Контакти</h1>
            <p>
              Тут зібрані основні способи зв'язку з магазином: телефон, Telegram і email.
              Якщо потрібна консультація щодо товару або замовлення, ми поруч.
            </p>
          </section>

          <div className="grid">
            <div className="card">
              <div className="cardEyebrow">Швидкий контакт</div>
              <div className="title">Телефон</div>
              <a href={SITE_CONFIG.phoneHref} className="text">{SITE_CONFIG.phoneDisplay}</a>
            </div>
            <div className="card accentCard">
              <div className="cardEyebrow">Онлайн</div>
              <div className="title">Telegram</div>
              <a href={getTelegramProfileUrl()} target="_blank" rel="noreferrer" className="text accentText">
                {SITE_CONFIG.telegramDisplay}
              </a>
            </div>
            <div className="card">
              <div className="cardEyebrow">Листування</div>
              <div className="title">Email</div>
              <a href={`mailto:${SITE_CONFIG.email}`} className="text">{SITE_CONFIG.email}</a>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .page { background:linear-gradient(180deg,#f8f8f7 0%,#eef1f4 100%); min-height:100vh; color:#0f172a; font-family:var(--font-sans),ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
        .container { max-width:1360px; margin:0 auto; padding:24px 18px 40px; }
        .crumbs { margin-bottom:16px; }
        .heroCard, .card { background:#ffffff; border:1px solid rgba(219,225,234,.95); box-shadow:0 18px 36px rgba(15,23,42,.05); }
        .heroCard { border-radius:28px; padding:30px 32px; margin-bottom:24px; background:linear-gradient(135deg,#ffffff 0%,#f5f7fa 52%,#eceff3 100%); }
        .pill { display:inline-block; background:linear-gradient(135deg,#fff4e8 0%,#f4e5d7 100%); color:#8b5e3c; padding:8px 14px; border-radius:999px; font-weight:700; font-size:14px; margin-bottom:16px; }
        h1 { margin:0; font-size:44px; font-weight:800; letter-spacing:-.03em; }
        p { margin:14px 0 0; max-width:760px; font-size:17px; line-height:1.7; color:#475569; }
        .grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; }
        .card { border-radius:22px; padding:22px; background:linear-gradient(180deg,#ffffff 0%,#fbfcfd 100%); }
        .accentCard { background:linear-gradient(180deg,#fffaf4 0%,#fff 100%); }
        .cardEyebrow { color:#8b5e3c; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; margin-bottom:10px; }
        .title { font-size:22px; font-weight:800; margin-bottom:10px; }
        .text { color:#64748b; line-height:1.8; text-decoration:none; word-break:break-word; font-weight:700; }
        .accentText { color:#9a3412; }
        @media (max-width:1024px) { .grid { grid-template-columns:1fr; } }
        @media (max-width:768px) { .container { padding:18px 12px 32px; } .heroCard { padding:20px; } h1 { font-size:32px; } p { font-size:15px; } }
      `}</style>
    </>
  );
}
