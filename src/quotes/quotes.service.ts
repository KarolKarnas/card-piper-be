import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { PersonalityData } from '../utils/types';

@Injectable()
export class QuotesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createQuoteDto: Prisma.QuoteCreateInput) {
    return this.databaseService.quote.create({
      data: createQuoteDto,
    });
  }

  async findAll(skip: number, take: number, userPersonality: PersonalityData) {
    // function calculateEuclideanDistance(p1, p2) {
    //   return Math.sqrt(
    //     Math.pow(p1.extroversionIntroversion - p2.extroversionIntroversion, 2) +
    //       Math.pow(p1.sensingIntuition - p2.sensingIntuition, 2) +
    //       Math.pow(p1.thinkingFeeling - p2.thinkingFeeling, 2) +
    //       Math.pow(p1.judgingPerceiving - p2.judgingPerceiving, 2) +
    //       Math.pow(p1.assertiveTurbulent - p2.assertiveTurbulent, 2),
    //   );
    // }

    if (skip === 0 && take === 0) return this.databaseService.quote.findMany();

    if (userPersonality) {
      const quotes = this.databaseService.quote.findMany();
      console.log(quotes);
      console.log(userPersonality);
    }

    return this.databaseService.quote.findMany({ skip: skip, take: take });
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
