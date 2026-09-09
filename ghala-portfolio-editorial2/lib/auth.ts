import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "ghala_portfolio_admin";

function signature(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || "dev-only-secret-change-me";
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function createAdminToken() {
  const payload = `admin:${Date.now()}`;
  return `${Buffer.from(payload).toString("base64url")}.${signature(payload)}`;
}

export function verifyAdminToken(token?: string) {
  if (!token) return false;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return false;
  let payload = "";
  try { payload = Buffer.from(encoded, "base64url").toString("utf8"); } catch { return false; }
  const expected = signature(payload);
  if (sig.length !== expected.length) return false;
  const ok = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  if (!ok) return false;
  const [, timestamp] = payload.split(":");
  const age = Date.now() - Number(timestamp);
  return payload.startsWith("admin:") && age >= 0 && age < 1000 * 60 * 60 * 24 * 7;
}

export async function isAdmin() {
  const store = await cookies();
  return verifyAdminToken(store.get(COOKIE)?.value);
}

export async function setAdminCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}
