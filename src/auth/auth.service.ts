import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { SignupDto } from './dto';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    const hash = await argon2.hash(signupDto.password);
    const adminSecret = Boolean(this.config.get('ADMIN_SECRET'));

    try {
      const zeroPersonality = {
        extroversionIntroversion: 0,
        sensingIntuition: 0,
        thinkingFeeling: 0,
        judgingPerceiving: 0,
        assertiveTurbulent: 0,
      };
      const user = await this.databaseService.user.create({
        data:
          adminSecret && signupDto.email === 'admin@admin.com'
            ? {
                email: signupDto.email,
                hash,
                role: 'ADMIN',
                personality: {
                  create: zeroPersonality,
                },
              }
            : {
                email: signupDto.email,
                hash,
                role: 'USER',
                personality: {
                  create: zeroPersonality,
                },
              },
      });

      return this.signToken(user.id, user.email);
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

    return this.signToken(user.id, user.email);
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
