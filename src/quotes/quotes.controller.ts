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
import { JwtGuard } from '../auth/guard';
import { AdminGuard } from '../auth/guard';

@UseGuards(JwtGuard)
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
    @Query('assertiveTurbulent', new DefaultValuePipe(0), ParseIntPipe)
    assertiveTurbulent?: number,
    @Query('extroversionIntroversion', new DefaultValuePipe(0), ParseIntPipe)
    extroversionIntroversion?: number,
    @Query('judgingPerceiving', new DefaultValuePipe(0), ParseIntPipe)
    judgingPerceiving?: number,
    @Query('sensingIntuition', new DefaultValuePipe(0), ParseIntPipe)
    sensingIntuition?: number,
    @Query('thinkingFeeling', new DefaultValuePipe(0), ParseIntPipe)
    thinkingFeeling?: number,
  ) {
    return this.quotesService.findAll(
      skip,
      take,
      assertiveTurbulent,
      extroversionIntroversion,
      judgingPerceiving,
      sensingIntuition,
      thinkingFeeling,
    );
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
