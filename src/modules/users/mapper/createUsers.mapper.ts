import { CreateUsersResponseDto } from "../dto/createUserResponse.dto";
import { CreateUsersRequestDto } from "../dto/createUsersRequest.dto";
import { TypeUsersEntity } from "../entities/typeUsers.entity";
import { UsersEntity } from "../entities/users.entity";
import { UsersModel } from "../model/users.model";

export class CreateUsersMapper {
  static toModel(createUserDto: CreateUsersRequestDto, roleIdDefault: number = 1): UsersModel {
    return new UsersModel(createUserDto.displayName.toLocaleLowerCase().trim (), createUserDto.email.toLocaleLowerCase().trim(),createUserDto.password, roleIdDefault);
  }
  static toEntity(userModel: UsersModel): UsersEntity {
    const user = new UsersEntity();
    user.displayName = userModel.displayName;
    user.email = userModel.email;
    user.password = userModel.password;
    user.role = { id: userModel.role } as TypeUsersEntity
    return user;
  }

  static toResponse(userEntity: UsersEntity): CreateUsersResponseDto {
    return new CreateUsersResponseDto(userEntity.id, userEntity.displayName,
                                       userEntity.email, userEntity.createdAt.toString());
  }
}
