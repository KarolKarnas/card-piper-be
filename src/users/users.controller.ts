import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Body,
  ParseBoolPipe,
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { AdminGuard } from '../auth/guard';

//guard all endpoints
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return this.usersService.findMe(user);
  }

  @Patch('me')
  updateMe(
    @GetUser() user: User,
    @Body('darkTheme', ParseBoolPipe) darkTheme?: boolean,
  ) {
    return this.usersService.updateMe(user, darkTheme);
  }

  @UseGuards(AdminGuard)
  @Get()
  findAll(@Query('role') role?: UserRole) {
    return this.usersService.findAll(role);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id') // GET /users/:id
  delete(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.usersService.delete(id, user);
  }
}
