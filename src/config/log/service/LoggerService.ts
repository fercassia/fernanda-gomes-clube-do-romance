import { Injectable, Logger } from '@nestjs/common';
import { ILoggerService } from './ILoggerService';


@Injectable()
export class LoggerService<T> implements ILoggerService<T> {
  private readonly logger = new Logger('AppLogger');

  log(message: string, data?: T) {
    this.logger.log(`${message} ${data ? JSON.stringify(data) : ''}`);
  }

  error(message: string, data?: T) {
    this.logger.error(`${message} ${data ? JSON.stringify(data) : ''}`);
  }
}
