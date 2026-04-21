"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ContactIcon } from "@/components/ContactIcons";
import { SITE_CONFIG, getTelegramProfileUrl } from "@/lib/site-config";

const items = [
  {
    label: "Telegram",
    href: getTelegramProfileUrl(),
    color: "#2AABEE",
    icon: "telegram" as const,
    external: true,
  },
  {
    label: "Viber",
    href: SITE_CONFIG.phoneHref,
    color: "#7360f2",
    icon: "viber" as const,
    external: false,
  },
  {
    label: "WhatsApp",
    href: SITE_CONFIG.phoneHref,
    color: "#22c55e",
    icon: "whatsapp" as const,
    external: false,
  },
  {
    label: SITE_CONFIG.phoneDisplay,
    href: SITE_CONFIG.phoneHref,
    color: "#16a34a",
    icon: "phone" as const,
    external: false,
  },
  {
    label: "Передзвоніть мені",
    href: "/contact",
    color: "#2d9bf0",
    icon: "callback" as const,
    external: false,
  },
];

export default function ContactDropdown() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="dropdownRoot" ref={rootRef}>
      <button
        type="button"
        className={`dropdownButton ${open ? "dropdownButtonOpen" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="dropdownIcon">
          <ContactIcon name="phone" size={16} />
        </span>
        <span>Зв&apos;язатися з нами</span>
        <span className={`dropdownChevron ${open ? "dropdownChevronOpen" : ""}`}>
          <ContactIcon name="chevron" size={14} />
        </span>
      </button>

      {open ? (
        <div className="dropdownPanel" role="menu">
          {items.map((item) =>
            item.href.startsWith("/") ? (
              <Link
                key={item.label}
                href={item.href}
                className="dropdownItem"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <span className="itemBadge" style={{ background: item.color }}>
                  <ContactIcon name={item.icon} size={18} />
                </span>
                <span>{item.label}</span>
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="dropdownItem"
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <span className="itemBadge" style={{ background: item.color }}>
                  <ContactIcon name={item.icon} size={18} />
                </span>
                <span>{item.label}</span>
              </a>
            )
          )}
        </div>
      ) : null}

      <style jsx>{`
        .dropdownRoot {
          position: relative;
        }
        .dropdownButton {
          min-height: 26px;
          border: none;
          background: transparent;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0;
          font: inherit;
          cursor: pointer;
        }
        .dropdownButtonOpen {
          opacity: 0.95;
        }
        .dropdownIcon {
          display: inline-flex;
          color: #7dd3fc;
        }
        .dropdownChevron {
          display: inline-flex;
          color: #ffffff;
          transition: transform 0.18s ease;
        }
        .dropdownChevronOpen {
          transform: rotate(180deg);
        }
        .dropdownPanel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: min(340px, calc(100vw - 24px));
          padding: 14px;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid #dbe1ea;
          box-shadow: 0 18px 48px rgba(15, 23, 42, 0.18);
          display: grid;
          gap: 8px;
          z-index: 30;
        }
        .dropdownItem {
          min-height: 52px;
          padding: 0 10px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 14px;
          color: #0f172a;
          text-decoration: none;
          font-size: 15px;
          font-weight: 700;
        }
        .dropdownItem:hover {
          background: #f8fafc;
        }
        .itemBadge {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
        }
      `}</style>
    </div>
  );
}
