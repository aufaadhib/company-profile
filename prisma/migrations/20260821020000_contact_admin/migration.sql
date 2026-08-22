ALTER TYPE "NotificationStatus" ADD VALUE 'SKIPPED';

ALTER TABLE "ContactSubmission"
  ADD COLUMN "notificationAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lastNotificationAttemptAt" TIMESTAMP(3),
  ADD COLUMN "readAt" TIMESTAMP(3),
  ADD COLUMN "archivedAt" TIMESTAMP(3);

UPDATE "ContactSubmission"
SET "notificationAttempts" = 1,
    "lastNotificationAttemptAt" = COALESCE("notifiedAt", "createdAt")
WHERE "notificationStatus" IN ('SENT', 'FAILED');

CREATE TABLE "ContactSettings" (
  "id" VARCHAR(32) NOT NULL,
  "autoEmailEnabled" BOOLEAN NOT NULL DEFAULT true,
  "publicEmail" VARCHAR(254) NOT NULL,
  "showEmail" BOOLEAN NOT NULL DEFAULT true,
  "senderName" VARCHAR(100) NOT NULL,
  "senderEmail" VARCHAR(254) NOT NULL,
  "phone" VARCHAR(30) NOT NULL,
  "showPhone" BOOLEAN NOT NULL DEFAULT true,
  "whatsapp" VARCHAR(30) NOT NULL,
  "showWhatsapp" BOOLEAN NOT NULL DEFAULT true,
  "location" VARCHAR(150) NOT NULL,
  "showLocation" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ContactSettings_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ContactSettings_singleton" CHECK ("id" = 'primary'),
  CONSTRAINT "ContactSettings_publicEmail_length" CHECK (char_length("publicEmail") BETWEEN 3 AND 254),
  CONSTRAINT "ContactSettings_senderName_length" CHECK (char_length("senderName") BETWEEN 2 AND 100),
  CONSTRAINT "ContactSettings_senderEmail_length" CHECK (char_length("senderEmail") BETWEEN 3 AND 254),
  CONSTRAINT "ContactSettings_phone_length" CHECK (char_length("phone") BETWEEN 7 AND 30),
  CONSTRAINT "ContactSettings_whatsapp_length" CHECK (char_length("whatsapp") BETWEEN 7 AND 30),
  CONSTRAINT "ContactSettings_location_length" CHECK (char_length("location") BETWEEN 2 AND 150)
);

CREATE INDEX "ContactSubmission_archivedAt_createdAt_idx"
  ON "ContactSubmission"("archivedAt", "createdAt");

CREATE INDEX "ContactSubmission_readAt_createdAt_idx"
  ON "ContactSubmission"("readAt", "createdAt");
