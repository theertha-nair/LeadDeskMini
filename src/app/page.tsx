import LeadForm from "@/components/LeadForm";
import Link from "next/link";

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Setup",
    desc: "Drop in your form and start collecting qualified leads in under 2 minutes. No code required.",
  },
  {
    icon: "🔒",
    title: "Enterprise Security",
    desc: "All data encrypted at rest and in transit. Powered by Neon Postgres with automatic backups.",
  },
  {
    icon: "📊",
    title: "Pipeline Clarity",
    desc: "Track every lead from NEW → CONTACTED → CLOSED in one clean, distraction-free dashboard.",
  },
];

const STATS = [
  { value: "2,400+", label: "Leads Captured" },
  { value: "94%", label: "Avg Conversion Lift" },
  { value: "< 2 min", label: "Setup Time" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080b14] text-white overflow-x-hidden">

      {/* ── Fixed Decorative Orbs ───────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="animate-float absolute top-[15%] left-[10%] w-[480px] h-[480px] rounded-full bg-indigo-600/15 blur-[100px]" />
        <div className="animate-float2 absolute top-[60%] right-[8%] w-[400px] h-[400px] rounded-full bg-purple-600/15 blur-[90px]" />
        <div className="absolute top-[40%] left-[50%] w-[320px] h-[320px] rounded-full bg-cyan-500/8 blur-[80px]" />
        <div className="bg-grid absolute inset-0 opacity-100" />
      </div>

      {/* ── Navbar ──────────────────────────────────────────── */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">
            LeadDesk <span className="text-indigo-400">Mini</span>
          </span>
        </div>
        <a
          href="#capture"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200"
        >
          Get Started
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center text-center px-4 pt-14 pb-28">
        {/* Beta badge */}
        <div className="animate-fade-in-up mb-7 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10 text-indigo-300 text-sm font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-badge-pulse inline-block shrink-0" />
          Now in Public Beta &mdash; Free for early adopters
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up-d1 text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight leading-[1.08] mb-6 max-w-4xl">
          Capture Every Lead.{" "}
          <span className="gradient-text">Miss&nbsp;Nothing.</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-up-d2 text-lg sm:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          LeadDesk Mini is the lightweight CRM built for solopreneurs and agencies who need pipeline clarity — without the enterprise bloat or the enterprise price tag.
        </p>

        {/* Stats row */}
        <div className="animate-fade-in-up-d3 flex flex-wrap justify-center gap-10 mb-12">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-white mb-0.5">{s.value}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <div className="animate-fade-in-up-d4 flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#capture"
            id="hero-cta"
            className="animate-pulse-ring inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-base hover:shadow-[0_0_48px_rgba(99,102,241,0.5)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Start Capturing Leads
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <span className="text-sm text-slate-500">No credit card required</span>
        </div>

        {/* Floating trust badges */}
        <div className="animate-fade-in-up-d5 flex flex-wrap justify-center gap-3 mt-10">
          {["✓ GDPR Compliant", "✓ SSL Encrypted", "✓ 99.9% Uptime SLA"].map((t) => (
            <span key={t} className="text-xs text-slate-500 bg-white/5 border border-white/5 rounded-full px-3 py-1">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features Strip ──────────────────────────────────── */}
      <section className="relative z-10 py-16 border-y border-white/[0.05]" aria-labelledby="features-heading">
        <div className="max-w-5xl mx-auto px-4">
          <h2 id="features-heading" className="sr-only">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="glass-card rounded-2xl p-7 group hover:border-indigo-500/20 hover:shadow-[0_0_32px_rgba(99,102,241,0.12)] transition-all duration-300"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lead Capture Form ────────────────────────────────── */}
      <section id="capture" className="relative z-10 py-28 px-4" aria-labelledby="form-heading">
        <div className="max-w-lg mx-auto">
          {/* Section header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Start Today
            </div>
            <h2 id="form-heading" className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Ready to Fill Your Pipeline?
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Tell us a bit about your project and we&apos;ll get you set up within 24 hours.
            </p>
          </div>

          <LeadForm />
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.05] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-400">LeadDesk Mini</span>
          </div>
          <p className="text-sm text-slate-500 text-center">
            Built for{" "}
            <Link
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 underline underline-offset-2 decoration-indigo-400/40 hover:decoration-indigo-300"
            >
              Digital Heroes Training Task
            </Link>
          </p>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} LeadDesk Mini. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
