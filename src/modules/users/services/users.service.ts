import { Inject, Injectable } from '@nestjs/common';
import { CreateUsersRequestDto } from '../dto/createUsersRequest.dto';
import { CreateUsersMapper } from '../mapper/createUsers.mapper';
import { USERS_REPOSITORY_INTERFACE, type IUsersRepository } from '../interfaces/repository/iUsersRepository.interface';

@Injectable()
export class UsersService {

  constructor(@Inject(USERS_REPOSITORY_INTERFACE) private readonly usersRepository: IUsersRepository) {}

  create(createUserDto: CreateUsersRequestDto) {
    const userToModel = CreateUsersMapper.toModel(createUserDto)
    const user = CreateUsersMapper.toEntity(userToModel);
    
    return this.usersRepository.create(user);
  }
}
