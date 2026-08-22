CREATE TYPE "FaqWorkflowStatus" AS ENUM ('DRAFT', 'IN_REVIEW');

CREATE TABLE "FaqCategory" (
  "id" UUID NOT NULL,
  "slug" VARCHAR(100) NOT NULL,
  "titleId" VARCHAR(100) NOT NULL,
  "titleEn" VARCHAR(100) NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "lockVersion" INTEGER NOT NULL DEFAULT 0,
  "archivedAt" TIMESTAMP(3),
  "createdById" TEXT,
  "updatedById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "FaqCategory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "FaqCategory_slug_format" CHECK ("slug" ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT "FaqCategory_sortOrder_nonnegative" CHECK ("sortOrder" >= 0),
  CONSTRAINT "FaqCategory_lockVersion_nonnegative" CHECK ("lockVersion" >= 0)
);

CREATE TABLE "FaqItem" (
  "id" UUID NOT NULL,
  "categoryId" UUID NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "workflowStatus" "FaqWorkflowStatus" NOT NULL DEFAULT 'DRAFT',
  "draftRevisionId" UUID,
  "publishedRevisionId" UUID,
  "lockVersion" INTEGER NOT NULL DEFAULT 0,
  "archivedAt" TIMESTAMP(3),
  "createdById" TEXT,
  "updatedById" TEXT,
  "publishedById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "FaqItem_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "FaqItem_sortOrder_nonnegative" CHECK ("sortOrder" >= 0),
  CONSTRAINT "FaqItem_lockVersion_nonnegative" CHECK ("lockVersion" >= 0)
);

CREATE TABLE "FaqRevision" (
  "id" UUID NOT NULL,
  "faqItemId" UUID NOT NULL,
  "categoryId" UUID NOT NULL,
  "revisionNumber" INTEGER NOT NULL,
  "payload" JSONB NOT NULL,
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FaqRevision_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "FaqRevision_number_positive" CHECK ("revisionNumber" > 0)
);

CREATE UNIQUE INDEX "FaqCategory_slug_key" ON "FaqCategory"("slug");
CREATE INDEX "FaqCategory_archivedAt_sortOrder_idx" ON "FaqCategory"("archivedAt", "sortOrder");
CREATE UNIQUE INDEX "FaqItem_draftRevisionId_key" ON "FaqItem"("draftRevisionId");
CREATE UNIQUE INDEX "FaqItem_publishedRevisionId_key" ON "FaqItem"("publishedRevisionId");
CREATE INDEX "FaqItem_categoryId_sortOrder_idx" ON "FaqItem"("categoryId", "sortOrder");
CREATE INDEX "FaqItem_workflowStatus_updatedAt_idx" ON "FaqItem"("workflowStatus", "updatedAt");
CREATE INDEX "FaqItem_archivedAt_idx" ON "FaqItem"("archivedAt");
CREATE INDEX "FaqItem_publishedRevisionId_archivedAt_idx" ON "FaqItem"("publishedRevisionId", "archivedAt");
CREATE UNIQUE INDEX "FaqRevision_faqItemId_revisionNumber_key" ON "FaqRevision"("faqItemId", "revisionNumber");
CREATE INDEX "FaqRevision_faqItemId_createdAt_idx" ON "FaqRevision"("faqItemId", "createdAt");
CREATE INDEX "FaqRevision_categoryId_idx" ON "FaqRevision"("categoryId");

ALTER TABLE "FaqCategory" ADD CONSTRAINT "FaqCategory_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FaqCategory" ADD CONSTRAINT "FaqCategory_updatedById_fkey"
  FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FaqItem" ADD CONSTRAINT "FaqItem_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "FaqCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FaqItem" ADD CONSTRAINT "FaqItem_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FaqItem" ADD CONSTRAINT "FaqItem_updatedById_fkey"
  FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FaqItem" ADD CONSTRAINT "FaqItem_publishedById_fkey"
  FOREIGN KEY ("publishedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FaqRevision" ADD CONSTRAINT "FaqRevision_faqItemId_fkey"
  FOREIGN KEY ("faqItemId") REFERENCES "FaqItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FaqRevision" ADD CONSTRAINT "FaqRevision_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "FaqCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FaqRevision" ADD CONSTRAINT "FaqRevision_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FaqItem" ADD CONSTRAINT "FaqItem_draftRevisionId_fkey"
  FOREIGN KEY ("draftRevisionId") REFERENCES "FaqRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FaqItem" ADD CONSTRAINT "FaqItem_publishedRevisionId_fkey"
  FOREIGN KEY ("publishedRevisionId") REFERENCES "FaqRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
