"use client";

import { useState } from "react";
import type { LeadModel } from "../../prisma/generated/prisma/models/Lead";
import { LeadStatus } from "../../prisma/generated/prisma/enums";

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-indigo-500/15 text-indigo-300 border-indigo-500/25",
  CONTACTED: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  CLOSED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
};

const STATUS_OPTIONS = Object.values(LeadStatus);

export default function AdminTable({ initialLeads }: { initialLeads: LeadModel[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const previous = leads;
    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus as LeadModel["status"] } : l))
    );
    setUpdatingId(id);
    setErrorId(null);

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setLeads(previous); // revert
        setErrorId(id);
      }
    } catch {
      setLeads(previous); // revert
      setErrorId(id);
    } finally {
      setUpdatingId(null);
    }
  };

  if (leads.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center text-slate-400">
        No leads found.
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-5 py-3.5 font-medium">Name</th>
              <th className="px-5 py-3.5 font-medium">Email</th>
              <th className="px-5 py-3.5 font-medium">Budget</th>
              <th className="px-5 py-3.5 font-medium">Message</th>
              <th className="px-5 py-3.5 font-medium">Received</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-4 font-medium text-white whitespace-nowrap">{lead.name}</td>
                <td className="px-5 py-4 text-slate-300 whitespace-nowrap">{lead.email}</td>
                <td className="px-5 py-4 text-slate-300 whitespace-nowrap">{lead.budgetRange}</td>
                <td className="px-5 py-4 text-slate-400 max-w-xs truncate" title={lead.message}>
                  {lead.message}
                </td>
                <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                  {new Date(lead.createdAt).toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-4">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    disabled={updatingId === lead.id}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer disabled:opacity-50 ${STATUS_STYLES[lead.status]}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="bg-[#0d1026] text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                  {errorId === lead.id && (
                    <p className="text-red-400 text-xs mt-1">Update failed — try again</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
