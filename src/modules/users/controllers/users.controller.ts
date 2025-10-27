import { Controller, Post, Body, HttpCode, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from '../services/users.service';
import { CreateUsersRequestDto } from '../dto/createUsersRequest.dto';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiTags('Users')
  @Post()
  @ApiCreatedResponse({ description: 'User created successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid user data.' })
  @ApiBody({ type: CreateUsersRequestDto, description: 'Data required to create a new user.' })
  create(@Body() createUserDto: CreateUsersRequestDto, @Res() res: Response) {
    this.usersService.create(createUserDto);
    return res.status(HttpStatus.CREATED).send();
  }
}
