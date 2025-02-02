import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ReactionService } from '../reaction/reaction.service';
import { calculateEuclideanDistance } from '../utils';
import { Prisma, ReactionEntity } from '@prisma/client';

@Injectable()
export class PersonalityService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly reactionService: ReactionService,
  ) {}

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
                  reactions: {
                    include: {
                      user: true,
                    },
                  },
                },
              }
            : false,
          quote: entities.includes(ReactionEntity.QUOTE)
            ? {
                include: {
                  author: true,
                  reactions: {
                    include: {
                      user: {
                        select: {
                          email: true,
                        },
                      },
                    },
                  },
                },
              }
            : false,
          author: entities.includes(ReactionEntity.AUTHOR)
            ? {
                include: {
                  books: true,
                  reactions: {
                    include: {
                      user: {
                        select: {
                          email: true,
                        },
                      },
                    },
                  },
                },
              }
            : false,
          character: entities.includes(ReactionEntity.CHARACTER)
            ? {
                include: {
                  books: true,
                  reactions: {
                    include: {
                      user: {
                        select: {
                          email: true,
                        },
                      },
                    },
                  },
                },
              }
            : false,
          user: entities.includes(ReactionEntity.USER)
            ? {
                include: {
                  personality: true,
                  reactions: {
                    include: {
                      book: true,
                      author: true,
                      quote: true,
                      character: true,
                      reactedUser: true,
                    },
                    orderBy: {
                      updatedAt: 'desc',
                    },
                    take: 10,
                  },
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

      const sortedPersonalitiesWithDistances = personalitiesWithDistances.sort(
        (a, b) => a.distance - b.distance,
      );

      return sortedPersonalitiesWithDistances.slice(skip, skip + take);
    }

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

      const personalitiesWithDistances = personalities.map((personality) => {
        const distance = calculateEuclideanDistance(
          userPersonality,
          personality,
        );
        return { ...personality, distance };
      });

      const sortedPersonalitiesWithDistances = personalitiesWithDistances.sort(
        (a, b) => a.distance - b.distance,
      );
      return sortedPersonalitiesWithDistances.slice(skip, skip + take);
    }
  }

  async createPersonalityReaction(
    id: number,
    createReactionDto: Prisma.ReactionUncheckedCreateInput,
  ) {
    await this.reactionService.create(createReactionDto);

    const { entity } = createReactionDto;

    const updatedPersonality =
      await this.databaseService.personality.findUnique({
        where: {
          id: id,
        },
        include: {
          book:
            entity === ReactionEntity.BOOK
              ? {
                  include: {
                    author: true,
                    characters: true,
                    reactions: {
                      include: {
                        user: true,
                      },
                    },
                  },
                }
              : false,
          quote:
            entity === ReactionEntity.QUOTE
              ? {
                  include: {
                    author: true,
                    reactions: {
                      include: {
                        user: true,
                      },
                    },
                  },
                }
              : false,
          author:
            entity === ReactionEntity.AUTHOR
              ? {
                  include: {
                    books: true,
                    reactions: {
                      include: {
                        user: true,
                      },
                    },
                  },
                }
              : false,
          character:
            entity === ReactionEntity.CHARACTER
              ? {
                  include: {
                    books: true,
                    reactions: {
                      include: {
                        user: true,
                      },
                    },
                  },
                }
              : false,
          user:
            entity === ReactionEntity.USER
              ? {
                  include: {
                    personality: true,
                    reactions: {
                      include: {
                        book: true,
                        author: true,
                        quote: true,
                        character: true,
                        reactedUser: true,
                      },
                      orderBy: {
                        updatedAt: 'desc',
                      },
                      take: 10,
                    },
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

    return updatedPersonality;
  }
}
