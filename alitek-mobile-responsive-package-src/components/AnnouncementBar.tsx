import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <>
      <div className="bar">
        <div className="container">
          <div className="left">Безкоштовна доставка від 1500 ₴ • Актуальні ціни з Prom</div>
          <div className="right">
            <Link href="/contact">Контакти</Link>
            <a href="tel:+380000000000">+38 (000) 000-00-00</a>
          </div>
        </div>
      </div>
      <style jsx>{`
        .bar { background:#0f172a; color:#fff; font-size:14px; font-weight:700; }
        .container { max-width:1360px; margin:0 auto; padding:10px 18px; display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; }
        .right { display:flex; gap:14px; flex-wrap:wrap; }
        .right :global(a) { color:#fff; text-decoration:none; }
        @media (max-width:768px) {
          .bar { font-size:12px; }
          .container { padding:8px 12px; }
          .left, .right { width:100%; }
          .right { justify-content:space-between; }
        }
      `}</style>
    </>
  );
}
