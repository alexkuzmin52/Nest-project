import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log, LogType } from './schemas/log-schema';
import { Model } from 'mongoose';
import { CreateLogDto } from './dto/create-log.dto';
import { ILog } from './dto/log.interface';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogType>) {}
  async createLog(createLog: Partial<ILog>): Promise<ILog> {
    const newLog = new this.logModel(createLog);
    return await newLog.save();
  }
}
