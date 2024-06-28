import { Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { AdminGuard } from 'src/auth/guard/admin.guard';

@UseGuards(AdminGuard)
@Controller('database') // /users
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Delete('users')
  deleteUsers() {
    return this.databaseService.deleteUsers();
  }

  @Post('quotes')
  populateQuotes() {
    return this.databaseService.populateQuotes();
  }

  @Delete('quotes')
  deleteQuotes() {
    return this.databaseService.deleteQuotes();
  }
}
