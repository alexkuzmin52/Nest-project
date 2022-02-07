import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import {
  UnsupportedMediaTypeException,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';

export const SingleFile = () => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: `./upload`,
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
