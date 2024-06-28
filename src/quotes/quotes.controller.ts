import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { Prisma } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { AdminGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  create(@Body() createQuoteDto: Prisma.QuoteCreateInput) {
    return this.quotesService.create(createQuoteDto);
  }

  @Get()
  findAll() {
    return this.quotesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuoteDto: Prisma.QuoteCreateInput,
  ) {
    return this.quotesService.update(+id, updateQuoteDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotesService.remove(+id);
  }
}
