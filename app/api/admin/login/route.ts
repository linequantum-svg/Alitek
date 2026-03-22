import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getAdminCredentials, getAdminSessionValue } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body?.username || "").trim();
    const password = String(body?.password || "").trim();

    const creds = getAdminCredentials();
    const sessionValue = getAdminSessionValue();

    if (!sessionValue) {
      return NextResponse.json({ ok: false, error: "ADMIN_SESSION_SECRET is not configured" }, { status: 500 });
    }

    if (username !== creds.username || password !== creds.password) {
      return NextResponse.json({ ok: false, error: "Невірний логін або пароль" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: sessionValue,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
