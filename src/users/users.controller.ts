import {
  Body,
  Controller,
  // Delete,
  Get,
  // Param,
  // Patch,
  Post,
  Query,
  UseGuards,
  // ParseIntPipe,
  // ValidationPipe,
} from '@nestjs/common';
import { Prisma, User, UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { AdminGuard } from 'src/auth/guard';

//guard all endpoints
@UseGuards(JwtGuard)
@Controller('users') // /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
  @UseGuards(AdminGuard)
  @Get() // GET /users or /users?role=value
  findAll(@Query('role') role?: UserRole) {
    return this.usersService.findAll(role);
  }

  // @Get(':id') // GET /users/:id
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.usersService.findOne(id);
  // }

  //remove???
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

// ___________

// @Get() // GET /users or /users?role=value
// findAll(@GetUser() user: User, @Query('role') role?: UserRole) {
//   if (user.role === 'ADMIN') {
//     ('admin');
//     return this.usersService.findAll(role);
//   } else {
//     return { message: 'Sorry, you need to be an admin' };
//   }
// }
