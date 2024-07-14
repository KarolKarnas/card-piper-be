import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma, ReactionType, ReactionEntity } from '@prisma/client';

const removePersonalityCalc = (
  updatedPersonality: Prisma.PersonalityCreateInput,
  itemPersonality: Prisma.PersonalityCreateInput,
  existingReaction: Prisma.ReactionUncheckedCreateInput,
) => {
  const threshold = 1e-10;

  switch (existingReaction.type) {
    case ReactionType.LOVE:
      updatedPersonality.extroversionIntroversion -=
        itemPersonality.extroversionIntroversion * 0.2;
      updatedPersonality.sensingIntuition -=
        itemPersonality.sensingIntuition * 0.2;
      updatedPersonality.thinkingFeeling -=
        itemPersonality.thinkingFeeling * 0.2;
      updatedPersonality.judgingPerceiving -=
        itemPersonality.judgingPerceiving * 0.2;
      updatedPersonality.assertiveTurbulent -=
        itemPersonality.assertiveTurbulent * 0.2;
      break;
    case ReactionType.LIKE:
      updatedPersonality.extroversionIntroversion -=
        itemPersonality.extroversionIntroversion * 0.1;
      updatedPersonality.sensingIntuition -=
        itemPersonality.sensingIntuition * 0.1;
      updatedPersonality.thinkingFeeling -=
        itemPersonality.thinkingFeeling * 0.1;
      updatedPersonality.judgingPerceiving -=
        itemPersonality.judgingPerceiving * 0.1;
      updatedPersonality.assertiveTurbulent -=
        itemPersonality.assertiveTurbulent * 0.1;
      break;
    case ReactionType.DISLIKE:
      updatedPersonality.extroversionIntroversion +=
        itemPersonality.extroversionIntroversion * 0.1;
      updatedPersonality.sensingIntuition +=
        itemPersonality.sensingIntuition * 0.1;
      updatedPersonality.thinkingFeeling +=
        itemPersonality.thinkingFeeling * 0.1;
      updatedPersonality.judgingPerceiving +=
        itemPersonality.judgingPerceiving * 0.1;
      updatedPersonality.assertiveTurbulent +=
        itemPersonality.assertiveTurbulent * 0.1;
      break;
    case ReactionType.HATE:
      updatedPersonality.extroversionIntroversion +=
        itemPersonality.extroversionIntroversion * 0.2;
      updatedPersonality.sensingIntuition +=
        itemPersonality.sensingIntuition * 0.2;
      updatedPersonality.thinkingFeeling +=
        itemPersonality.thinkingFeeling * 0.2;
      updatedPersonality.judgingPerceiving +=
        itemPersonality.judgingPerceiving * 0.2;
      updatedPersonality.assertiveTurbulent +=
        itemPersonality.assertiveTurbulent * 0.2;
      break;
    default:
      break;
  }

  if (existingReaction.favorite === true) {
    updatedPersonality.extroversionIntroversion -=
      itemPersonality.extroversionIntroversion * 0.5;
    updatedPersonality.sensingIntuition -=
      itemPersonality.sensingIntuition * 0.5;
    updatedPersonality.thinkingFeeling -= itemPersonality.thinkingFeeling * 0.5;
    updatedPersonality.judgingPerceiving -=
      itemPersonality.judgingPerceiving * 0.5;
    updatedPersonality.assertiveTurbulent -=
      itemPersonality.assertiveTurbulent * 0.5;
  }

  if (existingReaction.list === true) {
    updatedPersonality.extroversionIntroversion -=
      itemPersonality.extroversionIntroversion * 0.3;
    updatedPersonality.sensingIntuition -=
      itemPersonality.sensingIntuition * 0.3;
    updatedPersonality.thinkingFeeling -= itemPersonality.thinkingFeeling * 0.3;
    updatedPersonality.judgingPerceiving -=
      itemPersonality.judgingPerceiving * 0.3;
    updatedPersonality.assertiveTurbulent -=
      itemPersonality.assertiveTurbulent * 0.3;
  }

  [
    'extroversionIntroversion',
    'sensingIntuition',
    'thinkingFeeling',
    'judgingPerceiving',
    'assertiveTurbulent',
  ].forEach((trait) => {
    if (Math.abs(updatedPersonality[trait]) < threshold) {
      updatedPersonality[trait] = 0;
    }
  });
  return updatedPersonality;
};

