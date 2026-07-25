import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import {
  createSessionToken,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_MAX_AGE,
} from "@/lib/session";

const LoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email and password." },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Deliberately vague error on both "no such user" and "wrong password"
    // so we don't leak which admin emails exist.
    const invalidCredentials = () =>
      NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) return invalidCredentials();

    const passwordMatches = await verifyPassword(password, admin.passwordHash);
    if (!passwordMatches) return invalidCredentials();

    const token = await createSessionToken({ sub: admin.id, email: admin.email });

    const response = NextResponse.json({ success: true });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: AUTH_COOKIE_MAX_AGE,
    });
    return response;
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
