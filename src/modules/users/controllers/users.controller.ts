import { Controller, Post, Body, HttpCode, HttpStatus, Patch, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUsersRequestDto } from '../dto/createUsersRequest.dto';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ValidationErrorDto } from '../../../error/dto/ValidationErrorDto';
import { CreateUsersResponseDto } from '../dto/createUsersResponse.dto';
import { CreateUsersResponseWrapperDto } from '../dto/createUsersResponseWrapper.dto';
import { UsersModel } from '../model/users.model';
import { CreateUsersMapper } from '../mapper/createUsers.mapper';
import { LoginUsersRequestDto } from '../dto/loginUsersRequest.dto';
import { LoginUsersModel } from '../model/loginUsers.model';
import { LoginUsersMapper } from '../mapper/loginUsers.mapper';

@Controller('api/v1/users')
@ApiTags('Users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({ description: 'User created successfully.', type: CreateUsersResponseWrapperDto })
  @ApiBadRequestResponse({ description: 'Invalid user data.', type: ValidationErrorDto })
  @ApiConflictResponse({ description: 'User with given email or display name already exists.', type: ValidationErrorDto })
  @ApiBody({ type: CreateUsersRequestDto, description: 'Data required to create a new user.' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUsersRequestDto): Promise<CreateUsersResponseWrapperDto> {
    const createdUser: UsersModel = CreateUsersMapper.toModel(createUserDto);
    const user: CreateUsersResponseDto = await this.usersService.create(createdUser);
    return {
      message: 'User created successfully.',
      data: user
    };
  }

  @ApiOkResponse({ description: 'User logged in successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid user data.', type: ValidationErrorDto })
  @ApiBody({ type: LoginUsersRequestDto, description: 'Data required to login a user.' })
  @Post('login')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createLogin(@Body() loginUserDto: LoginUsersRequestDto): Promise<void> {
    const loginUser: LoginUsersModel = LoginUsersMapper.toModel(loginUserDto);
    await this.usersService.login(loginUser);
  }
}
