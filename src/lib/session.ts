import { SignJWT, jwtVerify } from "jose";

// This file must stay Edge-runtime-safe — it's imported by middleware.ts.
// No bcrypt or other Node-only APIs here. Password hashing lives in
// src/lib/password.ts, used only inside route handlers (Node runtime).

export const AUTH_COOKIE_NAME = "leaddesk_session";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours, in seconds

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not set. Add it to your environment variables."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: {
  sub: string;
  email: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${AUTH_COOKIE_MAX_AGE}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<{ sub: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return { sub: payload.sub as string, email: payload.email as string };
  } catch {
    return null;
  }
}
