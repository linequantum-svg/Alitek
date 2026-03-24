"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AdminLoginContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin Login</h1>
      <form method="POST" action="/api/admin/login">
        <input type="hidden" name="next" value={next} />

        <div style={{ marginBottom: 12 }}>
          <label>
            Username
            <br />
            <input name="username" type="text" required />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Password
            <br />
            <input name="password" type="password" required />
          </label>
        </div>

        <button type="submit">Login</button>
      </form>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main style={{ padding: 24 }}>Loading...</main>}>
      <AdminLoginContent />
    </Suspense>
  );
}