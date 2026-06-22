-- AlterTable
ALTER TABLE "comparisons" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "comparison_colleges" ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "comparisons_createdAt_idx" ON "comparisons"("createdAt");
