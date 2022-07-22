import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class ValidatorMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const objectID = mongoose.Types.ObjectId;
    if (objectID.isValid(value)) return value;
    throw new BadRequestException(
      `ObjectId failed for value: ${value} (type string) at path _id`,
    );
  }
}
