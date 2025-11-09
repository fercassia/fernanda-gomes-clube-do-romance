import { Controller, Post, Body, HttpCode, HttpStatus} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ValidationErrorDto } from '../../../error/dto/ValidationErrorDto';
import { LoginRequestDto } from '../dto/loginRequest.dto';
import { LoginUsersModel } from './../model/loginUsers.model';
import { LoginUsersMapper } from './../mapper/loginUsers.mapper';
import { AuthService } from './../services/auth.service';
import { LoginResponseDto } from '../dto/loginResponse.dto';

@Controller('api/v1/auth')
@ApiTags('Auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ description: 'User logged in successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid user data.', type: ValidationErrorDto })
  @ApiBody({ type: LoginRequestDto, description: 'Data required to login a user.' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async createLogin(@Body() loginUserDto: LoginRequestDto): Promise<LoginResponseDto> {
    const loginUser: LoginUsersModel = LoginUsersMapper.toModel(loginUserDto);
    const token: LoginResponseDto = await this.authService.login(loginUser);
    return token;
  }
}
