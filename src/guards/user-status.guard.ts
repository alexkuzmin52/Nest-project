import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserStatusEnum } from '../constants';

@Injectable()
export class UserStatusGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const upload = req.headers.authorization;
    return upload.status !== UserStatusEnum.BLOCKED;
  }
}
