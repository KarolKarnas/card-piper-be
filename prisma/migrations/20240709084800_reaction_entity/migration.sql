/*
  Warnings:

  - Added the required column `entity` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `type` on table `Reaction` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ReactionEntity" AS ENUM ('AUTHOR', 'BOOK', 'QUOTE');

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "entity" "ReactionEntity" NOT NULL,
ALTER COLUMN "type" SET NOT NULL;
