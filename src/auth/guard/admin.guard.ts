import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtGuard } from './jwt.guard';

@Injectable()
export class AdminGuard extends JwtGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.role === 'ADMIN') {
      return true;
    } else {
      throw new UnauthorizedException(
        'You are not authorized to access this resource as an admin.',
      );
    }
  }
}
