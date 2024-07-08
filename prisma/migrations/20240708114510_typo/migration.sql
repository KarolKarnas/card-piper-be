/*
  Warnings:

  - You are about to drop the column `ratign` on the `Author` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Author" DROP COLUMN "ratign",
ADD COLUMN     "rating" DOUBLE PRECISION;
