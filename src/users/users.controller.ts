import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Role, UserNoId, UserNoIdOptional } from 'src/utils/types';
import { UsersService } from './users.service';

@Controller('users') // /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  /*
GET /users
GET /users/:id
POST /users
PATCH /users/:id
DELETE / users/:id
  */

  @Get() // GET /users or /users?role=value
  findAll(@Query('role') role?: Role) {
    return this.usersService.findAll(role);
  }

  @Get(':id') // GET /users/:id
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post() // POST /users
  create(@Body() user: UserNoId) {
    return this.usersService.create(user);
  }

  @Patch(':id') // PATCH /users/:id
  update(@Param('id') id: string, @Body() userUpdate: UserNoIdOptional) {
    return this.usersService.update(+id, userUpdate);
  }

  @Delete(':id') // GET /users/:id
  delete(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
