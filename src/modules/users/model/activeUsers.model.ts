export class ActiveUsersModel {
  private _idUser: string;
  private _codActivation: string;

  constructor(
    idUser: string,
    codActivation: string,
  ) {
    this._idUser = idUser;
    this._codActivation = codActivation;
  }

  get idUser(): string {
    return this._idUser;
  }

  get codActivation(): string {
    return this._codActivation;
  }
}
