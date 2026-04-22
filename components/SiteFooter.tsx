"use client";

import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG, getTelegramProfileUrl } from "@/lib/site-config";

export default function SiteFooter() {
  return (
    <>
      <footer className="footerRoot">
        <div className="footerInner">
          <div>
            <div className="brandRow">
              <Image
                src="/65acd4cf-32e0-4b06-9672-c6d8b0c4bed6.png"
                alt="Alitek"
                width={250}
                height={78}
                className="footerLogoFull"
              />
            </div>

            <div className="brandText">
              Надійний магазин техніки й аксесуарів зі зручним каталогом і простим оформленням замовлення.
            </div>
          </div>

          <div className="footerInfoGrid">
            <div className="footerInfoHead">Навігація</div>
            <div />
            <div className="footerInfoHead">Контакти</div>

            <Link href="/catalog" className="footerLink">
              Каталог
            </Link>
            <Link href="/privacy-policy" className="footerLink">
              Політика конфіденційності
            </Link>
            <a href={SITE_CONFIG.phoneHref} className="footerLink">
              {SITE_CONFIG.phoneDisplay}
            </a>

            <Link href="/favorites" className="footerLink">
              Обране
            </Link>
            <Link href="/returns-exchange" className="footerLink">
              Повернення та обмін
            </Link>
            <a href={getTelegramProfileUrl()} target="_blank" rel="noreferrer" className="footerLink">
              {SITE_CONFIG.telegramDisplay}
            </a>

            <Link href="/contact" className="footerLink">
              Контакти
            </Link>
            <Link href="/public-offer" className="footerLink">
              Публічна оферта
            </Link>
            <a href={`mailto:${SITE_CONFIG.email}`} className="footerLink">
              {SITE_CONFIG.email}
            </a>

            <Link href="/delivery-payment" className="footerLink footerWideLink">
              Доставка та оплата
            </Link>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .footerRoot {
          margin-top: 40px;
          border-top: 1px solid #dbe1ea;
          background: #ffffff;
        }
        .footerInner {
          max-width: 1360px;
          margin: 0 auto;
          padding: 28px 18px 36px;
          display: grid;
          grid-template-columns: 1.4fr minmax(0, 2.1fr);
          gap: 24px;
          align-items: start;
        }
        .brandRow {
          display: inline-flex;
          align-items: center;
          margin-bottom: 12px;
        }
        .footerLogoFull {
          display: block;
          width: 250px;
          height: auto;
        }
        .brandText {
          color: #64748b;
          line-height: 1.7;
          max-width: 520px;
        }
        .footerInfoGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px 28px;
          align-content: start;
          min-width: 0;
        }
        .footerColumn {
          display: grid;
          gap: 10px;
          align-content: start;
        }
        .footerInfoHead {
          font-size: 18px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 8px;
        }
        .footerTitle {
          font-size: 18px;
          font-weight: 900;
          margin-bottom: 12px;
          color: #0f172a;
        }
        .footerLink {
          color: #111827;
          text-decoration: none !important;
          font-weight: 700;
          min-width: 0;
          word-break: break-word;
          transition: color 0.18s ease, transform 0.18s ease, opacity 0.18s ease;
        }
        .footerInfoGrid :global(a),
        .footerInfoGrid :global(a:visited),
        .footerInfoGrid :global(a:hover),
        .footerInfoGrid :global(a:active),
        .footerInfoGrid :global(a:focus) {
          color: #111827 !important;
          text-decoration: none !important;
        }
        .footerInfoGrid :global(a:hover),
        .footerInfoGrid :global(a:focus-visible) {
          color: #2563eb !important;
          transform: translateX(2px);
        }
        .footerWideLink {
          grid-column: 1 / 2;
        }
        @media (max-width: 900px) {
          .footerInner {
            grid-template-columns: 1fr;
          }
          .footerInfoGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .footerInfoHead:nth-child(3) {
            grid-column: 1 / -1;
            margin-top: 8px;
          }
          .footerWideLink {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 720px) {
          .footerInner {
            grid-template-columns: 1fr;
            padding: 24px 12px 32px;
            gap: 20px;
          }
          .footerInfoGrid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .footerInfoHead {
            margin: 8px 0 0;
          }
          .footerLogoFull {
            width: 200px;
          }
        }
      `}</style>
    </>
  );
}



