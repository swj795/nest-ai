import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const startTime = Date.now();
    this.logger.log(`${method} ${originalUrl} ${ip}`);
    res.on('finish', () => {
      const endTime = Date.now();
      this.logger.log(
        `${method} ${originalUrl} ${ip} ${res.statusCode} ${endTime - startTime}ms`,
      );
    });
    next();
  }
}
