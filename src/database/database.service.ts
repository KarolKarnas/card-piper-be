import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { quotesData } from './database_secret/data';

@Injectable()
export class DatabaseService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async deleteUsers() {
    return this.$transaction([
      this.user.deleteMany({
        where: {
          NOT: [{ email: 'admin@admin.com' }, { email: 'user@user.com' }],
        },
      }),
    ]);
  }

  async populateQuotes() {
    return this.$transaction([this.quote.createMany({ data: quotesData })]);
  }

  async deleteQuotes() {
    return this.$transaction([this.quote.deleteMany()]);
  }
}
