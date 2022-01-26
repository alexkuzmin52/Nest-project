import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '../config/configuration';
import { MailModule } from '../mail/mail.module';
import { AppLoggerMiddleware } from './user/middlewares/app-logger.middleware';
// import { AppLoggerMiddleware } from './user/middlewares/app-logger.middleware';

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
