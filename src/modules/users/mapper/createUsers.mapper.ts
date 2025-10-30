import { CreateUsersRequestDto } from "../dto/createUsersRequest.dto";
import { TypeUsersEntity } from "../entities/typeUsers.entity";
import { UsersEntity } from "../entities/users.entity";
import { UsersModel } from "../model/users.model";

export class CreateUsersMapper {
  static toModel(createUserDto: CreateUsersRequestDto, roleIdDefault: number = 1) {
    return new UsersModel(createUserDto.displayName.toLocaleLowerCase().trim (), createUserDto.email.toLowerCase().trim(),
                          createUserDto.password.toLocaleLowerCase().trim(), roleIdDefault);
  }
  static toEntity(userModel: UsersModel): UsersEntity {
    const user = new UsersEntity();
    user.displayName = userModel.displayName;
    user.email = userModel.email;
    user.password = userModel.password;
    user.role = { id: userModel.role } as TypeUsersEntity
    return user;
  }
}
