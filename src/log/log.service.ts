import { ILog } from './dto/log.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Log, LogType } from './schemas/log-schema';
import { Model } from 'mongoose';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogType>) {}

  async createLog(createLog: Partial<ILog>): Promise<ILog> {
    const newLog = new this.logModel(createLog);
    return await newLog.save();
  }
}
