// Nest common lets us build a custom parameter decorator from request context.
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// Express types describe the HTTP request headers we read from.
import { Request } from 'express';
import { UserRole } from '../../users/user-role.type';

export interface CurrentUserInfo {
  id?: number;
  name: string;
  role?: UserRole;
}

// Normalize a header value because Express can return strings or string arrays.
const readHeader = (
  headers: Request['headers'],
  key: string,
): string | undefined => {
  const value = headers[key];
  return Array.isArray(value) ? value[0] : value;
};

// Extract the current user from request headers for controller methods.
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUserInfo => {
    const request = context.switchToHttp().getRequest<Request>();
    const id = readHeader(request.headers, 'x-user-id');
    const name = readHeader(request.headers, 'x-user-name') ?? 'Guest';
    const role = readHeader(request.headers, 'x-user-role') as
      | UserRole
      | undefined;

    return {
      id: id ? Number(id) : undefined,
      name,
      role,
    };
  },
);
