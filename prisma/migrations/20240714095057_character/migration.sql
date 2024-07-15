/*
  Warnings:

  - A unique constraint covering the columns `[userId,characterId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pages` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ReactionEntity" ADD VALUE 'CHARACTER';

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "characterId" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "pages" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "characterId" INTEGER;

-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "popularity" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "bornPlace" TEXT,
    "bornDate" TEXT,
    "deathDate" TEXT,
    "image" TEXT NOT NULL,
    "personalityId" INTEGER,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "Character"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_authorId_key" ON "Character"("name", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_characterId_key" ON "Reaction"("userId", "characterId");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_personalityId_fkey" FOREIGN KEY ("personalityId") REFERENCES "Personality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;
