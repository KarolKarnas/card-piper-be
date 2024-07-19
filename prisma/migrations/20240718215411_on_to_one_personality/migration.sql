/*
  Warnings:

  - You are about to drop the column `personalityId` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `personalityId` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `personalityId` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `personalityId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[quoteId]` on the table `Personality` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bookId]` on the table `Personality` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId]` on the table `Personality` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Personality` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[characterId]` on the table `Personality` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Personality` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookId` to the `Personality` table without a default value. This is not possible if the table is not empty.
  - Added the required column `characterId` to the `Personality` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quoteId` to the `Personality` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Personality` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Author" DROP CONSTRAINT "Author_personalityId_fkey";

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_personalityId_fkey";

-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_personalityId_fkey";

-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_personalityId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_personalityId_fkey";

-- AlterTable
ALTER TABLE "Author" DROP COLUMN "personalityId";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "personalityId";

-- AlterTable
ALTER TABLE "Personality" ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "bookId" INTEGER NOT NULL,
ADD COLUMN     "characterId" INTEGER NOT NULL,
ADD COLUMN     "quoteId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "personalityId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "personalityId";

-- CreateIndex
CREATE UNIQUE INDEX "Personality_quoteId_key" ON "Personality"("quoteId");

-- CreateIndex
CREATE UNIQUE INDEX "Personality_bookId_key" ON "Personality"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "Personality_authorId_key" ON "Personality"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Personality_userId_key" ON "Personality"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Personality_characterId_key" ON "Personality"("characterId");

-- AddForeignKey
ALTER TABLE "Personality" ADD CONSTRAINT "Personality_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personality" ADD CONSTRAINT "Personality_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personality" ADD CONSTRAINT "Personality_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personality" ADD CONSTRAINT "Personality_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personality" ADD CONSTRAINT "Personality_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
