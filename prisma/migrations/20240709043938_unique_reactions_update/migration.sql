/*
  Warnings:

  - You are about to drop the column `favorite` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `readlist` on the `Reaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,quoteId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,bookId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,authorId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Reaction_userId_quoteId_bookId_authorId_key";

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "favorite",
DROP COLUMN "readlist";

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_quoteId_key" ON "Reaction"("userId", "quoteId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_bookId_key" ON "Reaction"("userId", "bookId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_authorId_key" ON "Reaction"("userId", "authorId");
