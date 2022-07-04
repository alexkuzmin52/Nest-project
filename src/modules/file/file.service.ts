import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { IFile } from './dto/file.interface';
import { PhotoType } from './schemas/photo-schema';

@Injectable()
export class FileService {
  constructor(@InjectModel('photo') private photoModel: Model<PhotoType>) {}

  async setSingleFile(file: IFile, authId: string): Promise<IFile> {
    const userPhoto = await this.photoModel.findOne({ userId: authId }).exec();

    if (!userPhoto) {
      const newPhoto = await new this.photoModel(file);
      return newPhoto.save();
    } else {
      const updatedPhoto = await this.photoModel.findOneAndUpdate(
        { userId: authId },
        { file: file.file },
        { new: true },
      );

      return updatedPhoto;
    }
  }
}
