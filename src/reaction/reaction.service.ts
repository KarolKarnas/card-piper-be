import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma, ReactionType, ReactionEntity } from '@prisma/client';

@Injectable()
export class ReactionService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createReactionDto: Prisma.ReactionUncheckedCreateInput) {
    try {
      let reaction: Prisma.ReactionUncheckedCreateInput;
      const { userId, quoteId, bookId, authorId, type, entity } =
        createReactionDto;

      const updateFields: Prisma.ReactionUncheckedUpdateInput = {};
      if (type) updateFields.type = type;

      if (entity === ReactionEntity.QUOTE) {
        reaction = await this.databaseService.reaction.upsert({
          where: {
            userId_quoteId: {
              userId,
              quoteId,
            },
          },
          update: updateFields,
          create: { userId, quoteId, type, entity },
        });
      } else if (entity === ReactionEntity.BOOK) {
        reaction = await this.databaseService.reaction.upsert({
          where: {
            userId_bookId: {
              userId,
              bookId,
            },
          },
          update: updateFields,
          create: { userId, bookId, type, entity },
        });
      } else if (entity === ReactionEntity.AUTHOR) {
        reaction = await this.databaseService.reaction.upsert({
          where: {
            userId_authorId: {
              userId,
              authorId,
            },
          },
          update: updateFields,
          create: { userId, authorId, type, entity },
        });
      }

      return reaction;
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
      return await this.databaseService.reaction.delete({
        where: {
          id: id,
        },
      });
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
