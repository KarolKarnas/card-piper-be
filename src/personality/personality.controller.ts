import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PersonalityService } from './personality.service';
import { JwtGuard } from '../auth/guard';
import { ReactionEntity } from '@prisma/client';

@Controller('personality')
export class PersonalityController {
  constructor(private readonly personalityService: PersonalityService) {}

  @UseGuards(JwtGuard)
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
    @Query('entity') entity?: ReactionEntity,
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
    );
  }
}
