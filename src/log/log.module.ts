import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, logSchema } from './schemas/log-schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: logSchema }])],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
