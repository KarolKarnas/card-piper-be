-- DropForeignKey
ALTER TABLE "FavoriteQuote" DROP CONSTRAINT "FavoriteQuote_userId_fkey";

-- AddForeignKey
ALTER TABLE "FavoriteQuote" ADD CONSTRAINT "FavoriteQuote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
