import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { quotesData, bookData, authorData } from './database_secret/data';

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
      // log: [
      //   {
      //     emit: 'event',
      //     level: 'query',
      //   },
      // ],
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
    const getRandomNumber = () => {
      return Math.random() * 2 - 1; // Generates a number in range [-1, 1)
    };
    //extract unique authors
    const authorNames = authorData.map((author) => author.name);
    const quoteAuthors = quotesData.map((quote) => quote.author);
    const bookAuthors = bookData.map((book) => book.author);
    const authors = [...authorNames, ...quoteAuthors, ...bookAuthors];
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

    // Update authors
    const updateAuthorPromises = authorData.map((author) => {
      const randomPersonality = {
        extroversionIntroversion: getRandomNumber(),
        sensingIntuition: getRandomNumber(),
        thinkingFeeling: getRandomNumber(),
        judgingPerceiving: getRandomNumber(),
        assertiveTurbulent: getRandomNumber(),
      };
      return this.author.update({
        where: { name: author.name },
        data: {
          bornPlace: author.bornPlace,
          bornDate: author.bornDate,
          deathDate: author.deathDate,
          website: author.website,
          genres: author.genres,
          bio: author.bio,
          rating: author.rating,
          popularity: author.popularity,
          image: author.image,
          personality: {
            create: randomPersonality,
          },
        },
      });
    });

    await Promise.all(updateAuthorPromises);

    const bookPromises = bookData.map((book) => {
      const randomPersonality = {
        extroversionIntroversion: getRandomNumber(),
        sensingIntuition: getRandomNumber(),
        thinkingFeeling: getRandomNumber(),
        judgingPerceiving: getRandomNumber(),
        assertiveTurbulent: getRandomNumber(),
      };
      return this.book.upsert({
        where: {
          title_authorId: {
            title: book.title,
            authorId: authorMap[book.author],
          },
        },
        update: {},
        create: {
          title: book.title,
          rating: book.rating,
          popularity: book.popularity,
          description: book.description,
          genres: { set: book.genres }, // Assuming genres is an array of strings
          author: { connect: { id: authorMap[book.author] } },
          date: new Date(book.date),
          image: book.image,
          personality: { create: randomPersonality },
        },
      });
    });
    const createdBooks = await Promise.all(bookPromises);

    // Create a map to easily get the bookId by title
    const bookMap = createdBooks.reduce((acc, book) => {
      acc[book.title] = book.id;
      return acc;
    }, {});

    // Create quotes with authorId
    const quotePromises = quotesData.map((quote) => {
      const randomPersonality = {
        extroversionIntroversion: getRandomNumber(),
        sensingIntuition: getRandomNumber(),
        thinkingFeeling: getRandomNumber(),
        judgingPerceiving: getRandomNumber(),
        assertiveTurbulent: getRandomNumber(),
      };

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
          tags: { set: quote.tags }, // Assuming tags is an array of strings
          author: { connect: { id: authorMap[quote.author] } },
          book:
            quote.origin && bookMap[quote.origin]
              ? { connect: { id: bookMap[quote.origin] } }
              : undefined,
          personality: {
            create: randomPersonality,
          },
        },
      });
    });
    await Promise.all(quotePromises);

    // const users = [
    //   { email: 'admin@admin.com', password: 'admin' },
    //   { email: 'user@user.com', password: 'user' },
    //   { email: 'test@test.com', password: 'test' },
    // ];

    // const userPromises = users.map((user) =>
    //   this.user.upsert({
    //     where: {
    //       email: user.email,
    //     },
    //     update: {},
    //     create: {
    //       email: user.email,
    //       password: user.password,
    //     },
    //   }),
    // );

    return { message: 'DATABASE POPULATED SIR!' };
  }
}
