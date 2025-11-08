import { BadRequestException, HttpStatus, Inject, Injectable, Logger} from '@nestjs/common';
import { USERS_REPOSITORY_INTERFACE, type IUsersRepository } from '../../users/interfaces/repository/iUsersRepository.interface';
import { UsersEntity } from './../../users/entities/users.entity';
import { PasswordHasherd } from '../../../utils/passwordHashed';
import { Metadata } from '../../../utils/metaData';import { LoginUsersModel } from '../../auth/model/loginUsers.model';
import { LoginResponseDto } from '../dto/loginResponse.dto';
import { LoginUsersMapper } from '../mapper/loginUsers.mapper';

@Injectable()
export class AuthService {

  constructor(
    @Inject(USERS_REPOSITORY_INTERFACE)
    private readonly usersRepository: IUsersRepository, 
    private readonly passwordHasher: PasswordHasherd
  ) {}

  async login(loginUser: LoginUsersModel): Promise<LoginResponseDto> {
    const user: UsersEntity | null =  await this.usersRepository.findOneByEmail(loginUser.email);

    if(!user){
      Logger.warn(`${HttpStatus.NOT_FOUND} - User with email ${loginUser.email} not found.`, Metadata.create({serviceMethod: 'UsersService.login'}));
      throw new BadRequestException('Invalid Email or Password.');
    }

    const isPasswordValid = await this.passwordHasher.verify(loginUser.password, user.password);

    if(!isPasswordValid){
      Logger.warn(`${HttpStatus.UNAUTHORIZED} - Invalid password for user ${loginUser.email}.`, Metadata.create({serviceMethod: 'UsersService.login'}));
      throw new BadRequestException('Invalid Email or Password.');
    }

    if(!user.isActive){
      await this.usersRepository.updateIsActive(user.id);
    }
    return LoginUsersMapper.toResponse('generated-jwt-token'); // Replace with actual token generation logic
  }
}
