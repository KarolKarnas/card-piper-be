import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { SignupDto } from './dto';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ReactionEntity, UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    const hash = await argon2.hash(signupDto.password);
    // const adminSecret = Boolean(this.config.get('ADMIN_SECRET'));

    try {
      const zeroPersonality = {
        extroversionIntroversion: 0,
        sensingIntuition: 0,
        thinkingFeeling: 0,
        judgingPerceiving: 0,
        assertiveTurbulent: 0,
        entity: ReactionEntity.USER,
      };
      const user = await this.databaseService.user.create({
        data: {
          email: signupDto.email,
          hash,
          role: UserRole.USER,
          darkTheme: false,
          personality: {
            create: zeroPersonality,
          },
        },
      });

      const { access_token } = await this.signToken(user.id, user.email);

      return {
        access_token,
      };
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

    const { access_token } = await this.signToken(user.id, user.email);

    return {
      access_token,
    };
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1y',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
