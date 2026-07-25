"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 disabled:opacity-50"
    >
      {isLoading ? "Signing out…" : "Sign Out"}
    </button>
  );
}
