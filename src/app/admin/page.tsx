import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/session";
import AdminTable from "@/components/AdminTable";
import LogoutButton from "@/components/LogoutButton";

export const metadata = {
  title: "Admin Dashboard — LeadDesk Mini",
};

// Always fetch fresh data — this is a live operational dashboard, not a static page.
export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  // Middleware already guarantees a valid session reaches this far;
  // we just read it here to display who's signed in.
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

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

  return (
    <div className="min-h-screen bg-[#080b14] text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Leads Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              {session?.email && <>Signed in as {session.email} &middot; </>}
              {leads.length} lead{leads.length === 1 ? "" : "s"}
              {q && <> matching &ldquo;{q}&rdquo;</>}
            </p>
          </div>
          <LogoutButton />
        </header>

        <form action="/admin" method="get" className="mb-6">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by name or email…"
            className="form-input max-w-sm"
            aria-label="Search leads by name or email"
          />
        </form>

        <AdminTable initialLeads={leads} />
      </div>
    </div>
  );
}
