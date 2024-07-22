import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseFloatPipe,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PersonalityService } from './personality.service';
import { JwtGuard } from '../auth/guard';
import { ReactionEntity } from '@prisma/client';
import { ParseEntitiesPipe } from '../utils/entities.pipe';

@Controller('personality')
export class PersonalityController {
  constructor(private readonly personalityService: PersonalityService) {}

  @UseGuards(JwtGuard)
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
}
