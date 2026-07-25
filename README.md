# LeadDesk Mini

A small full-stack lead-capture product built for the Digital Heroes Full Stack Development qualification task. It has a public landing page with a validated lead form, and a password-protected admin dashboard for triaging incoming leads.

**Live app:** lead-desk-mini-beige.vercel.app
**Admin dashboard:** lead-desk-mini-beige.vercel.app/admin

---

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Prisma 7** + **Postgres** (hosted on [Neon](https://neon.tech))
- **Tailwind CSS 4**
- **Zod** for request validation
- **bcryptjs** + **jose** for authentication (see reasoning below)
- Deployed on **Vercel**

---

## Data model

```prisma
model Lead {
  id          String     @id @default(cuid())
  name        String
  email       String
  budgetRange String
  message     String
  status      LeadStatus @default(NEW)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum LeadStatus {
  NEW
  CONTACTED
  CLOSED
}

model AdminUser {
  id           String @id @default(cuid())
  email        String @unique
  passwordHash String
}
```

**Why `status` is an enum, not a free-text string.** The admin table only ever needs to move a lead through three known states. An enum makes invalid states (typos, arbitrary values) impossible at the database level, and keeps the status dropdown in the UI a closed, predictable set instead of something that could drift over time.

**Why `AdminUser` is separate from `Lead`.** These are two entirely different kinds of entity — leads are the data being managed, admins are the people managing it. Keeping them as separate models (rather than, say, a `role` flag on some shared `User` table) keeps the schema honest about what this app actually is: a small internal tool with one class of user on the inside, not a multi-role SaaS product.

**Why `passwordHash`, never a plaintext password field.** Passwords are hashed with bcrypt before they ever touch the database, so even direct database access never exposes a usable password.

---

## Auth approach

The brief specifically asks for real login — "not a hardcoded string" — so the admin area is protected with:

1. **bcrypt-hashed passwords** — `AdminUser.passwordHash` is never the raw password. Login compares the submitted password against the hash with `bcrypt.compare`.
2. **Signed, httpOnly session cookies** — On successful login, the server signs a short-lived JWT (via `jose`, HMAC-SHA256) containing the admin's id and email, and sets it as an `httpOnly`, `sameSite=lax` cookie. It can't be read or forged from client-side JavaScript, and it expires automatically after 8 hours.
3. **Middleware, not just UI hiding** — `src/middleware.ts` checks the session cookie on every request to `/admin/*` and on every non-POST request to `/api/leads/*` (the public form still needs unauthenticated `POST /api/leads` to work — that's the one deliberate exception). An unauthenticated request to `/admin` is redirected to `/login`; an unauthenticated request to the admin API routes gets a `401`, not just a UI that fails silently. This means the protection lives at the routing layer, not just in what the page happens to render.

**Why a custom JWT-in-a-cookie instead of a heavier library.** For one admin role and no third-party sign-in, a full auth library adds configuration surface without adding real security. This approach is small enough to read top to bottom in `src/lib/auth.ts` and `src/middleware.ts`, and it uses the same two guarantees any auth system needs: a properly hashed password and a token that can't be tampered with client-side.

---

## Setup

```bash
git clone https://github.com/theertha-nair/LeadDeskMini.git
cd LeadDeskMini
npm install

cp .env.example .env
# then fill in DATABASE_URL and AUTH_SECRET in .env
# generate a secret with: openssl rand -hex 32

npx prisma migrate deploy   # applies the existing migration to your database
npm run db:seed             # creates one admin login (see console output for the password)

npm run dev                 # http://localhost:3000
```

Default seeded admin login (override via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env` before seeding):
- **Email:** `admin@leaddeskmini.com`
- **Password:** `ChangeMe123!`

## API contract

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/leads` | Public | Submits a new lead. Validates with Zod; returns `400` with field errors on invalid input. |
| `GET` | `/api/leads?q=` | Admin | Lists leads, optionally filtered by name/email match. |
| `PATCH` | `/api/leads/:id` | Admin | Updates a lead's `status`. |
| `POST` | `/api/auth/login` | Public | Verifies credentials, sets the session cookie. |
| `POST` | `/api/auth/logout` | — | Clears the session cookie. |

## Testing the API directly

`test-api.ps1` and `test-api-invalid.ps1` (PowerShell) exercise the valid and invalid submission paths against a local dev server. They build the request body as a PowerShell object and pipe it through `ConvertTo-Json`, rather than hand-writing an escaped JSON string — the latter is what breaks in PowerShell, since its own `$` and `"` handling mangles inline JSON before curl ever sees it.

## AI usage

_[Add your paragraph here: where you used Claude/Antigravity, and specifically what you changed after the first pass. Be concrete — e.g. what it got right on its own, and one thing you rewrote or reconsidered.]_
