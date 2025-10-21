
export interface ILoggerService<T> {
  log(message: string, data?: T): void;
  error(message: string, data?: T): void;
}