import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "novamart_admin_session";

export function getAdminSessionValue() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_TOKEN || "";
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "change_admin_password",
  };
}

export function isAdminAuthorizedRequest(request: Request | NextRequest) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`));

  const value = match ? decodeURIComponent(match.split("=").slice(1).join("=")) : "";
  return Boolean(value) && value === getAdminSessionValue();
}

export async function isAdminAuthorizedFromCookies() {
  const store = await cookies();
  return store.get(ADMIN_SESSION_COOKIE)?.value === getAdminSessionValue();
}
