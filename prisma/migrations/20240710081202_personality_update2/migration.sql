-- DropForeignKey
ALTER TABLE "Author" DROP CONSTRAINT "Author_personalityId_fkey";

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_personalityId_fkey";

-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_personalityId_fkey";

-- AlterTable
ALTER TABLE "Author" ALTER COLUMN "personalityId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "personalityId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Quote" ALTER COLUMN "personalityId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_personalityId_fkey" FOREIGN KEY ("personalityId") REFERENCES "Personality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_personalityId_fkey" FOREIGN KEY ("personalityId") REFERENCES "Personality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_personalityId_fkey" FOREIGN KEY ("personalityId") REFERENCES "Personality"("id") ON DELETE SET NULL ON UPDATE CASCADE;
