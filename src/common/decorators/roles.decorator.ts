// SetMetadata stores route metadata that guards can read later.
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/user-role.type';

// Use one key name so the decorator and guard read the same metadata.
export const ROLES_KEY = 'roles';

// Attach allowed roles to a controller or route handler.
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
