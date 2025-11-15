import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, UseInterceptors, Inject} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ValidationErrorDto } from '../../../error/dto/ValidationErrorDto';
import { LoginRequestDto } from '../dto/loginRequest.dto';
import { LoginUsersModel } from './../model/loginUsers.model';
import { LoginUsersMapper } from './../mapper/loginUsers.mapper';
import { AuthService } from './../services/auth.service';
import { LoginResponseDto } from '../dto/loginResponse.dto';
import { Public } from '../../../config/auth/public.decorator';
import { LoginAttemptGuard } from '../../../config/cache/login-attempt.guard';
import { LoginFailureInterceptor } from '../../../config/cache/login-failure.interceptor';
import { ValidationUnauthorizedDto } from '../../../error/dto/validationUnauthorizedDto';

@Controller('api/v1/auth')
@ApiTags('Auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ description: 'User logged in successfully.', type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid user data.', type: ValidationErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.', type: ValidationUnauthorizedDto })
  @ApiBody({ type: LoginRequestDto, description: 'Data required to login a user.' })
  @Public()
  @UseGuards(LoginAttemptGuard)
  @UseInterceptors(LoginFailureInterceptor)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async createLogin(@Body() loginUserDto: LoginRequestDto): Promise<LoginResponseDto> {
    const loginUser: LoginUsersModel = LoginUsersMapper.toModel(loginUserDto);
    const token: LoginResponseDto = await this.authService.login(loginUser);
    return token;
  }
}
