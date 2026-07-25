import bcrypt from "bcryptjs";

// Node-only (uses bcryptjs). Import this ONLY in route handlers / server
// code that runs on the Node runtime — never in middleware.ts.

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
