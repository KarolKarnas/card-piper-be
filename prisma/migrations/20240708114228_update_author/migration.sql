-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "bornDate" TEXT,
ADD COLUMN     "bornPlace" TEXT,
ADD COLUMN     "deathDate" TEXT,
ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "image" TEXT,
ADD COLUMN     "popularity" INTEGER,
ADD COLUMN     "ratign" DOUBLE PRECISION,
ADD COLUMN     "website" TEXT;
