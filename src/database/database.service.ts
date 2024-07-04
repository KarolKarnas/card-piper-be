import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { quotesData } from './database_secret/data';

@Injectable()
export class DatabaseService extends PrismaClient<
  Prisma.PrismaClientOptions,
  'query' | 'info' | 'warn' | 'error'
> {
  constructor(config: ConfigService) {
    super({
      // log: [
      //   { emit: 'event', level: 'query' },
      //   { emit: 'stdout', level: 'info' },
      //   { emit: 'stdout', level: 'warn' },
      //   { emit: 'stdout', level: 'error' },
      // ],
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    this.$on('query', (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });

    await this.$connect();
  }

  async cleanDb() {
    return this.$transaction([
      this.favoriteQuote.deleteMany(),
      this.user.deleteMany(),
      this.quote.deleteMany(),
    ]);
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

  // async populateQuotes() {
  //   return this.quote.createMany({ data: quotesData });
  // }

  async deleteQuotes() {
    return this.$transaction([this.quote.deleteMany()]);
  }

  async populateDB() {
    const authors = quotesData.map((quote) => quote.author);
    const uniqueAuthors = [...new Set(authors)];
    const authorsObjects = uniqueAuthors.map((author) => ({
      name: author,
    }));

    // Create authors
    const authorPromises = authorsObjects.map((author) =>
      this.author.upsert({
        where: { name: author.name },
        update: {},
        create: { name: author.name },
      }),
    );
    const createdAuthors = await Promise.all(authorPromises);

    // Create a map to easily get the authorId by name
    const authorMap = createdAuthors.reduce((acc, author) => {
      acc[author.name] = author.id;
      return acc;
    }, {});

    console.log(authorMap);

    // Create quotes with authorId
    const quotePromises = quotesData.map((quote) => {
      return this.quote.upsert({
        where: {
          text_authorId: {
            text: quote.text,
            authorId: authorMap[quote.author],
          },
        },
        update: {},
        create: {
          text: quote.text,
          origin: quote.origin,
          popularity: quote.popularity,
          tags: quote.tags,
          authorId: authorMap[quote.author],
        },
      });
    });
    return await Promise.all(quotePromises);
  }
}
