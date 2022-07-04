import { Log, logSchema } from './schemas/log-schema';
import { LogService } from './log.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: logSchema }])],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
