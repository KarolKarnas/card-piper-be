import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User, UserRole } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(role?: UserRole) {
    if (role) {
      const usersWithRoles = await this.databaseService.user.findMany({
        where: {
          role: role,
        },
      });
      if (usersWithRoles.length === 0) {
        throw new NotFoundException(`User "${role}" Role Not Found`);
      }
      return usersWithRoles;
    } else {
      const users = await this.databaseService.user.findMany();
      return users;
    }
  }

  // findOne(id: number) {
  //   const user = this.users.find((user) => user.id === id);

  //   if (!user) throw new NotFoundException('User Not Found');

  //   return user;
  // }

  // async create(createUserDto: Prisma.UserCreateInput) {
  //   return this.databaseService.user.create({ data: createUserDto });
  // }

  async update(id: number, updatedUserDto: Prisma.UserCreateInput) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: updatedUserDto,
    });
  }

  async delete(id: number, user: User) {
    const currentUser = this.databaseService.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!currentUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (user.id !== id) {
      throw new ForbiddenException(
        'You do not have permission to delete this user',
      );
    }
    return this.databaseService.user.delete({
      where: {
        id,
      },
    });
  }
}
