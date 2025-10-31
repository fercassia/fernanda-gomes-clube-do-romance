import { ConflictException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUsersRequestDto } from '../dto/createUsersRequest.dto';
import { CreateUsersMapper } from '../mapper/createUsers.mapper';
import { USERS_REPOSITORY_INTERFACE, type IUsersRepository } from '../interfaces/repository/iUsersRepository.interface';

@Injectable()
export class UsersService {

  constructor(@Inject(USERS_REPOSITORY_INTERFACE) private readonly usersRepository: IUsersRepository) {}

  async create(createUserDto: CreateUsersRequestDto) {
    const userToModel = CreateUsersMapper.toModel(createUserDto);

    const userExist = await this.usersRepository.findByEmailOrDisplayName(userToModel.displayName, userToModel.email);

    if(userExist && (userToModel.displayName === userExist.displayName)){
      throw new ConflictException({status: HttpStatus.CONFLICT, 
          message: 'display name already exists.'})
    }

    if(userExist && (userToModel.email === userExist.email)){
      throw new ConflictException({status: HttpStatus.CONFLICT, 
          message: 'email already exists.'})
    }

    const user = CreateUsersMapper.toEntity(userToModel);
    return this.usersRepository.create(user);
  } 
}
