import { TypeUsersEntity } from "../entities/typeUsers.entity";

export class UsersModel {
  private _displayName: string;
  private _email: string;
  private _role: number;
  private _password: string;

  constructor(
    displayName: string,
    email: string,
    password: string,
    role: number
  ) {
    this._displayName = displayName;
    this._email = email;
    this._password = password;
    this._role = role;
  }

  get displayName(): string {
    return this._displayName;
  }

  get email(): string {
    return this._email;
  }

  get role(): number {
    return this._role;
  }

  get password(): string {
    return this._password;
  }
}
