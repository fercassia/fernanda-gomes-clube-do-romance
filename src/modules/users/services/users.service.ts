import { ConflictException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUsersRequestDto } from '../dto/createUsersRequest.dto';
import { CreateUsersMapper } from '../mapper/createUsers.mapper';
import { USERS_REPOSITORY_INTERFACE, type IUsersRepository } from '../interfaces/repository/iUsersRepository.interface';
import { UsersModel } from '../model/users.model';
import * as bcrypt from 'bcrypt';
import { UsersEntity } from '../entities/users.entity';
import { CreateUsersResponseDto } from '../dto/createUserResponse.dto';

@Injectable()
export class UsersService {

  private readonly SALT_ROUNDS = 10;
  constructor(@Inject(USERS_REPOSITORY_INTERFACE) private readonly usersRepository: IUsersRepository) {}

  async create(createUserDto: CreateUsersRequestDto): Promise<CreateUsersResponseDto> {

    const userToModel: UsersModel = CreateUsersMapper.toModel(createUserDto);
    const userExist: UsersEntity | null = await this.usersRepository.findByEmailOrDisplayName(userToModel.displayName, userToModel.email);
    
    if(userExist){
      Logger.warn(`${HttpStatus.CONFLICT} - ${userToModel.email} or ${userToModel.displayName} already exists.`, 'UsersService.create', { timestamp: new Date().toISOString() });
      throw new ConflictException('User with given email or display name already exists.')
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, this.SALT_ROUNDS);

    const userNewModel = {
      displayName: userToModel.displayName,
      email: userToModel.email,
      role: userToModel.role,
      password: hashPassword
    } as UsersModel;
    const user: UsersEntity = CreateUsersMapper.toEntity(userNewModel);
    const createdUser: UsersEntity = await this.usersRepository.create(user);
    
    return CreateUsersMapper.toResponse(createdUser);
  }
}
