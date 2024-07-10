/*
  Warnings:

  - You are about to drop the column `extroversion` on the `Personality` table. All the data in the column will be lost.
  - You are about to drop the column `feeling` on the `Personality` table. All the data in the column will be lost.
  - You are about to drop the column `introversion` on the `Personality` table. All the data in the column will be lost.
  - You are about to drop the column `intuition` on the `Personality` table. All the data in the column will be lost.
  - You are about to drop the column `judging` on the `Personality` table. All the data in the column will be lost.
  - You are about to drop the column `perceiving` on the `Personality` table. All the data in the column will be lost.
  - You are about to drop the column `sensing` on the `Personality` table. All the data in the column will be lost.
  - You are about to drop the column `thinking` on the `Personality` table. All the data in the column will be lost.
  - Added the required column `assertiveTurbulent` to the `Personality` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extroversionIntroversion` to the `Personality` table without a default value. This is not possible if the table is not empty.
  - Added the required column `judgingPerceiving` to the `Personality` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sensingIntuition` to the `Personality` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thinkingFeeling` to the `Personality` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Personality" DROP COLUMN "extroversion",
DROP COLUMN "feeling",
DROP COLUMN "introversion",
DROP COLUMN "intuition",
DROP COLUMN "judging",
DROP COLUMN "perceiving",
DROP COLUMN "sensing",
DROP COLUMN "thinking",
ADD COLUMN     "assertiveTurbulent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "extroversionIntroversion" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "judgingPerceiving" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "sensingIntuition" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "thinkingFeeling" DOUBLE PRECISION NOT NULL;
