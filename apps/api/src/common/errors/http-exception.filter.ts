import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import type { Request, Response } from 'express';

type ErrorResponse = {
  message?: string | string[];
  error?: string;
  [key: string]: unknown;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const requestId = request.header('x-request-id') ?? crypto.randomUUID();
    const payload = this.getPayload(exception);

    response.setHeader('x-request-id', requestId);
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
      requestId,
      ...payload,
    });

    this.logger.error(
      `${request.method} ${request.originalUrl} ${status} [${requestId}]`,
      exception instanceof Error ? exception.stack : String(exception),
    );
  }

  private getPayload(exception: unknown): ErrorResponse {
    if (!(exception instanceof HttpException)) {
      return { message: 'Wewnętrzny błąd serwera.' };
    }

    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === 'string') {
      return { message: exceptionResponse };
    }

    if (this.isErrorResponse(exceptionResponse)) {
      return exceptionResponse;
    }

    return { message: 'Wystąpił błąd żądania.' };
  }

  private isErrorResponse(value: unknown): value is ErrorResponse {
    return typeof value === 'object' && value !== null;
  }
}
