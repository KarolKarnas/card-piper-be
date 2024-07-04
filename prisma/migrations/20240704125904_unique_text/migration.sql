/*
  Warnings:

  - A unique constraint covering the columns `[text,authorId]` on the table `Quote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Quote_text_authorId_key" ON "Quote"("text", "authorId");
