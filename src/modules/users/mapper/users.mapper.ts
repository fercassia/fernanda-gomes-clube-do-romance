import { CreateUsersRequestDto } from "../dto/createUsersRequest.dto";
import { UsersEntity } from "../entities/users.entity";

export class UsersMapper {
  static toEntity(createUserDto: CreateUsersRequestDto): UsersEntity {
    const user = new UsersEntity();
    user.displayName = createUserDto.displayName;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    return user;
  }
}
