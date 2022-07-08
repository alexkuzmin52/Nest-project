import { SetMetadata } from '@nestjs/common';

import { UserStatusEnum } from '../constants';

export const STATUSES_KEY = 'statuses';
export const UserStatus = (...statuses: UserStatusEnum[]) =>
  SetMetadata(STATUSES_KEY, statuses);
