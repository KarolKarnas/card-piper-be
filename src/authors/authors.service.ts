import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthorsService {
  constructor(private readonly databaseService: DatabaseService) {}
  // create() {
  //   return 'This action adds a new author';
  // }

  findAll() {
    return this.databaseService.author.findMany();
  }

  findOne(id: number) {
    return this.databaseService.author.findUnique({
      where: {
        id,
      },
      // include all quotes by author
      include: {
        quotes: true,
      },
    });
  }

  // update(id: number) {
  //   return `This action updates a #${id} author`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} author`;
  // }
}
