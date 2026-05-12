import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as {
          message: string;
          error: any;
        };
        message = responseObj.message || 'Internal server error';
        error = responseObj.error || null;
      }
    } else if (exception instanceof Error) {
      message = exception.message || 'Internal server error';
      this.logger.error(
        `未处理异常${message}`,
        exception.stack,
        'all-exceptions.filter',
      );
    }
    this.logger.error(`${request.method}${request.url} -${status} -${message}`);

    const errorResponse = {
      code: status,
      message: Array.isArray(message) ? message[0] : message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(error && { error }),
    };
    response.status(status).json(errorResponse);
  }
}
