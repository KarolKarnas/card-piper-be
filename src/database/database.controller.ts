import { Controller, Delete, Post } from '@nestjs/common';
import { DatabaseService } from './database.service';
// import { AdminGuard } from '../auth/guard';

// @UseGuards(AdminGuard)
@Controller('database') // /users
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Delete('users')
  deleteUsers() {
    return this.databaseService.deleteUsers();
  }

  // @Post('quotes')
  // populateQuotes() {
  //   return this.databaseService.populateQuotes();
  // }

  @Delete('quotes')
  deleteQuotes() {
    return this.databaseService.deleteQuotes();
  }

  @Post('populate')
  populateDB() {
    return this.databaseService.populateDB();
  }
}
