import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  ReactionEntity,
  ReactionType,
  User,
  UserRole,
} from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  private determinePersonalityType(personality) {
    const type = [
      personality.extroversionIntroversion < 0 ? 'E' : 'I',
      personality.sensingIntuition < 0 ? 'S' : 'N',
      personality.thinkingFeeling < 0 ? 'T' : 'F',
      personality.judgingPerceiving < 0 ? 'J' : 'P',
    ].join('');

    const flag = personality.assertiveTurbulent < 0 ? 'A' : 'T';

    return `${type}-${flag}`;
  }

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

  async findMe(user: User) {
    const userMe = await this.databaseService.user.findUnique({
      where: {
        email: user.email,
      },
      include: {
        personality: {
          select: {
            extroversionIntroversion: true,
            sensingIntuition: true,
            thinkingFeeling: true,
            judgingPerceiving: true,
            assertiveTurbulent: true,
          },
        },
        reactions: {
          include: {
            book: true,
            author: true,
            quote: true,
            character: true,
            reactedUser: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!userMe) {
      return null;
    }

    const reactionTotals = {
      TOTAL: userMe.reactions.length,
      [ReactionEntity.AUTHOR]: {
        TOTAL: 0,
        [ReactionType.LOVE]: 0,
        [ReactionType.LIKE]: 0,
        [ReactionType.DISLIKE]: 0,
        [ReactionType.HATE]: 0,
      },
      [ReactionEntity.BOOK]: {
        TOTAL: 0,
        [ReactionType.LOVE]: 0,
        [ReactionType.LIKE]: 0,
        [ReactionType.DISLIKE]: 0,
        [ReactionType.HATE]: 0,
      },
      [ReactionEntity.QUOTE]: {
        TOTAL: 0,
        [ReactionType.LOVE]: 0,
        [ReactionType.LIKE]: 0,
        [ReactionType.DISLIKE]: 0,
        [ReactionType.HATE]: 0,
      },
      [ReactionEntity.CHARACTER]: {
        TOTAL: 0,
        [ReactionType.LOVE]: 0,
        [ReactionType.LIKE]: 0,
        [ReactionType.DISLIKE]: 0,
        [ReactionType.HATE]: 0,
      },
      [ReactionEntity.USER]: {
        TOTAL: 0,
        [ReactionType.LOVE]: 0,
        [ReactionType.LIKE]: 0,
        [ReactionType.DISLIKE]: 0,
        [ReactionType.HATE]: 0,
      },
    };

    const latestReactions = {
      [ReactionEntity.AUTHOR]: {
        [ReactionType.LOVE]: [],
        [ReactionType.LIKE]: [],
        [ReactionType.DISLIKE]: [],
        [ReactionType.HATE]: [],
      },
      [ReactionEntity.BOOK]: {
        [ReactionType.LOVE]: [],
        [ReactionType.LIKE]: [],
        [ReactionType.DISLIKE]: [],
        [ReactionType.HATE]: [],
      },
      [ReactionEntity.QUOTE]: {
        [ReactionType.LOVE]: [],
        [ReactionType.LIKE]: [],
        [ReactionType.DISLIKE]: [],
        [ReactionType.HATE]: [],
      },
      [ReactionEntity.CHARACTER]: {
        [ReactionType.LOVE]: [],
        [ReactionType.LIKE]: [],
        [ReactionType.DISLIKE]: [],
        [ReactionType.HATE]: [],
      },
      [ReactionEntity.USER]: {
        [ReactionType.LOVE]: [],
        [ReactionType.LIKE]: [],
        [ReactionType.DISLIKE]: [],
        [ReactionType.HATE]: [],
      },
    };

    for (const reaction of userMe.reactions) {
      const { entity, type } = reaction;
      reactionTotals[entity].TOTAL += 1;
      reactionTotals[entity][type] += 1;

      if (latestReactions[entity][type].length < 3) {
        latestReactions[entity][type].push(reaction);
      }
    }

    const personalityType = this.determinePersonalityType(userMe.personality);
    // console.log(reactionTotals);
    // console.log(latestReactions);

    return {
      id: userMe.id,
      email: userMe.email,
      role: userMe.role,
      firstName: userMe.firstName,
      lastName: userMe.lastName,
      personality: userMe.personality,
      total_reaction: reactionTotals,
      latest_reaction: latestReactions,
      personalityType: personalityType,
      darkTheme: userMe.darkTheme,
    };
  }

  async updateMe(user: User, darkTheme?: boolean) {
    const userMe = await this.databaseService.user.findUnique({
      where: {
        email: user.email,
      },
    });

    console.log(userMe);
    console.log(darkTheme);
    if (!userMe) {
      throw new NotFoundException('User not found');
    }

    if (darkTheme === false || darkTheme === true) {
      await this.databaseService.user.update({
        where: { email: user.email },
        data: {
          darkTheme: darkTheme,
        },
      });
      return { message: `Your dark theme is set to ${darkTheme}` };
    }

    return null;
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
