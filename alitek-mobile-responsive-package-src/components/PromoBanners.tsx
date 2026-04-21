import Link from "next/link";

const banners = [
  { title: "Акції тижня", text: "Знижки на популярні товари та аксесуари.", href: "/catalog" },
  { title: "Швидке замовлення", text: "Оформлення через Telegram, кошик та обране.", href: "/cart" },
  { title: "Підбір подарунків", text: "Добірки навушників, годинників та аксесуарів.", href: "/catalog" },
];

export default function PromoBanners() {
  return (
    <>
      <section className="section">
        <div className="header">
          <h2>Банери та акції</h2>
          <Link href="/catalog">В каталог</Link>
        </div>
        <div className="grid">
          {banners.map((banner, i) => (
            <div key={banner.title} className={`card c${i}`}>
              <div className="badge">Спецпропозиція</div>
              <div className="title">{banner.title}</div>
              <div className="text">{banner.text}</div>
              <Link href={banner.href} className="cta">Відкрити</Link>
            </div>
          ))}
        </div>
      </section>
      <style jsx>{`
        .section { margin-top:32px; }
        .header { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:14px; flex-wrap:wrap; }
        .header h2 { margin:0; font-size:28px; font-weight:900; }
        .header :global(a) { color:#2f63f6; text-decoration:none; font-weight:800; }
        .grid { display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:14px; }
        .card { color:#fff; border-radius:24px; padding:22px; min-height:210px; display:flex; flex-direction:column; }
        .c0 { background:linear-gradient(135deg, #111827 0%, #1f2937 100%); }
        .c1 { background:linear-gradient(135deg, #2f63f6 0%, #2752d8 100%); }
        .c2 { background:linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); }
        .badge { display:inline-block; align-self:flex-start; background:rgba(255,255,255,.16); border-radius:999px; padding:8px 12px; font-size:13px; font-weight:800; margin-bottom:14px; }
        .title { font-size:28px; font-weight:900; line-height:1.05; margin-bottom:10px; }
        .text { color:rgba(255,255,255,.9); line-height:1.7; }
        .cta { margin-top:auto; display:inline-flex; align-items:center; height:44px; padding:0 16px; border-radius:14px; background:#fff; color:#0f172a; text-decoration:none; font-weight:800; width:max-content; }
        @media (max-width:1024px) { .grid { grid-template-columns:1fr; } }
        @media (max-width:768px) { .header h2 { font-size:24px; } .card { min-height:0; padding:18px; } .title { font-size:24px; } }
      `}</style>
    </>
  );
}
