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
    label: SITE_CONFIG.phoneDisplay,
    href: SITE_CONFIG.phoneHref,
    color: "#22c55e",
    icon: "phone" as const,
    external: false,
  },
  {
    label: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
    color: "#2d9bf0",
    icon: "mail" as const,
    external: false,
  },
];

export default function FloatingContactWidget() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div className="widgetRoot" ref={rootRef}>
      <div className={`stack ${open ? "stackOpen" : ""}`}>
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="iconButton"
            title={item.label}
            aria-label={item.label}
            style={{ background: item.color }}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noreferrer" : undefined}
          >
            <ContactIcon name={item.icon} size={22} />
          </a>
        ))}

        <Link href="/contact" className="iconButton" title="Контакти" aria-label="Контакти" style={{ background: "#7c3aed" }}>
          <ContactIcon name="chat" size={22} />
        </Link>
      </div>

      <button
        type="button"
        className={`toggle ${open ? "toggleOpen" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Закрити контакти" : "Відкрити контакти"}
      >
        <ContactIcon name={open ? "close" : "mail"} size={24} />
      </button>

      <style jsx>{`
        .widgetRoot {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 60;
          display: grid;
          justify-items: end;
          gap: 12px;
        }
        .stack {
          display: grid;
          gap: 12px;
          opacity: 0;
          transform: translateY(8px);
          pointer-events: none;
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .stackOpen {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .iconButton,
        .toggle {
          width: 58px;
          height: 58px;
          border-radius: 999px;
          border: 4px solid rgba(255, 255, 255, 0.92);
          box-shadow: 0 14px 28px rgba(15, 23, 42, 0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          text-decoration: none;
        }
        .toggle {
          border: none;
          background: #2d9bf0;
          cursor: pointer;
        }
        .toggleOpen {
          background: #c04b4b;
        }
        @media (max-width: 720px) {
          .widgetRoot {
            right: 14px;
            bottom: 14px;
          }
          .iconButton,
          .toggle {
            width: 54px;
            height: 54px;
          }
        }
      `}</style>
    </div>
  );
}
