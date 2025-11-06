import { RolesEntity } from "../entities/roles.entity";
import { UsersEntity } from "../entities/users.entity";
import { VerificationCodesEntity } from "../entities/verificationCodes.entity";
import { ActiveUsersModel } from "../model/activeUsers.model";

export class ActiveUsersMapper {
  static toModel(id: string, codActivation: string): ActiveUsersModel {
    return new ActiveUsersModel(id, codActivation);
  }
  static toEntity(activeUsersModel: ActiveUsersModel): VerificationCodesEntity {
    const verificationCode = new VerificationCodesEntity();
    verificationCode.codActivation = activeUsersModel.codActivation;
    verificationCode.userId = { id: activeUsersModel.idUser } as UsersEntity;
    return verificationCode;
  }
}
