import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { calculateEuclideanDistance } from '../utils';

@Injectable()
export class QuotesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createQuoteDto: Prisma.QuoteCreateInput) {
    return this.databaseService.quote.create({
      data: createQuoteDto,
    });
  }

  async findAll(
    skip: number,
    take: number,
    assertiveTurbulent: number,
    extroversionIntroversion: number,
    judgingPerceiving: number,
    sensingIntuition: number,
    thinkingFeeling: number,
  ) {
    const userPersonality = {
      assertiveTurbulent,
      extroversionIntroversion,
      judgingPerceiving,
      sensingIntuition,
      thinkingFeeling,
    };

    if (userPersonality !== null) {
      const quotes = await this.databaseService.quote.findMany({
        include: {
          personality: true,
          author: {
            select: {
              name: true,
            },
          },
        },
      });

      const quotesWithDistances = quotes.map((quote) => {
        const distance = calculateEuclideanDistance(
          userPersonality,
          quote.personality,
        );
        return { ...quote, distance };
      });

      const sortedQuotesWithDistances = quotesWithDistances.sort(
        (a, b) => a.distance - b.distance,
      );

      return sortedQuotesWithDistances.slice(skip, skip + take);
    }
  }

  async findOne(id: number) {
    return this.databaseService.quote.findUnique({
      where: {
        id,
      },
    });
  }
  async update(id: number, updateQuoteDto: Prisma.QuoteCreateInput) {
    return this.databaseService.quote.update({
      where: {
        id,
      },
      data: updateQuoteDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.quote.delete({
      where: {
        id,
      },
    });
  }
}
