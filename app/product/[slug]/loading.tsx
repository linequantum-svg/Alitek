export default function ProductLoading() {
  return (
    <main
      style={{
        background: "linear-gradient(180deg,#f8f8f7 0%,#eef1f4 100%)",
        minHeight: "100vh",
        color: "#0f172a",
        fontFamily:
          'var(--font-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "24px 18px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
          <div className="sk" style={{ width: 260, height: 20, borderRadius: 999 }} />
          <div style={{ display: "flex", gap: 12 }}>
            <div className="sk" style={{ width: 132, height: 52, borderRadius: 16 }} />
            <div className="sk" style={{ width: 132, height: 52, borderRadius: 16 }} />
          </div>
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(340px,.9fr)", gap: 20, alignItems: "start" }}>
          <div style={{ background: "#fff", border: "1px solid rgba(219,225,234,.95)", boxShadow: "0 18px 36px rgba(15,23,42,.05)", borderRadius: 28, padding: 24 }}>
            <div className="sk" style={{ height: 560, borderRadius: 24, marginBottom: 14 }} />
            <div className="sk" style={{ width: "72%", height: 18, borderRadius: 12, marginBottom: 10 }} />
            <div className="sk" style={{ width: "58%", height: 18, borderRadius: 12 }} />
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ background: "#fff", border: "1px solid rgba(219,225,234,.95)", boxShadow: "0 18px 36px rgba(15,23,42,.05)", borderRadius: 28, padding: 26 }}>
              <div className="sk" style={{ width: 120, height: 34, borderRadius: 999, marginBottom: 16 }} />
              <div className="sk" style={{ width: "86%", height: 54, borderRadius: 18, marginBottom: 14 }} />
              <div className="sk" style={{ width: "30%", height: 18, borderRadius: 12, marginBottom: 18 }} />
              <div className="sk" style={{ width: "100%", height: 120, borderRadius: 22, marginBottom: 16 }} />
              <div className="sk" style={{ width: "100%", height: 52, borderRadius: 16, marginBottom: 10 }} />
              <div className="sk" style={{ width: "100%", height: 52, borderRadius: 16, marginBottom: 10 }} />
              <div className="sk" style={{ width: "100%", height: 52, borderRadius: 16 }} />
            </div>
            <div style={{ background: "#fff", border: "1px solid rgba(219,225,234,.95)", boxShadow: "0 18px 36px rgba(15,23,42,.05)", borderRadius: 28, padding: 26 }}>
              <div className="sk" style={{ width: 220, height: 26, borderRadius: 14, marginBottom: 14 }} />
              <div className="sk" style={{ width: "100%", height: 18, borderRadius: 12, marginBottom: 10 }} />
              <div className="sk" style={{ width: "88%", height: 18, borderRadius: 12 }} />
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .sk {
          background: linear-gradient(90deg, #eef2f7 25%, #dde5ee 37%, #eef2f7 63%);
          background-size: 400% 100%;
          animation: alitek-shimmer 1.3s ease infinite;
        }
        @keyframes alitek-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @media (max-width: 1120px) {
          section { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 720px) {
          main > div { padding: 18px 12px 32px !important; }
          section > div { border-radius: 22px !important; padding: 18px !important; }
          section > div:first-child .sk:first-child { height: 300px !important; }
        }
      `}</style>
    </main>
  );
}