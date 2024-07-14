/*
  Warnings:

  - Made the column `favorite` on table `Reaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `list` on table `Reaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Reaction" ALTER COLUMN "favorite" SET NOT NULL,
ALTER COLUMN "list" SET NOT NULL;
