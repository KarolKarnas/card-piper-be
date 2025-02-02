import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthorsService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.author.findMany();
  }

  findOne(id: number) {
    return this.databaseService.author.findUnique({
      where: {
        id,
      },
      include: {
        quotes: true,
      },
    });
  }
}
