import { Inject, Injectable } from '@nestjs/common';
import { CreateUsersRequestDto } from '../dto/createUsersRequest.dto';
import { UsersMapper } from '../mapper/users.mapper';
import { USERS_REPOSITORY_INTERFACE, type IUsersRepository } from '../interfaces/repository/iUsersRepository.interface';

@Injectable()
export class UsersService {

  constructor(@Inject(USERS_REPOSITORY_INTERFACE) private readonly usersRepository: IUsersRepository) {}

  create(createUserDto: CreateUsersRequestDto) {
    const user = UsersMapper.toEntity(createUserDto);
    return this.usersRepository.create(user);
  }
}
