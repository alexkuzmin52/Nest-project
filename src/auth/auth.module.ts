import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailModule } from '../../mail/mail.module';
import { UserModule } from '../user/user.module';
import { authSchema } from './schemas/auth-schema';
import { LogModule } from '../log/log.module';

@Module({
  imports: [
    JwtModule.register({}),
    LogModule,
    MailModule,
    MongooseModule.forFeature([{ name: 'auth', schema: authSchema }]),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
