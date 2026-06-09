// Nest common provides the interceptor interfaces and request context.
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
// Express types describe the request data included in response metadata.
import { Request } from 'express';
// RxJS lets us transform the controller response before it is returned.
import { map, Observable } from 'rxjs';

interface ResponseEnvelope<T> {
  data: T;
  meta: {
    method: string;
    path: string;
    timestamp: string;
  };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseEnvelope<T>
> {
  // Wrap every controller result with data plus small request metadata.
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseEnvelope<T>> {
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data) => ({
        data,
        meta: {
          method: request.method,
          path: request.url,
          timestamp: new Date().toISOString(),
        },
      })),
    );
  }
}
