import { SetMetadata } from '@nestjs/common';
import { UserStatusEnum } from '../user/constants/user-status-enum';

export const STATUSES_KEY = 'statuses';
export const UserStatus = (...statuses: UserStatusEnum[]) =>
  SetMetadata(STATUSES_KEY, statuses);
