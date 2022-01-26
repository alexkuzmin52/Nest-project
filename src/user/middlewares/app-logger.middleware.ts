// import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
//
// @Injectable()
// export class AppLoggerMiddleware implements NestMiddleware {
//   logger = new Logger('HTTP');
//   use(req: Request, res: Response, next: NextFunction): void {
//     const { ip, method, path: url } = req;
//     const userAgent = req.get('user-agent');
//     res.on('close', () => {
//       const { statusCode } = res;
//       const contentLength = res.get('content-length');
//
//       this.logger.log(
//         `${ip} ${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
//       );
//     });
//
//     next();
//   }
// }

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
