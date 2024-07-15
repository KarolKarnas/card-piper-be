/*
  Warnings:

  - You are about to drop the column `bookId` on the `Character` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,authorId]` on the table `Character` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_bookId_fkey";

-- DropIndex
DROP INDEX "Character_name_bookId_key";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "bookId",
ADD COLUMN     "authorId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_BookToCharacter" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookToCharacter_AB_unique" ON "_BookToCharacter"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToCharacter_B_index" ON "_BookToCharacter"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_authorId_key" ON "Character"("name", "authorId");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToCharacter" ADD CONSTRAINT "_BookToCharacter_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToCharacter" ADD CONSTRAINT "_BookToCharacter_B_fkey" FOREIGN KEY ("B") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
