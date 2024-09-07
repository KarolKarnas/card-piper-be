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

  // unused
  // async findAllPersonalityReactions(id: number, entity?: ReactionEntity) {
  //   try {
  //     const includeClause: Prisma.PersonalityInclude = {
  //       book:
  //         entity === ReactionEntity.BOOK || !entity
  //           ? {
  //               select: {
  //                 reactions: {
  //                   select: {
  //                     id: true,
  //                     createdAt: true,
  //                     updatedAt: true,
  //                     type: true,
  //                     user: {
  //                       select: {
  //                         email: true,
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             }
  //           : false,
  //       author:
  //         entity === ReactionEntity.AUTHOR || !entity
  //           ? {
  //               select: {
  //                 reactions: {
  //                   select: {
  //                     id: true,
  //                     createdAt: true,
  //                     updatedAt: true,
  //                     type: true,
  //                     user: {
  //                       select: {
  //                         email: true,
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             }
  //           : false,
  //       quote:
  //         entity === ReactionEntity.QUOTE || !entity
  //           ? {
  //               select: {
  //                 reactions: {
  //                   select: {
  //                     id: true,
  //                     createdAt: true,
  //                     updatedAt: true,
  //                     type: true,
  //                     user: {
  //                       select: {
  //                         email: true,
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             }
  //           : false,
  //       character:
  //         entity === ReactionEntity.CHARACTER || !entity
  //           ? {
  //               select: {
  //                 reactions: {
  //                   select: {
  //                     id: true,
  //                     createdAt: true,
  //                     updatedAt: true,
  //                     type: true,
  //                     user: {
  //                       select: {
  //                         email: true,
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             }
  //           : false,
  //       user:
  //         entity === ReactionEntity.USER || !entity
  //           ? {
  //               select: {
  //                 reactions: {
  //                   select: {
  //                     id: true,
  //                     createdAt: true,
  //                     updatedAt: true,
  //                     type: true,
  //                     user: {
  //                       select: {
  //                         email: true,
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             }
  //           : false,
  //     };

  //     const whereClause: Prisma.PersonalityWhereUniqueInput = {
  //       id: id,
  //     };

  //     const personality = await this.databaseService.personality.findUnique({
  //       where: whereClause,
  //       include: includeClause,
  //     });

  //     return personality;
  //   } catch (error) {
  //     console.log('Error fetching reactions', error);
  //     throw error;
  //   }
  // }

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
