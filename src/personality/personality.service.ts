import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { calculateEuclideanDistance } from '../utils';
import { ReactionEntity } from '@prisma/client';

@Injectable()
export class PersonalityService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(
    skip: number,
    take: number,
    assertiveTurbulent: number,
    extroversionIntroversion: number,
    judgingPerceiving: number,
    sensingIntuition: number,
    thinkingFeeling: number,
    entity: ReactionEntity,
    entities: ReactionEntity[],
  ) {
    // if (skip === 0 && take === 0)
    //   return this.databaseService.personality.findMany();

    const userPersonality = {
      assertiveTurbulent,
      extroversionIntroversion,
      judgingPerceiving,
      sensingIntuition,
      thinkingFeeling,
    };

    if (entities) {
      const personalities = await this.databaseService.personality.findMany({
        where: {
          OR: entities.map((entity) => ({
            entity: entity,
          })),
        },
        include: {
          book: entities.includes(ReactionEntity.BOOK)
            ? {
                include: {
                  author: true,
                  characters: true,
                },
              }
            : false,
          quote: entities.includes(ReactionEntity.QUOTE)
            ? {
                include: {
                  author: true,
                },
              }
            : false,
          author: entities.includes(ReactionEntity.AUTHOR)
            ? {
                include: {
                  books: true,
                },
              }
            : false,
          character: entities.includes(ReactionEntity.CHARACTER)
            ? {
                include: {
                  books: true,
                },
              }
            : false,
          user: entities.includes(ReactionEntity.USER)
            ? {
                include: {
                  personality: true,
                  reactedBy: {
                    include: {
                      user: true,
                    },
                  },
                },
              }
            : false,
        },
      });

      const personalitiesWithDistances = personalities.map((personality) => {
        const distance = calculateEuclideanDistance(
          userPersonality,
          personality,
        );
        return { ...personality, distance };
      });
      // Sort the quotes based on distance
      const sortedPersonalitiesWithDistances = personalitiesWithDistances.sort(
        (a, b) => a.distance - b.distance,
      );

      return sortedPersonalitiesWithDistances.slice(skip, skip + take);
    }

    // if entity
    if (entity !== null) {
      const personalities = await this.databaseService.personality.findMany({
        where: {
          entity: entity,
        },
        include: {
          book: entity === ReactionEntity.BOOK,
          quote: entity === ReactionEntity.QUOTE,
          author: entity === ReactionEntity.AUTHOR,
          character: entity === ReactionEntity.CHARACTER,
          user: entity === ReactionEntity.USER,
        },
      });
      // console.log(personalities);
      const personalitiesWithDistances = personalities.map((personality) => {
        const distance = calculateEuclideanDistance(
          userPersonality,
          personality,
        );
        return { ...personality, distance };
      });
      // Sort the quotes based on distance
      const sortedPersonalitiesWithDistances = personalitiesWithDistances.sort(
        (a, b) => a.distance - b.distance,
      );
      return sortedPersonalitiesWithDistances.slice(skip, skip + take);
    }
  }
}
