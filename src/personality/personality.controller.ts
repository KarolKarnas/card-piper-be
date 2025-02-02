import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  Query,
  UseGuards,
  Body,
  Post,
} from '@nestjs/common';
import { PersonalityService } from './personality.service';
import { JwtGuard } from '../auth/guard';
import { Prisma, ReactionEntity } from '@prisma/client';
import { ParseEntitiesPipe } from '../utils/entities.pipe';
@UseGuards(JwtGuard)
@Controller('personality')
export class PersonalityController {
  constructor(private readonly personalityService: PersonalityService) {}

  @Get()
  findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(0), ParseIntPipe) take?: number,
    @Query('assertiveTurbulent', new DefaultValuePipe(0), ParseFloatPipe)
    assertiveTurbulent?: number,
    @Query('extroversionIntroversion', new DefaultValuePipe(0), ParseFloatPipe)
    extroversionIntroversion?: number,
    @Query('judgingPerceiving', new DefaultValuePipe(0), ParseFloatPipe)
    judgingPerceiving?: number,
    @Query('sensingIntuition', new DefaultValuePipe(0), ParseFloatPipe)
    sensingIntuition?: number,
    @Query('thinkingFeeling', new DefaultValuePipe(0), ParseFloatPipe)
    thinkingFeeling?: number,
    @Query('entity') entity?: ReactionEntity,
    @Query('entities', new ParseEntitiesPipe()) entities?: ReactionEntity[],
  ) {
    return this.personalityService.findAll(
      skip,
      take,
      assertiveTurbulent,
      extroversionIntroversion,
      judgingPerceiving,
      sensingIntuition,
      thinkingFeeling,
      entity,
      entities,
    );
  }

  @Post(':id/reaction')
  createPersonalityReaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() createReactionDto: Prisma.ReactionUncheckedCreateInput,
  ) {
    return this.personalityService.createPersonalityReaction(
      id,
      createReactionDto,
    );
  }
}
