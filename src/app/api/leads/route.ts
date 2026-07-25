import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

/* ─── Zod Schema ──────────────────────────────────────────── */
const LeadSchema = z.object({
  name: z
    .string({ error: "Full name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),

  email: z
    .string({ error: "Email address is required" })
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be under 255 characters"),

  budgetRange: z.enum(["<$5k", "$5k-$20k", "$20k+"], {
    error: "Please select a valid budget range",
  }),

  message: z
    .string({ error: "Message is required" })
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
});

/* ─── GET /api/leads?q=search ──────────────────────────────
   Admin-only (enforced by middleware). Lists leads, optionally
   filtered by a case-insensitive match on name or email.        */
export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

    const leads = await prisma.lead.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error("[GET /api/leads]", error);
    return NextResponse.json(
      { success: false, error: "Failed to load leads." },
      { status: 500 }
    );
  }
}

/* ─── POST /api/leads ─────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Server-side validation with Zod
    const result = LeadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Persist to Neon via Prisma
    const lead = await prisma.lead.create({
      data: result.data,
      select: { id: true, status: true, createdAt: true },
    });

    return NextResponse.json(
      { success: true, id: lead.id, status: lead.status },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/leads]", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
