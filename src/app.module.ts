import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '../config/configuration';
import { MailModule } from '../mail/mail.module';
import { LogModule } from './log/log.module';

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
    MailModule,
    LogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // export class AppModule implements NestModule {
  //   configure(consumer: MiddlewareConsumer): void {
  //     consumer.apply(AppLoggerMiddleware).forRoutes('*');
  //   }
}
