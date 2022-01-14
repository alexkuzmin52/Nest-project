import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `config/env/.${process.env.NODE_ENV}.env`,
      load: [configuration],
    }),
    UserModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest-api'),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
