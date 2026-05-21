-- DropIndex
DROP INDEX "Note_publishedAt_idx";

-- AlterTable
ALTER TABLE "_NoteToTag" ADD CONSTRAINT "_NoteToTag_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_NoteToTag_AB_unique";

-- CreateIndex
CREATE INDEX "Note_publishedAt_idx" ON "Note"("publishedAt" DESC);
