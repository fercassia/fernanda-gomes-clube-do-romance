import { Controller, Post, Body, HttpCode, HttpStatus, Patch, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUsersRequestDto } from '../dto/createUsersRequest.dto';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ValidationErrorDto } from '../../../error/dto/ValidationErrorDto';
import { CreateUsersResponseDto } from '../dto/createUsersResponse.dto';
import { CreateUsersResponseWrapperDto } from '../dto/createUsersResponseWrapper.dto';
import { UsersModel } from '../model/users.model';
import { CreateUsersMapper } from '../mapper/createUsers.mapper';
import { UsersRequestIdDto } from '../dto/userRequestId.dto';
import { ActiveUsersRequestIdDto } from '../dto/atictiveUsersRequest.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiTags('Users')
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

  @ApiOkResponse({ description: 'User activated successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid user id.', type: ValidationErrorDto })
  @ApiNotFoundResponse({ description: 'User not found.', type: ValidationErrorDto })
  @Patch('active-user/:id')
  @HttpCode(HttpStatus.OK)
  async activeAccount(@Param('id') userId: UsersRequestIdDto, @Body() activeUserDto: ActiveUsersRequestIdDto): Promise<any> {
    const updateActive = await this.usersService.activeAccount(userId.userId, activeUserDto.codActive);
    return 'any';
  }
}
