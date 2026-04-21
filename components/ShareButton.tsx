"use client";

import { useState } from "react";

export default function ShareButton({
  title,
}: {
  title: string;
}) {
  const [done, setDone] = useState(false);

  async function handleShare() {
    try {
      const url = window.location.href;

      if (navigator.share) {
        await navigator.share({ title, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }

      setDone(true);
      window.setTimeout(() => setDone(false), 1400);
    } catch {}
  }

  return (
    <button
      onClick={handleShare}
      style={{
        height: "52px",
        padding: "0 20px",
        borderRadius: "16px",
        border: "1px solid #dbe1ea",
        background: "#ffffff",
        color: "#0f172a",
        fontWeight: 800,
        fontSize: "16px",
        cursor: "pointer",
      }}
    >
      {done ? "Посилання скопійовано ✓" : "Поділитися"}
    </button>
  );
}
