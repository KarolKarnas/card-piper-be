import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

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

  create(createUserDto: Prisma.UserCreateInput) {
    return this.databaseService.user.create({ data: createUserDto });
  }

  // update(id: number, updatedUserDto: UpdateUserDto) {
  //   this.users = this.users.map((user) => {
  //     if (user.id === id) {
  //       return { ...user, ...updatedUserDto };
  //     }

  //     return user;
  //   });

  //   return this.findOne(id);
  // }

  // delete(id: number) {
  //   const removedUser = this.findOne(id);

  //   this.users = this.users.filter((user) => user.id !== id);

  //   return removedUser;
  // }
}
