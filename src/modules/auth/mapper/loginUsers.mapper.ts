import { LoginRequestDto } from "../dto/loginRequest.dto";
import { LoginResponseDto } from "../dto/loginResponse.dto";
import { LoginUsersModel } from "../model/loginUsers.model";

export class LoginUsersMapper {
  static toModel(loginUser: LoginRequestDto): LoginUsersModel {
    return new LoginUsersModel(loginUser.email.toLocaleLowerCase().trim(), loginUser.password);
  }

  static toResponse(token: string): LoginResponseDto {
    return new LoginResponseDto(token);
  }
}
