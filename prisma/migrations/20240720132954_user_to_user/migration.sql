/*
  Warnings:

  - A unique constraint covering the columns `[userId,reactedUserId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "reactedUserId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_reactedUserId_key" ON "Reaction"("userId", "reactedUserId");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_reactedUserId_fkey" FOREIGN KEY ("reactedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
