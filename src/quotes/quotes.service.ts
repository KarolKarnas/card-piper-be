import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class QuotesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createQuoteDto: Prisma.QuoteCreateInput) {
    return this.databaseService.quote.create({
      data: createQuoteDto,
    });
  }

  async findAll() {
    return this.databaseService.quote.findMany();
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
