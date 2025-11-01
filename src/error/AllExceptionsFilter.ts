
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
  private readonly INTERNAL_SERVER_ERROR = 'Internal Server Error';
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorText = exception instanceof HttpException ? exception.getResponse() : null;

    const messageCause: string = (errorText as any)?.message || this.INTERNAL_SERVER_ERROR;
    const messageError: string = (errorText as any)?.error || this.INTERNAL_SERVER_ERROR;

    Logger.error('Exception caught', exception instanceof Error ? exception.stack : '');

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      cause: { message: messageCause, error: messageError },
    });
  }
}
