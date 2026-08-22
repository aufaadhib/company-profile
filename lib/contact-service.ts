import "server-only";

import { createHmac } from "node:crypto";
import { unstable_cache } from "next/cache";
import { Resend } from "resend";

import { Prisma } from "@/generated/prisma/client";
import { ContactTopic, NotificationStatus } from "@/generated/prisma/enums";
import type { CmsUser } from "@/lib/cms-auth";
import type { ContactSettingsData } from "@/lib/contact-settings-validation";
import { getContactExpiryDate, type ContactInput, type ContactTopicValue } from "@/lib/contact-validation";
import { getPrisma } from "@/lib/prisma";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const CONTACT_SETTINGS_ID = "primary";
const INBOX_PAGE_SIZE = 20;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class ContactRateLimitError extends Error {}
export class ContactAdminError extends Error {}

const topicLabels: Record<ContactTopicValue, { id: string; en: string }> = {
  GENERAL: { id: "Umum", en: "General" },
  ELECTRICAL_SOLUTIONS: { id: "Solusi kelistrikan", en: "Electrical solutions" },
  PARTNERSHIP: { id: "Kemitraan", en: "Partnership" },
  PROCUREMENT: { id: "Pengadaan", en: "Procurement" },
  CAREER: { id: "Karier", en: "Careers" },
  MEDIA: { id: "Media & Informasi", en: "Media & Information" },
};

type TurnstileResponse = {
  success?: boolean;
  action?: string;
};

type ContactSettingsRecord = {
  autoEmailEnabled: boolean;
  publicEmail: string;
  showEmail: boolean;
  senderName: string;
  senderEmail: string;
  phone: string;
  showPhone: boolean;
  whatsapp: string;
  showWhatsapp: boolean;
  location: string;
  showLocation: boolean;
};

export type PublicContactSettings = Pick<
  ContactSettingsData,
  "publicEmail" | "showEmail" | "phone" | "showPhone" | "whatsapp" | "showWhatsapp" | "location" | "showLocation"
>;

export type ContactInboxState = "all" | "unread" | "sent" | "failed" | "skipped" | "archived";

export type ContactInboxFilters = {
  state: ContactInboxState;
  topic: ContactTopicValue | "all";
  query: string;
  page: number;
};

function defaultSettings(): ContactSettingsData {
  return {
    autoEmailEnabled: true,
    publicEmail: "info@afana.id",
    showEmail: true,
    senderName: process.env.RESEND_FROM_NAME?.trim() || "Afana",
    senderEmail: process.env.RESEND_FROM_EMAIL?.trim().toLowerCase() || "noreply@afana.id",
    phone: "081331096250",
    showPhone: true,
    whatsapp: "081331096250",
    showWhatsapp: true,
    location: "Banyuwangi",
    showLocation: true,
  };
}

function resolveSettings(record: ContactSettingsRecord | null): ContactSettingsData {
  return record ?? defaultSettings();
}

const loadContactSettings = unstable_cache(
  () => getPrisma().contactSettings.findUnique({ where: { id: CONTACT_SETTINGS_ID } }),
  ["contact-settings"],
  { tags: ["contact-settings"], revalidate: 60 * 60 },
);

export async function getPublicContactSettings(): Promise<PublicContactSettings> {
  const settings = resolveSettings(await loadContactSettings());
  return {
    publicEmail: settings.publicEmail,
    showEmail: settings.showEmail,
    phone: settings.phone,
    showPhone: settings.showPhone,
    whatsapp: settings.whatsapp,
    showWhatsapp: settings.showWhatsapp,
    location: settings.location,
    showLocation: settings.showLocation,
  };
}

export async function getAdminContactSettings() {
  const settings = resolveSettings(await getPrisma().contactSettings.findUnique({ where: { id: CONTACT_SETTINGS_ID } }));
  return {
    settings,
    health: {
      resendApiKey: Boolean(process.env.RESEND_API_KEY),
      turnstileSiteKey: Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
      turnstileSecret: Boolean(process.env.TURNSTILE_SECRET_KEY),
      rateLimitSecret: Boolean(process.env.CONTACT_RATE_LIMIT_SECRET),
    },
  };
}

export async function saveContactSettings(settings: ContactSettingsData, actor: CmsUser) {
  const prisma = getPrisma();
  await prisma.$transaction([
    prisma.contactSettings.upsert({
      where: { id: CONTACT_SETTINGS_ID },
      create: { id: CONTACT_SETTINGS_ID, ...settings },
      update: settings,
    }),
    prisma.auditLog.create({
      data: {
        actorId: actor.id,
        action: "CONTACT_SETTINGS_UPDATED",
        entityType: "ContactSettings",
        entityId: CONTACT_SETTINGS_ID,
        metadata: {
          autoEmailEnabled: settings.autoEmailEnabled,
          showEmail: settings.showEmail,
          showPhone: settings.showPhone,
          showWhatsapp: settings.showWhatsapp,
          showLocation: settings.showLocation,
        },
      },
    }),
  ]);
}

