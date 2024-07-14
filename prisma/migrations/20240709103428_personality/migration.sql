/*
  Warnings:

  - Added the required column `personalityId` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personalityId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "personalityId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "personalityId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Personality" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "extroversion" DOUBLE PRECISION NOT NULL,
    "introversion" DOUBLE PRECISION NOT NULL,
    "sensing" DOUBLE PRECISION NOT NULL,
    "intuition" DOUBLE PRECISION NOT NULL,
    "thinking" DOUBLE PRECISION NOT NULL,
    "feeling" DOUBLE PRECISION NOT NULL,
    "judging" DOUBLE PRECISION NOT NULL,
    "perceiving" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Personality_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_personalityId_fkey" FOREIGN KEY ("personalityId") REFERENCES "Personality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_personalityId_fkey" FOREIGN KEY ("personalityId") REFERENCES "Personality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
