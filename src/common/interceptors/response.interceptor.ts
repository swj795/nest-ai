import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseFormat<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

type PartialResponseFormat<T> = Pick<ResponseFormat<T>, 'code' | 'message'> &
  Partial<Pick<ResponseFormat<T>, 'data' | 'timestamp' | 'path'>>;

function isPartialResponseFormat<T>(
  data: T | PartialResponseFormat<T>,
): data is PartialResponseFormat<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'code' in data &&
    'message' in data
  );
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T | PartialResponseFormat<T>,
  ResponseFormat<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T | PartialResponseFormat<T>>,
  ): Observable<ResponseFormat<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data): ResponseFormat<T> => {
        if (isPartialResponseFormat(data)) {
          return {
            ...data,
            data: data.data as T,
            path: request.url,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          code: HttpStatus.OK,
          message: 'success',
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}
