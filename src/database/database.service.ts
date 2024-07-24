import { Injectable } from '@nestjs/common';
import {
  Prisma,
  PrismaClient,
  ReactionEntity,
  ReactionType,
  UserRole,
} from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import {
  quotesData,
  bookDataCharacters,
  authorData,
} from './database_secret/data';
import * as argon2 from 'argon2';

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
    const bookAuthors = bookDataCharacters.map((book) => book.author);
    const authors = [...authorNames, ...quoteAuthors, ...bookAuthors];
    const uniqueAuthors = [...new Set(authors)];
    const authorsObjects = uniqueAuthors.map((author) => ({
      name: author,
    }));

    // extract characters data
    const mappedCharacters = bookDataCharacters.flatMap((book) =>
      book.characters.map((character) => ({
        name: character.name,
        book: book.title,
        author: book.author,
      })),
    );

    const charactersData = [];

    mappedCharacters.forEach((entry) => {
      const existingEntry = charactersData.find(
        (item) => item.name === entry.name,
      );
      if (existingEntry) {
        if (!existingEntry.books.includes(entry.book)) {
          existingEntry.books.push(entry.book);
        }
      } else {
        charactersData.push({
          name: entry.name,
          books: [entry.book],
          author: entry.author,
        });
      }
    });

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
        entity: ReactionEntity.AUTHOR,
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

    const bookPromises = bookDataCharacters.map((book) => {
      const randomPersonality = {
        extroversionIntroversion: getRandomNumber(),
        sensingIntuition: getRandomNumber(),
        thinkingFeeling: getRandomNumber(),
        judgingPerceiving: getRandomNumber(),
        assertiveTurbulent: getRandomNumber(),
        entity: ReactionEntity.BOOK,
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
          pages: book.pages,
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
        entity: ReactionEntity.QUOTE,
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

    // Create characters with authorId
    const characterPromises = charactersData.map((character) => {
      const randomPersonality = {
        extroversionIntroversion: getRandomNumber(),
        sensingIntuition: getRandomNumber(),
        thinkingFeeling: getRandomNumber(),
        judgingPerceiving: getRandomNumber(),
        assertiveTurbulent: getRandomNumber(),
        entity: ReactionEntity.CHARACTER,
      };

      return this.character.upsert({
        where: {
          name_authorId: {
            name: character.name,
            authorId: authorMap[character.author],
          },
        },
        update: {},
        create: {
          name: character.name,
          books: {
            connect: character.books.map((book) => ({
              id: bookMap[book],
            })),
          },
          author: {
            connect: { id: authorMap[character.author] },
          },
          rating: 10,
          popularity: 1,
          description: 'Cool character',
          bornPlace: 'Warsaw',
          bornDate: '06.06.2024',
          deathDate: '06.06.2224',
          image: 'fake/link.com',
          personality: {
            create: randomPersonality,
          },
        },
      });
    });
    await Promise.all(characterPromises);

    // USERS
    const users = [
      { email: 'admin@admin.com', password: 'admin' },
      { email: 'user@user.com', password: 'user' },
      { email: 'test@test.com', password: 'test' },
    ];

    const userPromises = users.map(async (user) => {
      const hash = await argon2.hash(user.password);
      const zeroPersonality = {
        extroversionIntroversion: 0,
        sensingIntuition: 0,
        thinkingFeeling: 0,
        judgingPerceiving: 0,
        assertiveTurbulent: 0,
        entity: ReactionEntity.USER,
      };
      return this.user.upsert({
        where: {
          email: user.email,
        },
        update: {},
        create: {
          email: user.email,
          hash,
          role:
            user.email === 'admin@admin.com' ? UserRole.ADMIN : UserRole.USER,
          darkTheme: false,
          personality: {
            create: zeroPersonality,
          },
        },
      });
    });

    await Promise.all(userPromises);

    // REACTIONS

    const reactions = [
      {
        userId: 1,
        characterId: 1,
        type: ReactionType.LOVE,
        entity: ReactionEntity.CHARACTER,
        favorite: true,
        list: true,
      },
      {
        userId: 1,
        bookId: 1,
        type: ReactionType.HATE,
        entity: ReactionEntity.BOOK,
        favorite: true,
        list: true,
      },
      {
        userId: 1,
        authorId: 1,
        type: ReactionType.LIKE,
        entity: ReactionEntity.AUTHOR,
        favorite: true,
        list: true,
      },
      {
        userId: 1,
        quoteId: 1,
        type: ReactionType.DISLIKE,
        entity: ReactionEntity.QUOTE,
        favorite: true,
        list: true,
      },
      {
        userId: 1,
        reactedUserId: 2,
        type: ReactionType.HATE,
        entity: ReactionEntity.USER,
        favorite: false,
        list: false,
      },
    ];

    function buildWhereClause(reaction) {
      const { userId, characterId, bookId, authorId, quoteId, reactedUserId } =
        reaction;
      if (characterId) return { userId_characterId: { userId, characterId } };
      if (bookId) return { userId_bookId: { userId, bookId } };
      if (authorId) return { userId_authorId: { userId, authorId } };
      if (quoteId) return { userId_quoteId: { userId, quoteId } };
      if (reactedUserId)
        return { userId_reactedUserId: { userId, reactedUserId } };
    }

    const reactionPromises = reactions.map(async (reaction) => {
      const whereClause = buildWhereClause(reaction);

      return this.reaction.upsert({
        where: whereClause as Prisma.ReactionWhereUniqueInput,
        update: {}, // No updates needed
        create: {
          userId: reaction.userId,
          characterId: reaction.characterId,
          bookId: reaction.bookId,
          authorId: reaction.authorId,
          quoteId: reaction.quoteId,
          reactedUserId: reaction.reactedUserId,
          type: reaction.type,
          entity: reaction.entity,
          favorite: reaction.favorite,
          list: reaction.list,
        },
      });
    });

    await Promise.all(reactionPromises);

    return { message: 'DATABASE POPULATED SIR!' };
  }
}
