import { ConflictException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUsersMapper } from '../mapper/createUsers.mapper';
import { USERS_REPOSITORY_INTERFACE, type IUsersRepository } from '../interfaces/repository/iUsersRepository.interface';
import { UsersModel } from '../model/users.model';
import { UsersEntity } from '../entities/users.entity';
import { CreateUsersResponseDto } from '../dto/createUserResponse.dto';
import { PasswordHasherd } from '../../../utils/passwordHashed';

@Injectable()
export class UsersService {

  constructor(
    @Inject(USERS_REPOSITORY_INTERFACE)
    private readonly usersRepository: IUsersRepository, 
    private readonly passwordHasher: PasswordHasherd
  ) {}

  async create(userModel: UsersModel): Promise<CreateUsersResponseDto> {

    const userExist: UsersEntity | null = await this.usersRepository.findByEmailOrDisplayName(userModel.displayName, userModel.email);
    
    if(userExist){
      Logger.warn(`${HttpStatus.CONFLICT} - ${userModel.email} or ${userModel.displayName} already exists.`, 'UsersService.create', { timestamp: new Date().toISOString() });
      throw new ConflictException('User with given email or display name already exists.')
    }

    const hashPassword = await this.passwordHasher.hash(userModel.password);

    const userNewModel = new UsersModel(
      userModel.displayName,
      userModel.email,
      hashPassword,
      userModel.role
    );
    
    const user: UsersEntity = CreateUsersMapper.toEntity(userNewModel);
    const createdUser: UsersEntity = await this.usersRepository.create(user);
    
    return CreateUsersMapper.toResponse(createdUser);
  }
}
