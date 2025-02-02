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
  Query,
  ParseBoolPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { Prisma, ReactionType, ReactionEntity } from '@prisma/client';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('reaction')
export class ReactionController {
  constructor(private reactionService: ReactionService) {}

  @Post()
  create(@Body() createReactionDto: Prisma.ReactionUncheckedCreateInput) {
    return this.reactionService.create(createReactionDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reactionService.remove(Number(id));
  }

  @Get('user')
  findAllUserReactions(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('all', ParseBoolPipe) all?: boolean,
    @Query('type') type?: ReactionType,
    @Query('entity') entity?: ReactionEntity,
    @Query('favorite') favorite?: string,
    @Query('list') list?: string,
  ) {
    return this.reactionService.findAllUserReactions(
      Number(userId),
      all,
      type,
      entity,
      favorite,
      list,
    );
  }
}
