import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CharacterService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.character.findMany();
  }

  findOne(id: number) {
    return this.databaseService.quote.findUnique({
      where: {
        id,
      },
    });
  }
}
