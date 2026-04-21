"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_CONFIG } from "@/lib/site-config";

const steps = [
  "Заповнити реальні контакти у файлі lib/site-config.ts.",
  "Перевірити, що NEXT_PUBLIC_SITE_URL і SITE_URL вказані правильно для продакшену.",
  "Переконатися, що PROM_FEED_URL налаштований коректно.",
  "Перевірити robots.txt та sitemap.xml перед індексацією.",
  "Протестувати оформлення замовлення через сайт і через Telegram.",
  "Перевірити favicon.svg та logo.svg у браузері після деплою.",
  "Переглянути головну, каталог, товар, кошик і контакти з телефону.",
  "Уточнити сторінку доставки та оплати під реальні умови магазину.",
  "Підключити аналітику після публікації.",
  "Зробити фінальну передзапускову перевірку перед індексацією Google.",
];

export default function LaunchChecklistPage() {
  return (
    <>
      <main className="page">
        <div className="container">
          <div className="crumbs">
            <Breadcrumbs items={[{ href: "/", label: "Головна" }, { label: "Підготовка до запуску" }]} />
          </div>

          <section className="titleCard">
            <div className="pill">Фінальна перевірка</div>
            <h1>Чекліст перед публікацією на домені</h1>
            <div className="intro">
              Бренд сайту: <strong>{SITE_CONFIG.brandName}</strong>. Це службова сторінка для фінальної
              перевірки перед запуском.
            </div>

            <div className="steps">
              {steps.map((step, index) => (
                <div key={step} className="stepCard">
                  <div className="stepNum">{index + 1}</div>
                  <div className="stepText">{step}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <style>{`
        .page { background:linear-gradient(180deg,#f8f8f7 0%,#eef1f4 100%); min-height:100vh; color:#0f172a; font-family:var(--font-sans),ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
        .container { max-width:1100px; margin:0 auto; padding:24px 18px 40px; }
        .crumbs { margin-bottom:16px; }
        .titleCard { background:#fff; border:1px solid rgba(219,225,234,.95); border-radius:28px; padding:28px; box-shadow:0 18px 36px rgba(15,23,42,.05); }
        .pill { display:inline-block; background:linear-gradient(135deg,#fff4e8 0%,#f4e5d7 100%); color:#8b5e3c; padding:8px 14px; border-radius:999px; font-weight:700; font-size:14px; margin-bottom:16px; }
        h1 { margin:0; font-size:36px; font-weight:800; letter-spacing:-.03em; }
        .intro { margin-top:12px; color:#64748b; line-height:1.8; }
        .steps { display:grid; gap:12px; margin-top:20px; }
        .stepCard { background:#f8fafc; border:1px solid #e5e7eb; border-radius:18px; padding:16px 18px; display:flex; gap:14px; align-items:flex-start; }
        .stepNum { width:32px; height:32px; border-radius:999px; background:#fff4e8; color:#9a3412; display:flex; align-items:center; justify-content:center; font-weight:800; flex-shrink:0; }
        .stepText { font-weight:700; line-height:1.7; color:#0f172a; }
        @media (max-width:768px) { .container { padding:18px 12px 32px; } .titleCard { padding:20px; } h1 { font-size:28px; } .stepCard { padding:14px; } }
      `}</style>
    </>
  );
}
