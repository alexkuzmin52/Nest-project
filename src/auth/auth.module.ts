import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { authSchema } from './schemas/auth-schema';
import { MailService } from '../../mail/mail.service';
import { MailModule } from '../../mail/mail.module';

@Module({
  imports: [
    JwtModule.register({}),
    MailModule,
    MongooseModule.forFeature([{ name: 'auth', schema: authSchema }]),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
