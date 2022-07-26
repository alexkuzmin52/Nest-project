import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { ILog, LogFilterQueryDto } from './dto';
import { Log, LogType } from './schemas/log-schema';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogType>) {}

  async createLog(createLog: Partial<ILog>): Promise<ILog> {
    const newLog = new this.logModel(createLog);
    return await newLog.save();
  }

  async getLogs(): Promise<ILog[]> {
    return await this.logModel.find().exec();
  }

  async getFilteredLogs(query: LogFilterQueryDto): Promise<ILog[]> {
    const {
      limit,
      page,
      sortingDirection,
      sortingField,
      createdAtMin,
      createdAtMax,
      ...rest
    } = query;
    const createdAt = {
      $gte: createdAtMin,
      $lte: createdAtMax,
    };
    const skip = limit * (page - 1);
    const filter = { ...rest, createdAt };
    return await this.logModel
      .find(filter)
      .sort([[sortingField, sortingDirection]])
      .skip(skip)
      .limit(limit)
      .exec();
  }
}
