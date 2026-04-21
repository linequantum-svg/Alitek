import Link from "next/link";

export type BreadcrumbItem = {
  href?: string;
  label: string;
};

export default function Breadcrumbs({
  items,
}: {
  items: BreadcrumbItem[];
}) {
  return (
    <nav
      aria-label="breadcrumb"
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        alignItems: "center",
        fontSize: "14px",
        color: "#64748b",
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span
            key={`${item.label}-${index}`}
            style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}
          >
            {item.href && !isLast ? (
              <Link
                href={item.href}
                style={{
                  textDecoration: "none",
                  color: "#2f63f6",
                  fontWeight: 700,
                }}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ fontWeight: isLast ? 700 : 500, color: isLast ? "#0f172a" : "#64748b" }}>
                {item.label}
              </span>
            )}

            {!isLast ? <span style={{ color: "#94a3b8" }}>/</span> : null}
          </span>
        );
      })}
    </nav>
  );
}
