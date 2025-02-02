import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoriteQuoteService } from './favorite-quote.service';
import { Prisma } from '@prisma/client';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('favorite-quote')
export class FavoriteQuoteController {
  constructor(private favoriteQuoteService: FavoriteQuoteService) {}

  @Post()
  create(
    @Body() createFavoriteQuoteDto: Prisma.FavoriteQuoteUncheckedCreateInput,
  ) {
    return this.favoriteQuoteService.create(createFavoriteQuoteDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoriteQuoteService.remove(Number(id));
  }

  @Get('user/:userId')
  findAllQuotes(@Param('userId') userId: string) {
    return this.favoriteQuoteService.findAllQuotes(Number(userId));
  }

  @Get('quote/:quoteId')
  findAllUsers(@Param('quoteId') quoteId: number) {
    return this.favoriteQuoteService.findAllUsers(Number(quoteId));
  }
}
