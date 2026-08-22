import { redirect } from "next/navigation";

import { AdminContactTabs } from "@/components/admin-contact-tabs";
import { ContactSettingsForm } from "@/components/contact-settings-form";
import { getCmsUser } from "@/lib/cms-auth";
import { getAdminContactSettings } from "@/lib/contact-service";

export default async function AdminContactSettingsPage() {
  const user = await getCmsUser();
  if (user?.role !== "admin") redirect("/admin");
  const data = await getAdminContactSettings();

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 xl:px-20">
      <header className="border-b border-[var(--line)] pb-8">
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-none tracking-[-0.04em]">Pengaturan Contact</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">Atur pengiriman email dan kanal yang terlihat oleh pengunjung tanpa memindahkan secret ke database.</p>
        <AdminContactTabs active="settings" />
      </header>
      <div className="py-10"><ContactSettingsForm settings={data.settings} health={data.health} /></div>
    </main>
  );
}
