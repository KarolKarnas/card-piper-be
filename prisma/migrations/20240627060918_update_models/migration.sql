/*
  Warnings:

  - Added the required column `userId` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