@Injectable()
export class ReactionService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createReactionDto: Prisma.ReactionUncheckedCreateInput) {
    try {
      const {
        userId,
        quoteId,
        bookId,
        authorId,
        type,
        entity,
        favorite,
        list,
      } = createReactionDto;

      // Fetch user's current personality
      const user = await this.databaseService.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          personality: true,
        },
      });

      if (!user) {
        throw new Error(`User with ID ${userId} not found.`);
      }

      const updatedPersonality = { ...user.personality }; // Copy existing personality
      let itemPersonality: Prisma.PersonalityCreateInput;
      let reaction: Prisma.ReactionUncheckedCreateInput;
      let existingReaction: Prisma.ReactionUncheckedCreateInput;
      //
      const updateFields: Prisma.ReactionUncheckedUpdateInput = {};
      if (type) updateFields.type = type;
      if (favorite !== undefined) updateFields.favorite = favorite;
      if (list !== undefined) updateFields.list = list;

      //QUOTE
      if (entity === ReactionEntity.QUOTE) {
        existingReaction = await this.databaseService.reaction.findUnique({
          where: {
            userId_quoteId: {
              userId,
              quoteId,
            },
          },
        });
        reaction = await this.databaseService.reaction.upsert({
          where: {
            userId_quoteId: {
              userId,
              quoteId,
            },
          },
          update: updateFields,
          create: { userId, quoteId, type, entity, favorite, list },
        });

        // Fetch details of the quote for which the reaction is being created
        const quote = await this.databaseService.quote.findUnique({
          where: {
            id: quoteId,
          },
          include: {
            personality: true,
          },
        });

        if (!quote) {
          throw new Error(`Quote with ID ${quoteId} not found.`);
        }

        itemPersonality = quote.personality;
      } else if (entity === ReactionEntity.BOOK) {
        existingReaction = await this.databaseService.reaction.findUnique({
          where: {
            userId_bookId: {
              userId,
              bookId,
            },
          },
        });
        reaction = await this.databaseService.reaction.upsert({
          where: {
            userId_bookId: {
              userId,
              bookId,
            },
          },
          update: updateFields,
          create: { userId, bookId, type, entity, favorite, list },
        });

        const book = await this.databaseService.book.findUnique({
          where: {
            id: bookId,
          },
          include: {
            personality: true,
          },
        });

        if (!book) {
          throw new Error(`Book with ID ${bookId} not found.`);
        }
        itemPersonality = book.personality;
      } else if (entity === ReactionEntity.AUTHOR) {
        existingReaction = await this.databaseService.reaction.findUnique({
          where: {
            userId_authorId: {
              userId,
              authorId,
            },
          },
        });
        reaction = await this.databaseService.reaction.upsert({
          where: {
            userId_authorId: {
              userId,
              authorId,
            },
          },
          update: updateFields,
          create: { userId, authorId, type, entity, favorite, list },
        });
        const author = await this.databaseService.author.findUnique({
          where: {
            id: authorId,
          },
          include: {
            personality: true,
          },
        });

        if (!author) {
          throw new Error(`Author with ID ${authorId} not found.`);
        }
        itemPersonality = author.personality;
      }

      if (existingReaction) {
        // Zero out previous calculations
        removePersonalityCalc(
          updatedPersonality,
          itemPersonality,
          existingReaction,
        );
        // switch (existingReaction.type) {
        //   case ReactionType.LOVE:
        //     updatedPersonality.extroversionIntroversion -=
        //       itemPersonality.extroversionIntroversion * 0.2;
        //     updatedPersonality.sensingIntuition -=
        //       itemPersonality.sensingIntuition * 0.2;
        //     updatedPersonality.thinkingFeeling -=
        //       itemPersonality.thinkingFeeling * 0.2;
        //     updatedPersonality.judgingPerceiving -=
        //       itemPersonality.judgingPerceiving * 0.2;
        //     updatedPersonality.assertiveTurbulent -=
        //       itemPersonality.assertiveTurbulent * 0.2;
        //     break;
        //   case ReactionType.LIKE:
        //     updatedPersonality.extroversionIntroversion -=
        //       itemPersonality.extroversionIntroversion * 0.1;
        //     updatedPersonality.sensingIntuition -=
        //       itemPersonality.sensingIntuition * 0.1;
        //     updatedPersonality.thinkingFeeling -=
        //       itemPersonality.thinkingFeeling * 0.1;
        //     updatedPersonality.judgingPerceiving -=
        //       itemPersonality.judgingPerceiving * 0.1;
        //     updatedPersonality.assertiveTurbulent -=
        //       itemPersonality.assertiveTurbulent * 0.1;
        //     break;
        //   case ReactionType.DISLIKE:
        //     updatedPersonality.extroversionIntroversion +=
        //       itemPersonality.extroversionIntroversion * 0.1;
        //     updatedPersonality.sensingIntuition +=
        //       itemPersonality.sensingIntuition * 0.1;
        //     updatedPersonality.thinkingFeeling +=
        //       itemPersonality.thinkingFeeling * 0.1;
        //     updatedPersonality.judgingPerceiving +=
        //       itemPersonality.judgingPerceiving * 0.1;
        //     updatedPersonality.assertiveTurbulent +=
        //       itemPersonality.assertiveTurbulent * 0.1;
        //     break;
        //   case ReactionType.HATE:
        //     updatedPersonality.extroversionIntroversion +=
        //       itemPersonality.extroversionIntroversion * 0.2;
        //     updatedPersonality.sensingIntuition +=
        //       itemPersonality.sensingIntuition * 0.2;
        //     updatedPersonality.thinkingFeeling +=
        //       itemPersonality.thinkingFeeling * 0.2;
        //     updatedPersonality.judgingPerceiving +=
        //       itemPersonality.judgingPerceiving * 0.2;
        //     updatedPersonality.assertiveTurbulent +=
        //       itemPersonality.assertiveTurbulent * 0.2;
        //     break;
        //   default:
        //     break;
        // }

        // if (existingReaction.favorite === true) {
        //   updatedPersonality.extroversionIntroversion -=
        //     itemPersonality.extroversionIntroversion * 0.5;
        //   updatedPersonality.sensingIntuition -=
        //     itemPersonality.sensingIntuition * 0.5;
        //   updatedPersonality.thinkingFeeling -=
        //     itemPersonality.thinkingFeeling * 0.5;
        //   updatedPersonality.judgingPerceiving -=
        //     itemPersonality.judgingPerceiving * 0.5;
        //   updatedPersonality.assertiveTurbulent -=
        //     itemPersonality.assertiveTurbulent * 0.5;
        // }

        // if (existingReaction.list === true) {
        //   updatedPersonality.extroversionIntroversion -=
        //     itemPersonality.extroversionIntroversion * 0.3;
        //   updatedPersonality.sensingIntuition -=
        //     itemPersonality.sensingIntuition * 0.3;
        //   updatedPersonality.thinkingFeeling -=
        //     itemPersonality.thinkingFeeling * 0.3;
        //   updatedPersonality.judgingPerceiving -=
        //     itemPersonality.judgingPerceiving * 0.3;
        //   updatedPersonality.assertiveTurbulent -=
        //     itemPersonality.assertiveTurbulent * 0.3;
        // }
      }

      switch (type) {
        case ReactionType.LOVE:
          updatedPersonality.extroversionIntroversion +=
            itemPersonality.extroversionIntroversion * 0.2;
          updatedPersonality.sensingIntuition +=
            itemPersonality.sensingIntuition * 0.2;
          updatedPersonality.thinkingFeeling +=
            itemPersonality.thinkingFeeling * 0.2;
          updatedPersonality.judgingPerceiving +=
            itemPersonality.judgingPerceiving * 0.2;
          updatedPersonality.assertiveTurbulent +=
            itemPersonality.assertiveTurbulent * 0.2;
          break;
        case ReactionType.LIKE:
          updatedPersonality.extroversionIntroversion +=
            itemPersonality.extroversionIntroversion * 0.1;
          updatedPersonality.sensingIntuition +=
            itemPersonality.sensingIntuition * 0.1;
          updatedPersonality.thinkingFeeling +=
            itemPersonality.thinkingFeeling * 0.1;
          updatedPersonality.judgingPerceiving +=
            itemPersonality.judgingPerceiving * 0.1;
          updatedPersonality.assertiveTurbulent +=
            itemPersonality.assertiveTurbulent * 0.1;
          break;
        case ReactionType.DISLIKE:
          updatedPersonality.extroversionIntroversion -=
            itemPersonality.extroversionIntroversion * 0.1;
          updatedPersonality.sensingIntuition -=
            itemPersonality.sensingIntuition * 0.1;
          updatedPersonality.thinkingFeeling -=
            itemPersonality.thinkingFeeling * 0.1;
          updatedPersonality.judgingPerceiving -=
            itemPersonality.judgingPerceiving * 0.1;
          updatedPersonality.assertiveTurbulent -=
            itemPersonality.assertiveTurbulent * 0.1;
          break;
        case ReactionType.HATE:
          updatedPersonality.extroversionIntroversion -=
            itemPersonality.extroversionIntroversion * 0.2;
          updatedPersonality.sensingIntuition -=
            itemPersonality.sensingIntuition * 0.2;
          updatedPersonality.thinkingFeeling -=
            itemPersonality.thinkingFeeling * 0.2;
          updatedPersonality.judgingPerceiving -=
            itemPersonality.judgingPerceiving * 0.2;
          updatedPersonality.assertiveTurbulent -=
            itemPersonality.assertiveTurbulent * 0.2;
          break;
        default:
          break;
      }

      if (favorite === true) {
        updatedPersonality.extroversionIntroversion +=
          itemPersonality.extroversionIntroversion * 0.5;
        updatedPersonality.sensingIntuition +=
          itemPersonality.sensingIntuition * 0.5;
        updatedPersonality.thinkingFeeling +=
          itemPersonality.thinkingFeeling * 0.5;
        updatedPersonality.judgingPerceiving +=
          itemPersonality.judgingPerceiving * 0.5;
        updatedPersonality.assertiveTurbulent +=
          itemPersonality.assertiveTurbulent * 0.5;
      }

      if (list === true) {
        updatedPersonality.extroversionIntroversion +=
          itemPersonality.extroversionIntroversion * 0.3;
        updatedPersonality.sensingIntuition +=
          itemPersonality.sensingIntuition * 0.3;
        updatedPersonality.thinkingFeeling +=
          itemPersonality.thinkingFeeling * 0.3;
        updatedPersonality.judgingPerceiving +=
          itemPersonality.judgingPerceiving * 0.3;
        updatedPersonality.assertiveTurbulent +=
          itemPersonality.assertiveTurbulent * 0.3;
      }

      // Update the user's personality in the database
      await this.databaseService.user.update({
        where: {
          id: userId,
        },
        data: {
          personality: {
            update: updatedPersonality,
          },
        },
      });

      // console.log('itemPersonality', itemPersonality);
      // console.log('updatedPersonality', updatedPersonality);
      // console.log('updatedUser', updatedUser);

      return {
        reaction: reaction,
        updatedPersonality: updatedPersonality,
        userPersonality: user.personality,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('This user has already reacted to this.');
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      //TODO remove the existing influence on the user
      const reaction = await this.databaseService.reaction.findUnique({
        where: {
          id: id,
        },
        include: {
          user: {
            include: {
              personality: true,
            },
          },
        },
      });

      const updatedPersonality = { ...reaction.user.personality }; // Copy existing personality
      let itemPersonality: Prisma.PersonalityCreateInput;

      const entity = reaction.entity;
      //QUOTE
      if (entity === ReactionEntity.QUOTE) {
        // Fetch details of the quote for which the reaction is being created
        const quote = await this.databaseService.quote.findUnique({
          where: {
            id: reaction.quoteId,
          },
          include: {
            personality: true,
          },
        });

        if (!quote) {
          throw new Error(`Quote with ID ${reaction.quoteId} not found.`);
        }

        itemPersonality = quote.personality;
      } else if (entity === ReactionEntity.BOOK) {
        const book = await this.databaseService.book.findUnique({
          where: {
            id: reaction.bookId,
          },
          include: {
            personality: true,
          },
        });

        if (!book) {
          throw new Error(`Book with ID ${reaction.bookId} not found.`);
        }
        itemPersonality = book.personality;
      } else if (entity === ReactionEntity.AUTHOR) {
        const author = await this.databaseService.author.findUnique({
          where: {
            id: reaction.authorId,
          },
          include: {
            personality: true,
          },
        });

        if (!author) {
          throw new Error(`Author with ID ${reaction.authorId} not found.`);
        }
        itemPersonality = author.personality;
      }

      removePersonalityCalc(updatedPersonality, itemPersonality, reaction);

      await this.databaseService.user.update({
        where: {
          id: reaction.userId,
        },
        data: {
          personality: {
            update: updatedPersonality,
          },
        },
      });

      const deletedReaction = await this.databaseService.reaction.delete({
        where: {
          id: id,
        },
      });
      return deletedReaction;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ConflictException(
            'This reaction has been already unreacted for this user',
          );
        }
      }
      throw error;
    }
  }

  async findAllReactions(
    userId: number,
    type?: ReactionType,
    entity?: ReactionEntity,
    favorite?: string,
    list?: string,
  ) {
    try {
      // Build the where clause based on provided filters
      const whereClause: Prisma.ReactionWhereInput = { userId };

      if (type) {
        whereClause.type = type;
      }

      if (entity) {
        whereClause.entity = entity;
      }

      if (favorite === 'false') {
        whereClause.favorite = false;
      }
      if (favorite === 'true') {
        whereClause.favorite = true;
      }
      if (list === 'false') {
        whereClause.list = false;
      }
      if (list === 'true') {
        whereClause.list = true;
      }

      // Build the include clause based on the provided entity
      const includeClause: Prisma.ReactionInclude = {
        book: entity === ReactionEntity.BOOK || !entity,
        author: entity === ReactionEntity.AUTHOR || !entity,
        quote: entity === ReactionEntity.QUOTE || !entity,
      };

      // Fetch reactions based on the constructed where and include clauses
      const reactions = await this.databaseService.reaction.findMany({
        where: whereClause,
        include: includeClause,
      });
      return reactions;
    } catch (error) {
      console.log('Error fetching reactions', error);
      throw error;
    }
  }

  // async findAllUsers(quoteId: number) {
  //   try {
  //     return await this.databaseService.favoriteQuote.findMany({
  //       where: {
  //         quoteId: quoteId,
  //       },
  //       include: {
  //         user: {
  //           select: {
  //             id: true,
  //             firstName: true,
  //             lastName: true,
  //           },
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     console.log('Error fetching favorited quotes:', error);
  //     throw error;
  //   }
  // }

  // findOne(id: number) {
  //   return this.databaseService.favoriteQuote.findUnique({
  //     where: {
  //       id: id,
  //     },
  //   });
  // }

  // update(id: number, updateFavoriteQuoteDto: UpdateFavoriteQuoteDto) {
  //   return `This action updates a #${id} favoriteQuote`;
  // }
}
