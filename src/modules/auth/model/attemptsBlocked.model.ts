export class AttemptsBlockedModel {
  private _userId: string;
  private _attempts: number;
  private _isBlocked: boolean;
  private _lastAttemptAt: Date;

  constructor(
    userId: string,
    attempts: number,
    lastAttemptAt: Date,
    isBlocked?: boolean
  ) {
    this._userId = userId;
    this._attempts = attempts;
    this._lastAttemptAt = lastAttemptAt;
    this._isBlocked = isBlocked ?? false;
  }

  get userId(): string {
    return this._userId;
  }

  get attempts(): number {
    return this._attempts;
  }

  get isBlocked(): boolean {
    return this._isBlocked;
  }

  get lastAttemptAt(): Date {
    return this._lastAttemptAt;
  }
}
