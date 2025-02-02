import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FavoriteQuoteService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    createFavoriteQuoteDto: Prisma.FavoriteQuoteUncheckedCreateInput,
  ) {
    try {
      const favoriteQuote = await this.databaseService.favoriteQuote.create({
        data: {
          user: {
            connect: {
              id: createFavoriteQuoteDto.userId,
            },
          },
          quote: {
            connect: {
              id: createFavoriteQuoteDto.quoteId,
            },
          },
        },
      });
      return favoriteQuote;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'This user has already favorited this quote.',
          );
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.databaseService.favoriteQuote.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ConflictException(
            'This quote has been already unfavored for this user',
          );
        }
      }
      throw error;
    }
  }

  async findAllQuotes(userId: number) {
    try {
      return await this.databaseService.favoriteQuote.findMany({
        where: {
          userId: userId,
        },
        include: {
          quote: true,
        },
      });
    } catch (error) {
      console.log('Error fetching favorited quotes:', error);
      throw error;
    }
  }

  async findAllUsers(quoteId: number) {
    try {
      return await this.databaseService.favoriteQuote.findMany({
        where: {
          quoteId: quoteId,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    } catch (error) {
      console.log('Error fetching favorited quotes:', error);
      throw error;
    }
  }
}
