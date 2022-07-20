// import { applyDecorators, UseInterceptors } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
//
// export const UploadData = () => {
//   return applyDecorators(UseInterceptors(FileInterceptor('files', {
//
//   })));
// };

import {
  applyDecorators,
  UnsupportedMediaTypeException,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

export const ArrayFiles = () => {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor('files', 10, {
        storage: diskStorage({
          destination: './upload/temp',
          filename(
            req: Request,
            file: Express.Multer.File,
            callback: (error: Error | null, filename: string) => void,
          ) {
            const fileName = file.originalname;
            callback(null, `${fileName}`);
          },
        }),
        limits: { fileSize: 1000000 },
        fileFilter: (
          req: Request,
          file: Express.Multer.File,
          callback: (error: Error | null, res: boolean) => void,
        ) => {
          if (file.mimetype === 'image/jpeg' || 'image/png') {
            callback(null, true);
          } else {
            throw new UnsupportedMediaTypeException(
              'Missing  MIME type image/jpg, image/png',
            );
          }
        },
      }),
    ),
  );
};
