import { Module } from '@nestjs/common';
import { FavoriteQuoteService } from './favorite-quote.service';
import { FavoriteQuoteController } from './favorite-quote.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FavoriteQuoteController],
  providers: [FavoriteQuoteService],
})
export class FavoriteQuoteModule {}
