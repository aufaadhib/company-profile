import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { getCmsUser } from "@/lib/cms-auth";

export default async function ProtectedAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCmsUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-svh bg-[var(--paper)]">
      <AdminNav user={user} />
      <div className="lg:pl-72">{children}</div>
    </div>
  );
}

