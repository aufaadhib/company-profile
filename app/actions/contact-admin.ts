"use server";

import "server-only";

import { revalidatePath, updateTag } from "next/cache";

import { requireCmsAdmin } from "@/lib/cms-auth";
import {
  ContactAdminError,
  resendContactNotification,
  saveContactSettings,
  sendContactTestEmail,
  updateContactSubmissionState,
} from "@/lib/contact-service";
import {
  validateContactSettingsForm,
  type ContactSettingsField,
} from "@/lib/contact-settings-validation";

export type ContactAdminActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactSettingsField, string>>;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function revalidateContactAdmin(id?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/contact");
  if (id) revalidatePath(`/admin/contact/${id}`);
}

export async function saveContactSettingsAction(
  _previousState: ContactAdminActionState,
  formData: FormData,
): Promise<ContactAdminActionState> {
  const validation = validateContactSettingsForm(formData);
  if (!validation.success) {
    return { status: "error", message: "Periksa kembali pengaturan yang ditandai.", fieldErrors: validation.errors };
  }

  try {
    const actor = await requireCmsAdmin();
    await saveContactSettings(validation.data, actor);
  } catch {
    console.error("[contact-admin] Settings update failed");
    return { status: "error", message: "Pengaturan belum dapat disimpan. Coba lagi." };
  }

  updateTag("contact-settings");
  revalidateContactAdmin();
  revalidatePath("/id/kontak");
  revalidatePath("/en/contact");
  return { status: "success", message: "Pengaturan Contact tersimpan." };
}

export async function testContactEmailAction(
  _previousState: ContactAdminActionState,
  _formData: FormData,
): Promise<ContactAdminActionState> {
  void _previousState;
  void _formData;
  try {
    const actor = await requireCmsAdmin();
    await sendContactTestEmail(actor);
    return { status: "success", message: "Email uji telah dikirim ke email publik." };
  } catch (error) {
    const message = error instanceof ContactAdminError ? error.message : "Email uji belum dapat dikirim.";
    return { status: "error", message };
  }
}

export async function contactSubmissionAction(
  _previousState: ContactAdminActionState,
  formData: FormData,
): Promise<ContactAdminActionState> {
  const id = formData.get("submissionId");
  const intent = formData.get("intent");
  if (typeof id !== "string" || !uuidPattern.test(id)) {
    return { status: "error", message: "Referensi pesan tidak valid." };
  }
  if (intent !== "read" && intent !== "unread" && intent !== "archive" && intent !== "restore" && intent !== "resend") {
    return { status: "error", message: "Tindakan tidak dikenali." };
  }

  try {
    const actor = await requireCmsAdmin();
    if (intent === "resend") await resendContactNotification(id, actor);
    else await updateContactSubmissionState(id, intent, actor);
  } catch (error) {
    revalidateContactAdmin(id);
    const message = error instanceof ContactAdminError ? error.message : "Perubahan belum dapat diproses.";
    return { status: "error", message };
  }

  revalidateContactAdmin(id);
  const message = intent === "resend"
    ? "Notifikasi email berhasil dikirim."
    : intent === "archive"
      ? "Pesan diarsipkan."
      : intent === "restore"
        ? "Pesan dipulihkan."
        : intent === "read"
          ? "Pesan ditandai sudah dibaca."
          : "Pesan ditandai belum dibaca.";
  return { status: "success", message };
}
