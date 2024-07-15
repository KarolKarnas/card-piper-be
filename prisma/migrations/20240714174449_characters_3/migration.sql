/*
  Warnings:

  - You are about to drop the `_BookToCharacter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BookToCharacter" DROP CONSTRAINT "_BookToCharacter_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookToCharacter" DROP CONSTRAINT "_BookToCharacter_B_fkey";

-- DropTable
DROP TABLE "_BookToCharacter";

-- CreateTable
CREATE TABLE "_CharacterBooks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CharacterBooks_AB_unique" ON "_CharacterBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_CharacterBooks_B_index" ON "_CharacterBooks"("B");

-- AddForeignKey
ALTER TABLE "_CharacterBooks" ADD CONSTRAINT "_CharacterBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterBooks" ADD CONSTRAINT "_CharacterBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
