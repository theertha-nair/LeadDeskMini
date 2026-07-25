import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const StatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]),
});

/* ─── PATCH /api/leads/:id ─────────────────────────────────
   Admin-only (enforced by middleware). Updates a lead's status. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = StatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: { status: result.data.status },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("[PATCH /api/leads/:id]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update lead. It may not exist." },
      { status: 404 }
    );
  }
}
