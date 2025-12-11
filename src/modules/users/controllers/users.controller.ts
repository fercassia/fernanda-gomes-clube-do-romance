import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUsersRequestDto } from '../dto/createUsersRequest.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ValidationErrorDto } from '../../../error/dto/ValidationErrorDto';
import { CreateUsersResponseDto } from '../dto/createUsersResponse.dto';
import { CreateUsersResponseWrapperDto } from '../dto/createUsersResponseWrapper.dto';
import { UsersModel } from '../model/users.model';
import { CreateUsersMapper } from '../mapper/createUsers.mapper';
import { Public } from '../../../config/auth/public.decorator';
import { PasswordHasherd } from '../../../utils/passwordHashed';

@Controller('api/v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordHasherd: PasswordHasherd,
  ) {}

  @ApiCreatedResponse({
    description: 'User created successfully.',
    type: CreateUsersResponseWrapperDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid user data.',
    type: ValidationErrorDto,
  })
  @ApiConflictResponse({
    description: 'User with given email or display name already exists.',
    type: ValidationErrorDto,
  })
  @ApiBody({
    type: CreateUsersRequestDto,
    description: 'Data required to create a new user.',
  })
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUserDto: CreateUsersRequestDto,
  ): Promise<CreateUsersResponseWrapperDto> {
    const passEncripted: string = await this.passwordHasherd.encriptPassword(
      createUserDto.password,
    );
    const createUserDtoWithEncriptedPass = {
      ...createUserDto,
      password: passEncripted,
    } as CreateUsersRequestDto;

    const createdUser: UsersModel = CreateUsersMapper.toModel(
      createUserDtoWithEncriptedPass,
    );
    const user: CreateUsersResponseDto =
      await this.usersService.create(createdUser);
    return {
      message: 'User created successfully.',
      data: user,
    };
  }
}
