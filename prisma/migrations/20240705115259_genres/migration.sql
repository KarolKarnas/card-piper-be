/*
  Warnings:

  - You are about to drop the column `generes` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "generes",
ADD COLUMN     "genres" TEXT[];
