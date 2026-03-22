"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Не вдалося увійти");
      }
      router.push(searchParams.get("next") || "/admin/orders");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Помилка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16, background: "#f8fafc" }}>
      <section style={{ width: "100%", maxWidth: 420, background: "white", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)" }}>
        <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748b", marginBottom: 8 }}>NovaMart Admin</div>
        <h1 style={{ margin: 0, fontSize: 32, color: "#0f172a" }}>Вхід в адмінку</h1>
        <p style={{ color: "#475569", lineHeight: 1.6 }}>Увійди через логін і пароль, щоб переглядати й обробляти замовлення.</p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 20 }}>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Логін" autoComplete="username" style={{ border: "1px solid #cbd5e1", borderRadius: 14, padding: 12 }} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" autoComplete="current-password" style={{ border: "1px solid #cbd5e1", borderRadius: 14, padding: 12 }} />
          <button type="submit" disabled={loading} style={{ background: "#0f172a", color: "white", borderRadius: 14, padding: 12, border: "none", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Вхід..." : "Увійти"}
          </button>
        </form>

        {error ? <div style={{ marginTop: 14, color: "#b91c1c", fontSize: 14 }}>{error}</div> : null}
      </section>
    </main>
  );
}
