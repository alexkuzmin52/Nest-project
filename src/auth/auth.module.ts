import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { authSchema } from './schemas/auth-schema';
import { ModuleRef } from '@nestjs/core';
import { User } from '../user/schemas/user-schema';
import { UserModule } from '../user/user.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: 'auth', schema: authSchema }]),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
