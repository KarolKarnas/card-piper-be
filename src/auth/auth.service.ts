import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SignupDto } from './dto';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async signup(signupDto: SignupDto) {
    const hash = await argon2.hash(signupDto.password);

    try {
      const user = await this.databaseService.user.create({
        data: { email: signupDto.email, hash, role: 'USER' },
      });

      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(signupDto: SignupDto) {
    const user = await this.databaseService.user.findUnique({
      where: { email: signupDto.email },
    });

    if (!user) {
      throw new ForbiddenException('Incorrect credentials');
    }

    const pwMatches = await argon2.verify(user.hash, signupDto.password);

    if (!pwMatches) {
      throw new ForbiddenException('Incorrect credentials');
    }

    delete user.hash;
    return user;
  }
}
