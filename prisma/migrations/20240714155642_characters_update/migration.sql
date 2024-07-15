/*
  Warnings:

  - You are about to drop the column `characterId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Character` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,bookId]` on the table `Character` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookId` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_quoteId_fkey";

-- DropIndex
DROP INDEX "Character_name_authorId_key";

-- DropIndex
DROP INDEX "Character_name_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "characterId";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "authorId",
ADD COLUMN     "bookId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_bookId_key" ON "Character"("name", "bookId");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
