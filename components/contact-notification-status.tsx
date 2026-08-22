const statusCopy = {
  PENDING: { label: "Menunggu", className: "bg-[#fff7dc] text-[#825d00]" },
  SENT: { label: "Terkirim", className: "bg-[#e8f5ee] text-[#176b42]" },
  FAILED: { label: "Gagal", className: "bg-[#fff1e9] text-[#a83a1f]" },
  SKIPPED: { label: "Dilewati", className: "bg-[#eef1f3] text-[#475467]" },
} as const;

export type ContactNotificationStatusValue = keyof typeof statusCopy;

export function ContactNotificationStatus({ status }: { status: ContactNotificationStatusValue }) {
  const copy = statusCopy[status];
  return <span className={`inline-flex min-h-7 items-center px-2.5 text-xs font-semibold ${copy.className}`}>{copy.label}</span>;
}
