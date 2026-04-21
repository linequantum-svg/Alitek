const brands = ["Apple", "Samsung", "Xiaomi", "JBL", "Anker", "Plextone", "Skmei", "Sony"];

export default function BrandsSection() {
  return (
    <>
      <section className="section">
        <div className="header">
          <h2>Популярні бренди</h2>
          <div>Блок довіри для магазину</div>
        </div>
        <div className="grid">
          {brands.map((brand) => <div key={brand} className="card">{brand}</div>)}
        </div>
      </section>
      <style jsx>{`
        .section { margin-top:32px; }
        .header { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:14px; flex-wrap:wrap; }
        .header h2 { margin:0; font-size:28px; font-weight:900; }
        .header div { color:#64748b; font-weight:700; }
        .grid { display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:14px; }
        .card { background:#fff; border:1px solid #dbe1ea; border-radius:22px; padding:22px; min-height:90px; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:900; text-align:center; }
        @media (max-width:1024px) { .grid { grid-template-columns:repeat(2, minmax(0,1fr)); } }
        @media (max-width:768px) { .header h2 { font-size:24px; } .card { font-size:22px; min-height:76px; padding:16px; } }
      `}</style>
    </>
  );
}
