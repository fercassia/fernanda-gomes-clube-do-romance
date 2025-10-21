import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { Sanitize } from 'src/utils/Sanitize';
import type { ILoggerService } from './service/ILoggerService';

@Injectable()
export class LogginInterceptor<T> implements NestInterceptor {

  constructor(@Inject('ILoggerService') private readonly logger: ILoggerService<T>) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;

    return next.handle().pipe(
      map((data) => {
        const time = new Date().toISOString();
        const cleanData = Sanitize.sanitizeValue(data);

        this.logger.log(`[SUCCESS] ${method} ${url} - ${time} - Response: ${JSON.stringify(cleanData)}`);
        return cleanData
      }),
      catchError((err) => {
        const time = new Date().toISOString();
        const cleanError = Sanitize.sanitizeValue(err?.response || err);
        this.logger.error(`[ERROR] ${method} ${url} - ${time} - Error: ${JSON.stringify(cleanError)}`);
        throw err;
      })
    );
  }
}