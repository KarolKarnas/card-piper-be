import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BooksService {
  constructor(private readonly databaseService: DatabaseService) {}
  create(createBookDto: Prisma.BookCreateInput) {
    return this.databaseService.book.create({
      data: createBookDto,
    });
  }

  findAll(skip: number, take: number) {
    if (skip === 0 && take === 0) return this.databaseService.book.findMany();
    return this.databaseService.book.findMany({ skip: skip, take: take });
  }

  async findOne(id: number) {
    return this.databaseService.book.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateBookDto: Prisma.BookCreateInput) {
    return this.databaseService.book.update({
      where: {
        id,
      },
      data: updateBookDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.book.delete({
      where: {
        id,
      },
    });
  }
}
