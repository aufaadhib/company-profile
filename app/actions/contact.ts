"use server";

import "server-only";

import { headers } from "next/headers";

import { ContactRateLimitError, createContactSubmission, verifyTurnstile } from "@/lib/contact-service";
import { validateContactForm, type ContactFormState, type ContactLocale } from "@/lib/contact-validation";

function messages(locale: ContactLocale) {
  return locale === "id"
    ? {
        invalid: "Periksa kembali isian yang ditandai.",
        security: "Verifikasi keamanan tidak valid atau sudah kedaluwarsa. Silakan ulangi.",
        limited: "Terlalu banyak percobaan. Coba lagi dalam 15 menit atau gunakan kanal langsung.",
        failed: "Pesan belum dapat dikirim. Coba lagi atau hubungi kami melalui email, telepon, atau WhatsApp.",
        success: "Pesan Anda sudah tersimpan dan notifikasi telah dikirim kepada tim Afana.",
        stored: "Pesan Anda sudah tersimpan dan akan ditinjau oleh tim Afana.",
        warning: "Pesan Anda sudah tersimpan, tetapi notifikasi email gagal dikirim. Agar segera diketahui, hubungi Afana melalui kanal langsung.",
      }
    : {
        invalid: "Review the highlighted fields.",
        security: "The security verification is invalid or has expired. Please try again.",
        limited: "Too many attempts. Try again in 15 minutes or use a direct channel.",
        failed: "Your message could not be sent. Try again or contact us by email, phone, or WhatsApp.",
        success: "Your message has been saved and the Afana team has been notified.",
        stored: "Your message has been saved and will be reviewed by the Afana team.",
        warning: "Your message has been saved, but the email notification could not be sent. Use a direct channel if your request is urgent.",
      };
}

function requestIp(headerStore: Headers) {
  const value = headerStore.get("x-vercel-forwarded-for") ?? headerStore.get("x-forwarded-for");
  return value?.split(",")[0]?.trim() || null;
}

function safeErrorCode(error: unknown) {
  if (error && typeof error === "object" && "code" in error && typeof error.code === "string") return error.code;
  return error instanceof Error ? error.name : "UNKNOWN";
}

/** Public Server Action for the bilingual contact form. */
export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const validation = validateContactForm(formData);

  if (!validation.success) {
    if (validation.isBot) return { status: "success", message: messages(validation.locale).success };
    return { status: "error", message: messages(validation.locale).invalid, fieldErrors: validation.errors };
  }

  const copy = messages(validation.data.locale);

  try {
    const headerStore = await headers();
    const remoteIp = requestIp(headerStore);
    const isHuman = await verifyTurnstile(validation.data.turnstileToken, remoteIp);

    if (!isHuman) {
      return {
        status: "error",
        message: copy.security,
        fieldErrors: { turnstile: copy.security },
      };
    }

    const result = await createContactSubmission(validation.data, remoteIp);
    if (result.outcome === "sent") return { status: "success", message: copy.success };
    if (result.outcome === "skipped") return { status: "success", message: copy.stored };
    return { status: "warning", message: copy.warning };
  } catch (error) {
    if (error instanceof ContactRateLimitError) return { status: "error", message: copy.limited };
    console.error("[contact] Submission failed", { code: safeErrorCode(error) });
    return { status: "error", message: copy.failed };
  }
}