/** Verifies the single-use Turnstile token before any database mutation. */
export async function verifyTurnstile(token: string, remoteIp: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("TURNSTILE_SECRET_KEY is not configured.");

  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) return false;
  const result = (await response.json()) as TurnstileResponse;
  return result.success === true && result.action === "contact";
}

function getSourceHash(remoteIp: string | null, email: string) {
  const secret = process.env.CONTACT_RATE_LIMIT_SECRET;
  if (!secret) throw new Error("CONTACT_RATE_LIMIT_SECRET is not configured.");

  return createHmac("sha256", secret).update(remoteIp ?? email).digest("hex");
}

function emailText(input: Pick<ContactInput, "name" | "email" | "phone" | "topic" | "locale" | "message">, submissionId: string) {
  const topic = topicLabels[input.topic][input.locale];
  return [
    "Pesan baru dari website Afana",
    "",
    `Referensi: ${submissionId}`,
    `Bahasa: ${input.locale.toUpperCase()}`,
    `Topik: ${topic}`,
    `Nama: ${input.name}`,
    `Email: ${input.email}`,
    `Telepon: ${input.phone ?? "-"}`,
    "",
    "Pesan:",
    input.message,
  ].join("\n");
}

async function deliverContactEmail(
  settings: ContactSettingsData,
  message: Pick<ContactInput, "name" | "email" | "phone" | "topic" | "locale" | "message">,
  submissionId: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");

  const { data, error } = await new Resend(apiKey).emails.send({
    from: `${settings.senderName} <${settings.senderEmail}>`,
    to: [settings.publicEmail],
    replyTo: message.email,
    subject: `[Website Afana] ${topicLabels[message.topic].id} — ${message.name}`,
    text: emailText(message, submissionId),
  });

  if (error) throw new Error("Resend rejected the notification.");
  return data?.id ?? null;
}

async function recordNotificationAttempt(
  submissionId: string,
  settings: ContactSettingsData,
  message: Pick<ContactInput, "name" | "email" | "phone" | "topic" | "locale" | "message">,
) {
  const prisma = getPrisma();
  const attemptedAt = new Date();
  try {
    const notificationId = await deliverContactEmail(settings, message, submissionId);
    await prisma.contactSubmission.update({
      where: { id: submissionId },
      data: {
        notificationStatus: NotificationStatus.SENT,
        notificationId,
        notifiedAt: attemptedAt,
        notificationAttempts: { increment: 1 },
        lastNotificationAttemptAt: attemptedAt,
      },
    });
    return true;
  } catch {
    await prisma.contactSubmission.update({
      where: { id: submissionId },
      data: {
        notificationStatus: NotificationStatus.FAILED,
        notificationAttempts: { increment: 1 },
        lastNotificationAttemptAt: attemptedAt,
      },
    });
    console.error("[contact] Notification failed", { submissionId });
    return false;
  }
}

/** Stores the submission first, then records the configured Resend outcome. */
export async function createContactSubmission(input: ContactInput, remoteIp: string | null) {
  const prisma = getPrisma();
  const settings = resolveSettings(await loadContactSettings());
  const now = new Date();
  const sourceHash = getSourceHash(remoteIp, input.email);
  const windowStartedAt = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);
  // ponytail: Prisma Neon rejects explicit Serializable isolation; use an atomic rate-limit bucket if concurrent abuse becomes measurable.
  const submission = await prisma.$transaction(async (transaction) => {
    const recentCount = await transaction.contactSubmission.count({
      where: { sourceHash, createdAt: { gte: windowStartedAt } },
    });

    if (recentCount >= RATE_LIMIT_MAX) throw new ContactRateLimitError();

    return transaction.contactSubmission.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        topic: ContactTopic[input.topic],
        message: input.message,
        locale: input.locale,
        consentAt: now,
        sourceHash,
        expiresAt: getContactExpiryDate(now),
        notificationStatus: settings.autoEmailEnabled ? NotificationStatus.PENDING : NotificationStatus.SKIPPED,
      },
      select: { id: true },
    });
  });

  if (!settings.autoEmailEnabled) return { outcome: "skipped" as const };
  const notified = await recordNotificationAttempt(submission.id, settings, input);
  return { outcome: notified ? "sent" as const : "failed" as const };
}

export async function getContactDashboardCounts() {
  const prisma = getPrisma();
  const [unread, failed] = await Promise.all([
    prisma.contactSubmission.count({ where: { readAt: null, archivedAt: null } }),
    prisma.contactSubmission.count({ where: { notificationStatus: NotificationStatus.FAILED, archivedAt: null } }),
  ]);
  return { unread, failed };
}

function inboxWhere(filters: ContactInboxFilters): Prisma.ContactSubmissionWhereInput {
  const where: Prisma.ContactSubmissionWhereInput = filters.state === "archived"
    ? { archivedAt: { not: null } }
    : { archivedAt: null };

  if (filters.state === "unread") where.readAt = null;
  if (filters.state === "sent") where.notificationStatus = NotificationStatus.SENT;
  if (filters.state === "failed") where.notificationStatus = NotificationStatus.FAILED;
  if (filters.state === "skipped") where.notificationStatus = NotificationStatus.SKIPPED;
  if (filters.topic !== "all") where.topic = ContactTopic[filters.topic];
  if (filters.query) {
    where.OR = [
      { name: { contains: filters.query, mode: "insensitive" } },
      { email: { contains: filters.query, mode: "insensitive" } },
    ];
  }
  return where;
}

