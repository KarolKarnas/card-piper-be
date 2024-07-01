/*
  Warnings:

  - A unique constraint covering the columns `[userId,quoteId]` on the table `FavoriteQuote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FavoriteQuote_userId_quoteId_key" ON "FavoriteQuote"("userId", "quoteId");
