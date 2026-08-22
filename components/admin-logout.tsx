"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export function AdminLogout() {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await authClient.signOut();
        window.location.replace("/admin/login");
      }}
      className="min-h-11 text-left text-sm font-semibold text-white/65 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:opacity-50"
    >
      {pending ? "Keluar…" : "Keluar"}
    </button>
  );
}