export async function getContactInbox(filters: ContactInboxFilters) {
  const prisma = getPrisma();
  const where = inboxWhere(filters);
  const [items, total, counts] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * INBOX_PAGE_SIZE,
      take: INBOX_PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        topic: true,
        locale: true,
        notificationStatus: true,
        readAt: true,
        archivedAt: true,
        createdAt: true,
      },
    }),
    prisma.contactSubmission.count({ where }),
    getContactDashboardCounts(),
  ]);

  return {
    items: items.map((item) => ({
      ...item,
      readAt: item.readAt?.toISOString() ?? null,
      archivedAt: item.archivedAt?.toISOString() ?? null,
      createdAt: item.createdAt.toISOString(),
    })),
    total,
    page: filters.page,
    pageCount: Math.max(1, Math.ceil(total / INBOX_PAGE_SIZE)),
    counts,
  };
}

export async function getContactSubmission(id: string) {
  if (!uuidPattern.test(id)) return null;
  const submission = await getPrisma().contactSubmission.findUnique({ where: { id } });
  if (!submission) return null;
  return {
    ...submission,
    consentAt: submission.consentAt.toISOString(),
    notifiedAt: submission.notifiedAt?.toISOString() ?? null,
    lastNotificationAttemptAt: submission.lastNotificationAttemptAt?.toISOString() ?? null,
    readAt: submission.readAt?.toISOString() ?? null,
    archivedAt: submission.archivedAt?.toISOString() ?? null,
    createdAt: submission.createdAt.toISOString(),
    expiresAt: submission.expiresAt.toISOString(),
  };
}

export async function updateContactSubmissionState(
  id: string,
  intent: "read" | "unread" | "archive" | "restore",
  actor: CmsUser,
) {
  const data = intent === "read"
    ? { readAt: new Date() }
    : intent === "unread"
      ? { readAt: null }
      : intent === "archive"
        ? { archivedAt: new Date() }
        : { archivedAt: null };
  const action = `CONTACT_${intent.toUpperCase()}`;
  const prisma = getPrisma();
  const result = await prisma.contactSubmission.updateMany({ where: { id }, data });
  if (result.count !== 1) throw new ContactAdminError("Pesan Contact tidak ditemukan.");
  await prisma.auditLog.create({ data: { actorId: actor.id, action, entityType: "ContactSubmission", entityId: id } });
}

export async function resendContactNotification(id: string, actor: CmsUser) {
  const prisma = getPrisma();
  const submission = await prisma.contactSubmission.findUnique({ where: { id } });
  if (!submission) throw new ContactAdminError("Pesan Contact tidak ditemukan.");
  if (submission.archivedAt) throw new ContactAdminError("Pulihkan pesan sebelum mengirim notifikasi.");
  if (submission.notificationStatus !== NotificationStatus.FAILED && submission.notificationStatus !== NotificationStatus.SKIPPED) {
    throw new ContactAdminError("Hanya notifikasi gagal atau dilewati yang dapat dikirim manual.");
  }

  const settings = resolveSettings(await prisma.contactSettings.findUnique({ where: { id: CONTACT_SETTINGS_ID } }));
  const notified = await recordNotificationAttempt(submission.id, settings, {
    name: submission.name,
    email: submission.email,
    phone: submission.phone,
    topic: submission.topic,
    locale: submission.locale === "en" ? "en" : "id",
    message: submission.message,
  });
  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      action: notified ? "CONTACT_NOTIFICATION_RESENT" : "CONTACT_NOTIFICATION_RETRY_FAILED",
      entityType: "ContactSubmission",
      entityId: id,
    },
  });
  if (!notified) throw new ContactAdminError("Email belum dapat dikirim. Periksa konfigurasi Resend lalu coba lagi.");
}

export async function sendContactTestEmail(actor: CmsUser) {
  const prisma = getPrisma();
  const settings = resolveSettings(await prisma.contactSettings.findUnique({ where: { id: CONTACT_SETTINGS_ID } }));
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new ContactAdminError("RESEND_API_KEY belum dikonfigurasi.");

  const { error } = await new Resend(apiKey).emails.send({
    from: `${settings.senderName} <${settings.senderEmail}>`,
    to: [settings.publicEmail],
    subject: "[Afana] Uji konfigurasi Contact",
    text: "Email uji ini memastikan pengaturan notifikasi Contact Afana dapat digunakan.",
  });
  const succeeded = !error;
  await prisma.auditLog.create({
    data: {
      actorId: actor.id,
      action: succeeded ? "CONTACT_TEST_EMAIL_SENT" : "CONTACT_TEST_EMAIL_FAILED",
      entityType: "ContactSettings",
      entityId: CONTACT_SETTINGS_ID,
    },
  });
  if (!succeeded) throw new ContactAdminError("Email uji ditolak Resend. Pastikan domain sender telah terverifikasi.");
}
