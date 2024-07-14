/*
  Warnings:

  - Made the column `personalityId` on table `Author` required. This step will fail if there are existing NULL values in that column.
  - Made the column `personalityId` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Author" DROP CONSTRAINT "Author_personalityId_fkey";

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_personalityId_fkey";

-- AlterTable
ALTER TABLE "Author" ALTER COLUMN "personalityId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "personalityId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_personalityId_fkey" FOREIGN KEY ("personalityId") REFERENCES "Personality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_personalityId_fkey" FOREIGN KEY ("personalityId") REFERENCES "Personality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
