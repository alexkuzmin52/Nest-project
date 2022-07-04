import { SetMetadata } from '@nestjs/common';

import { UserRoleEnum } from '../constants/user-role-enum';

export const ROLES_KEY = 'roles';
export const UserRole = (...roles: UserRoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
