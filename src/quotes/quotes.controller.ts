import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { Prisma } from '@prisma/client';
// import { JwtGuard } from '../auth/guard';
import { AdminGuard } from '../auth/guard';
import { PersonalityData } from '../utils/types';

// @UseGuards(JwtGuard)
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  create(@Body() createQuoteDto: Prisma.QuoteCreateInput) {
    return this.quotesService.create(createQuoteDto);
  }

  @Get()
  findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(0), ParseIntPipe) take?: number,
    @Query() userPersonality?: PersonalityData,
  ) {
    return this.quotesService.findAll(skip, take, userPersonality);
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
