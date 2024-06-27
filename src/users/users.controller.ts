import {
  Body,
  Controller,
  // Delete,
  Get,
  // Param,
  // Patch,
  Post,
  Query,
  // ParseIntPipe,
  // ValidationPipe,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { UsersService } from './users.service';

@Controller('users') // /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() // GET /users or /users?role=value
  findAll(@Query('role') role?: UserRole) {
    return this.usersService.findAll(role);
  }

  // @Get(':id') // GET /users/:id
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.usersService.findOne(id);
  // }

  @Post() // POST /users
  create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.usersService.create(createUserDto);
  }

  // @Patch(':id') // PATCH /users/:id
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  // ) {
  //   return this.usersService.update(id, updateUserDto);
  // }

  // @Delete(':id') // GET /users/:id
  // delete(@Param('id', ParseIntPipe) id: number) {
  //   return this.usersService.delete(id);
  // }
}
