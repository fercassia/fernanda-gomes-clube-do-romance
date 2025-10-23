import { ConsoleLogger, Injectable, Logger, LoggerService } from '@nestjs/common';


@Injectable()
export class CustomLogger extends ConsoleLogger implements LoggerService {
  constructor(context?: string) {
    super();
    this.setLogLevels(['warn', 'error', 'debug']);
    
    if (context) {
      this.context = context;
    }
  }
    //TODO: Adicionar METODOS CUSTOMIZADOS DE LOG
}
