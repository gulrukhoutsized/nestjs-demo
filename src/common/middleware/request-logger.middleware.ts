// Nest common provides the middleware contract and injectable decorator.
import { Injectable, NestMiddleware } from '@nestjs/common';
// Express types describe the request, response, and next middleware function.
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  // Log method, URL, status code, and duration after the response finishes.
  use(request: Request, response: Response, next: NextFunction) {
    const startedAt = Date.now();

    response.on('finish', () => {
      const duration = Date.now() - startedAt;
      console.log(
        `${request.method} ${request.originalUrl} ${response.statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
