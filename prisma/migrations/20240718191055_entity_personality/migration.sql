/*
  Warnings:

  - Added the required column `entity` to the `Personality` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ReactionEntity" ADD VALUE 'USER';

-- AlterTable
ALTER TABLE "Personality" ADD COLUMN     "entity" "ReactionEntity" NOT NULL;
