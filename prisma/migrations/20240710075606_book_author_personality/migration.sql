-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "personalityId" INTEGER;

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "personalityId" INTEGER;

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_personalityId_fkey" FOREIGN KEY ("personalityId") REFERENCES "Personality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_personalityId_fkey" FOREIGN KEY ("personalityId") REFERENCES "Personality"("id") ON DELETE SET NULL ON UPDATE CASCADE;
