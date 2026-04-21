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

          <div className="footerColumn">
            <div className="footerTitle">Навігація</div>

            <Link href="/catalog" className="footerLink">
              Каталог
            </Link>
            <Link href="/favorites" className="footerLink">
              Обране
            </Link>
            <Link href="/contact" className="footerLink">
              Контакти
            </Link>
            <Link href="/delivery-payment" className="footerLink">
              Доставка та оплата
            </Link>
          </div>

          <div className="footerColumn">
            <div className="footerTitle">Контакти</div>

            <a href={SITE_CONFIG.phoneHref} className="footerLink">
              {SITE_CONFIG.phoneDisplay}
            </a>
            <a href={getTelegramProfileUrl()} target="_blank" rel="noreferrer" className="footerLink">
              {SITE_CONFIG.telegramDisplay}
            </a>
            <a href={`mailto:${SITE_CONFIG.email}`} className="footerLink">
              {SITE_CONFIG.email}
            </a>
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
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 24px;
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
        .footerColumn {
          display: grid;
          gap: 10px;
          align-content: start;
        }
        .footerTitle {
          font-size: 18px;
          font-weight: 900;
          margin-bottom: 12px;
          color: #0f172a;
        }
        .footerLink {
          color: #0f172a;
          text-decoration: none;
          font-weight: 600;
        }
        @media (max-width: 900px) {
          .footerInner {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 720px) {
          .footerInner {
            grid-template-columns: 1fr;
            padding: 24px 12px 32px;
            gap: 20px;
          }
          .footerLogoFull {
            width: 200px;
          }
        }
      `}</style>
    </>
  );
}



