CREATE TYPE "ContactTopic" AS ENUM (
  'GENERAL',
  'ELECTRICAL_SOLUTIONS',
  'PARTNERSHIP',
  'PROCUREMENT',
  'CAREER',
  'MEDIA'
);

CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

CREATE TABLE "ContactSubmission" (
  "id" UUID NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(254) NOT NULL,
  "phone" VARCHAR(30),
  "topic" "ContactTopic" NOT NULL,
  "message" TEXT NOT NULL,
  "locale" VARCHAR(2) NOT NULL,
  "consentAt" TIMESTAMP(3) NOT NULL,
  "sourceHash" VARCHAR(64) NOT NULL,
  "notificationStatus" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
  "notificationId" VARCHAR(255),
  "notifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ContactSubmission_name_length" CHECK (char_length("name") BETWEEN 2 AND 100),
  CONSTRAINT "ContactSubmission_email_length" CHECK (char_length("email") BETWEEN 3 AND 254),
  CONSTRAINT "ContactSubmission_phone_length" CHECK ("phone" IS NULL OR char_length("phone") <= 30),
  CONSTRAINT "ContactSubmission_message_length" CHECK (char_length("message") BETWEEN 20 AND 2000),
  CONSTRAINT "ContactSubmission_locale_value" CHECK ("locale" IN ('id', 'en'))
);

CREATE INDEX "ContactSubmission_sourceHash_createdAt_idx"
  ON "ContactSubmission"("sourceHash", "createdAt");

CREATE INDEX "ContactSubmission_expiresAt_idx"
  ON "ContactSubmission"("expiresAt");

CREATE INDEX "ContactSubmission_notificationStatus_idx"
  ON "ContactSubmission"("notificationStatus");
