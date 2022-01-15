import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { AuthService } from '../auth/auth.service';
import { ROLES_KEY } from '../decorators/user-role.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const token = req.headers.authorization;
      //TODO refresh token

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      });
      const docAuthByUserId = await this.authService.findAuthByUserId(
        payload['id'],
      );

      if (!docAuthByUserId) {
        throw new ForbiddenException('token not found');
      }

      const requiredRole = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRole) {
        return true;
      }

      const access = requiredRole.includes(payload['role']);
      return access;
    } catch (e) {
      throw new ForbiddenException(`No access: ${e.message}`);
    }
  }
}
