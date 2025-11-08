export class LoginUsersModel {
  private _email: string;
  private _password: string;

  constructor(
    email: string,
    password: string,
  ) {
    this._email = email;
    this._password = password;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }
}
