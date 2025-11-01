import { Controller, Post, Body, HttpCode, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUsersRequestDto } from '../dto/createUsersRequest.dto';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ValidationErrorDto } from '../../../error/dto/ValidationErrorDto';
import { CreateUsersResponseDto } from '../dto/createUserResponse.dto';
import { CreateUserResponseWrapperDto } from '../dto/createUserResponseWrapper.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiTags('Users')
  @ApiCreatedResponse({ description: 'User created successfully.', type: CreateUserResponseWrapperDto })
  @ApiBadRequestResponse({ description: 'Invalid user data.', type: ValidationErrorDto })
  @ApiConflictResponse({ description: 'User with given email or display name already exists.', type: ValidationErrorDto })
  @ApiBody({ type: CreateUsersRequestDto, description: 'Data required to create a new user.' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUsersRequestDto): Promise<CreateUserResponseWrapperDto> {
    const createdUser: CreateUsersResponseDto = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully.',
      data: createdUser
    };
  }
}
