// Nest common provides the guard contract and HTTP exception classes.
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
// Reflector reads metadata added by custom decorators like @Roles().
import { Reflector } from '@nestjs/core';
// Express types describe the request object used by Nest's Express adapter.
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/user-role.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  // Allow the request only when its x-user-role header matches @Roles().
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    // Read the role from headers to keep this basic example database-free.
    const request = context.switchToHttp().getRequest<Request>();
    const roleHeader = request.headers['x-user-role'];
    const userRole = Array.isArray(roleHeader) ? roleHeader[0] : roleHeader;

    if (userRole && requiredRoles.includes(userRole as UserRole)) {
      return true;
    }

    throw new ForbiddenException(
      `Required role: ${requiredRoles.join(' or ')}`,
    );
  }
}
