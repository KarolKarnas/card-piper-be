import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtGuard } from './jwt.guard'; // Adjust the path as necessary

@Injectable()
export class AdminGuard extends JwtGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, ensure the JWT Guard validates the request
    await super.canActivate(context);

    // Get the request object
    const request = context.switchToHttp().getRequest();

    // Extract the user from the request (assuming user is added by JwtGuard)
    const user = request.user;

    // Check if the user role is 'ADMIN'
    if (user && user.role === 'ADMIN') {
      return true;
    } else {
      throw new UnauthorizedException(
        'You are not authorized to access this resource as an admin.',
      );
    }
  }
}
