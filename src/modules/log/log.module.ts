import { AuthModule } from '../auth/auth.module';
import { Log, logSchema } from './schemas/log-schema';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: logSchema }]),
    forwardRef(() => AuthModule),
  ],
  providers: [LogService],
  exports: [LogService],
  controllers: [LogController],
})
export class LogModule {}
