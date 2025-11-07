import { LoginUsersRequestDto } from "../dto/loginUsersRequest.dto";
import { LoginUsersModel } from "../model/loginUsers.model";

export class LoginUsersMapper {
  static toModel(loginUser: LoginUsersRequestDto): LoginUsersModel {
    return new LoginUsersModel(loginUser.email.toLocaleLowerCase().trim(), loginUser.password);
  }
}
