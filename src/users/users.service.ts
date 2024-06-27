import { Injectable } from '@nestjs/common';
// import { Role } from 'src/utils/types';
import { Prisma, UserRole } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
// import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll(role?: UserRole) {
    console.log(role);
    console.log(this.databaseService.user);
    // if (role) {
    //   const roles = this.databaseService.user.filter(
    //     (user) => user.role === role,
    //   );
    //   if (roles.length === 0) {
    //     throw new NotFoundException(`User "${role}" Role Not Found`);
    //   }
    //   return roles;
    // }
    // return this.users;
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
