import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FileService } from './file.service';
import { photoSchema } from './schemas/photo-schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'photo', schema: photoSchema }]),
  ],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
