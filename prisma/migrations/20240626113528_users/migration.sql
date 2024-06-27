/*
  Warnings:

  - You are about to drop the `_QuoteToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_QuoteToUser" DROP CONSTRAINT "_QuoteToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_QuoteToUser" DROP CONSTRAINT "_QuoteToUser_B_fkey";

-- DropTable
DROP TABLE "_QuoteToUser";
