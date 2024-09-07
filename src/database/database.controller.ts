import { Body, Controller, Delete, Post } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { PopulateData } from './database.types';
// import { AdminGuard } from '../auth/guard';

// @UseGuards(AdminGuard)

@Controller('database') // /users
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Delete('users')
  deleteUsers() {
    return this.databaseService.deleteUsers();
  }

  @Post('clean')
  cleanDB() {
    return this.databaseService.cleanDB();
  }

  @Post('populate')
  populateDB(@Body() populateData: PopulateData) {
    return this.databaseService.populateDB(populateData);
  }
}
