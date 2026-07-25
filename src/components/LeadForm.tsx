"use client";

import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  budgetRange: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const BUDGET_OPTIONS = [
  { value: "",       label: "Select your budget range…", disabled: true },
  { value: "<$5k",   label: "Less than $5,000" },
  { value: "$5k-$20k", label: "$5,000 – $20,000" },
  { value: "$20k+",  label: "$20,000 and above" },
];

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <p role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

const EMPTY_FORM: FormData = { name: "", email: "", budgetRange: "", message: "" };

export default function LeadForm() {
  const [formData, setFormData]     = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors]         = useState<FormErrors>({});
  const [isLoading, setIsLoading]   = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  /* ── Client-Side Validation ─────────────────────────── */
  const validate = (): FormErrors => {
    const e: FormErrors = {};
    const name  = formData.name.trim();
    const email = formData.email.trim();
    const msg   = formData.message.trim();

    if (!name)              e.name = "Full name is required";
    else if (name.length < 2) e.name = "Name must be at least 2 characters";

    if (!email)             e.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                            e.email = "Please enter a valid email address";

    if (!formData.budgetRange) e.budgetRange = "Please select a budget range";

    if (!msg)               e.message = "Message is required";
    else if (msg.length < 10) e.message = "Message must be at least 10 characters";

    return e;
  };

  /* ── Change Handler — clears per-field error on type ── */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /* ── Submit ─────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus first error field for a11y
      const firstKey = Object.keys(validationErrors)[0];
      (document.getElementById(firstKey) as HTMLElement | null)?.focus();
      return;
    }

    setIsLoading(true);
    try {
      const res  = await fetch("/api/leads", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) {
          // Map Zod field errors back into form
          const fieldErrors: FormErrors = {};
          for (const [field, msgs] of Object.entries(data.errors as Record<string, string[]>)) {
            fieldErrors[field as keyof FormData] = msgs[0];
          }
          setErrors(fieldErrors);
        } else {
          setServerError(data.error ?? "Something went wrong. Please try again.");
        }
        return;
      }

      setSubmitted(true);
    } catch {
      setServerError("Network error — please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Success State ──────────────────────────────────── */
  if (submitted) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center animate-scale-in" role="status" aria-live="polite">
        {/* Animated check circle */}
        <div className="flex justify-center mb-7">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 opacity-20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path className="check-path" d="M4 12.5l5.5 5.5L20 7" />
              </svg>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-3">You&apos;re on the list! 🎉</h3>
        <p className="text-slate-400 leading-relaxed mb-2 max-w-sm mx-auto">
          Thanks for reaching out. Our team will review your submission and get back to you within{" "}
          <strong className="text-white">24 hours</strong>.
        </p>
        <p className="text-slate-500 text-sm mb-8">Keep an eye on your inbox.</p>

        <button
          onClick={() => {
            setSubmitted(false);
            setFormData(EMPTY_FORM);
            setErrors({});
          }}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2"
        >
          Submit another enquiry →
        </button>
      </div>
    );
  }

  /* ── Form ───────────────────────────────────────────── */
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="glass-card rounded-2xl p-8"
      aria-label="Lead capture form"
    >
      {/* Global server error */}
      {serverError && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {serverError}
        </div>
      )}

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
            Full Name <span className="text-indigo-400" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            autoComplete="name"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`form-input${errors.name ? " input-error" : ""}`}
          />
          {errors.name && <ErrorMsg msg={errors.name} />}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
            Email Address <span className="text-indigo-400" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@company.com"
            autoComplete="email"
            aria-required="true"
            aria-invalid={!!errors.email}
            className={`form-input${errors.email ? " input-error" : ""}`}
          />
          {errors.email && <ErrorMsg msg={errors.email} />}
        </div>

        {/* Budget Range */}
        <div>
          <label htmlFor="budgetRange" className="block text-sm font-medium text-slate-300 mb-1.5">
            Budget Range <span className="text-indigo-400" aria-hidden="true">*</span>
          </label>
          <select
            id="budgetRange"
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.budgetRange}
            className={`form-input${errors.budgetRange ? " input-error" : ""}`}
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.budgetRange && <ErrorMsg msg={errors.budgetRange} />}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1.5">
            Message <span className="text-indigo-400" aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your project, goals, and timeline…"
            rows={4}
            aria-required="true"
            aria-invalid={!!errors.message}
            className={`form-input${errors.message ? " input-error" : ""}`}
          />
          {errors.message && <ErrorMsg msg={errors.message} />}
        </div>

        {/* Submit */}
        <button
          type="submit"
          id="lead-form-submit"
          disabled={isLoading}
          className="btn-primary mt-1"
        >
          {isLoading ? (
            <>
              <Spinner />
              Sending…
            </>
          ) : (
            <>
              Send My Lead
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-600 mt-1">
          Your information is secure and will never be shared.
        </p>
      </div>
    </form>
  );
}
