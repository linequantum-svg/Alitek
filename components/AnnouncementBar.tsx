import Link from "next/link";
import ContactDropdown from "@/components/ContactDropdown";
import { SITE_CONFIG } from "@/lib/site-config";

export default function AnnouncementBar() {
  return (
    <div
      style={{
        background: "linear-gradient(90deg, #0b1220 0%, #14213d 45%, #1d4ed8 100%)",
        color: "#ffffff",
        fontSize: "13px",
        fontWeight: 700,
        boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1360px",
          margin: "0 auto",
          padding: "6px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            color: "rgba(255,255,255,0.94)",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: "24px",
              padding: "0 10px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            Alitek online
          </span>
          <span>Безкоштовна доставка від 1500 грн</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>Актуальні ціни</span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <ContactDropdown />

          <Link href="/contact" style={{ color: "#ffffff", textDecoration: "none" }}>
            Контакти
          </Link>

          <a href={SITE_CONFIG.phoneHref} style={{ color: "#ffffff", textDecoration: "none" }}>
            {SITE_CONFIG.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
