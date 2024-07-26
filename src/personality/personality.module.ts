import { Module } from '@nestjs/common';
import { PersonalityService } from './personality.service';
import { PersonalityController } from './personality.controller';
import { DatabaseModule } from '../database/database.module';
import { ReactionService } from '../reaction/reaction.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PersonalityController],
  providers: [PersonalityService, ReactionService],
})
export class PersonalityModule {}
