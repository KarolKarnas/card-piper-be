/*
  Warnings:

  - You are about to drop the column `userId` on the `Quote` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_userId_fkey";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "userId";
