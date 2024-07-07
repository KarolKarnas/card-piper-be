-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_bookId_fkey";

-- AlterTable
ALTER TABLE "Quote" ALTER COLUMN "bookId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;
