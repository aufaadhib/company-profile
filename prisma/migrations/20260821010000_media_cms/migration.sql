CREATE TYPE "MediaWorkflowStatus" AS ENUM ('DRAFT', 'IN_REVIEW');
CREATE TYPE "MediaAssetSource" AS ENUM ('LOCAL', 'BLOB');

CREATE TABLE "user" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "role" TEXT,
  "banned" BOOLEAN DEFAULT false,
  "banReason" TEXT,
  "banExpires" TIMESTAMP(3),
  CONSTRAINT "user_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "user_role_value" CHECK ("role" IS NULL OR "role" IN ('admin', 'editor'))
);

CREATE TABLE "session" (
  "id" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "token" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL,
  "impersonatedBy" TEXT,
  CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "account" (
  "id" TEXT NOT NULL,
  "issuer" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP(3),
  "refreshTokenExpiresAt" TIMESTAMP(3),
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "verification" (
  "id" TEXT NOT NULL,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MediaAsset" (
  "id" UUID NOT NULL,
  "source" "MediaAssetSource" NOT NULL,
  "url" TEXT NOT NULL,
  "pathname" TEXT,
  "mimeType" VARCHAR(100) NOT NULL,
  "size" INTEGER NOT NULL,
  "originalName" VARCHAR(255) NOT NULL,
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "MediaAsset_size_range" CHECK ("size" BETWEEN 0 AND 8388608)
);

CREATE TABLE "MediaArticle" (
  "id" UUID NOT NULL,
  "slug" VARCHAR(160) NOT NULL,
  "workflowStatus" "MediaWorkflowStatus" NOT NULL DEFAULT 'DRAFT',
  "draftRevisionId" UUID,
  "publishedRevisionId" UUID,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "lockVersion" INTEGER NOT NULL DEFAULT 0,
  "archivedAt" TIMESTAMP(3),
  "createdById" TEXT,
  "updatedById" TEXT,
  "publishedById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MediaArticle_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "MediaArticle_slug_format" CHECK ("slug" ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT "MediaArticle_lockVersion_nonnegative" CHECK ("lockVersion" >= 0)
);

CREATE TABLE "MediaRevision" (
  "id" UUID NOT NULL,
  "articleId" UUID NOT NULL,
  "revisionNumber" INTEGER NOT NULL,
  "assetId" UUID,
  "payload" JSONB NOT NULL,
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MediaRevision_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "MediaRevision_number_positive" CHECK ("revisionNumber" > 0)
);

CREATE TABLE "AuditLog" (
  "id" UUID NOT NULL,
  "actorId" TEXT,
  "action" VARCHAR(80) NOT NULL,
  "entityType" VARCHAR(80) NOT NULL,
  "entityId" VARCHAR(255) NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");
CREATE INDEX "session_userId_idx" ON "session"("userId");
CREATE UNIQUE INDEX "account_issuer_accountId_uidx" ON "account"("issuer", "accountId");
CREATE INDEX "account_userId_idx" ON "account"("userId");
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");
CREATE INDEX "MediaAsset_createdById_createdAt_idx" ON "MediaAsset"("createdById", "createdAt");
CREATE UNIQUE INDEX "MediaArticle_slug_key" ON "MediaArticle"("slug");
CREATE UNIQUE INDEX "MediaArticle_draftRevisionId_key" ON "MediaArticle"("draftRevisionId");
CREATE UNIQUE INDEX "MediaArticle_publishedRevisionId_key" ON "MediaArticle"("publishedRevisionId");
CREATE INDEX "MediaArticle_workflowStatus_updatedAt_idx" ON "MediaArticle"("workflowStatus", "updatedAt");
CREATE INDEX "MediaArticle_archivedAt_idx" ON "MediaArticle"("archivedAt");
CREATE INDEX "MediaArticle_publishedRevisionId_archivedAt_idx" ON "MediaArticle"("publishedRevisionId", "archivedAt");
CREATE UNIQUE INDEX "MediaRevision_articleId_revisionNumber_key" ON "MediaRevision"("articleId", "revisionNumber");
CREATE INDEX "MediaRevision_articleId_createdAt_idx" ON "MediaRevision"("articleId", "createdAt");
CREATE INDEX "MediaRevision_assetId_idx" ON "MediaRevision"("assetId");
CREATE INDEX "AuditLog_entityType_entityId_createdAt_idx" ON "AuditLog"("entityType", "entityId", "createdAt");
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");

ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MediaArticle" ADD CONSTRAINT "MediaArticle_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MediaArticle" ADD CONSTRAINT "MediaArticle_updatedById_fkey"
  FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MediaArticle" ADD CONSTRAINT "MediaArticle_publishedById_fkey"
  FOREIGN KEY ("publishedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MediaRevision" ADD CONSTRAINT "MediaRevision_articleId_fkey"
  FOREIGN KEY ("articleId") REFERENCES "MediaArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MediaRevision" ADD CONSTRAINT "MediaRevision_assetId_fkey"
  FOREIGN KEY ("assetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MediaRevision" ADD CONSTRAINT "MediaRevision_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MediaArticle" ADD CONSTRAINT "MediaArticle_draftRevisionId_fkey"
  FOREIGN KEY ("draftRevisionId") REFERENCES "MediaRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MediaArticle" ADD CONSTRAINT "MediaArticle_publishedRevisionId_fkey"
  FOREIGN KEY ("publishedRevisionId") REFERENCES "MediaRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey"
  FOREIGN KEY ("actorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
