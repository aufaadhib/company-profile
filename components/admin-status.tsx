export type AdminContentStatus = "draft" | "review" | "published" | "changes" | "archived";

const statusCopy: Record<AdminContentStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-[#eef1f3] text-[#475467]" },
  review: { label: "Dalam review", className: "bg-[#fff1e9] text-[#a83a1f]" },
  published: { label: "Published", className: "bg-[#e8f5ee] text-[#176b42]" },
  changes: { label: "Perubahan draft", className: "bg-[#fff7dc] text-[#825d00]" },
  archived: { label: "Diarsipkan", className: "bg-[#ece9f5] text-[#5b4a86]" },
};

export function AdminStatus({ status }: { status: AdminContentStatus }) {
  const copy = statusCopy[status];
  return <span className={`inline-flex min-h-7 items-center px-2.5 text-xs font-semibold ${copy.className}`}>{copy.label}</span>;
}
