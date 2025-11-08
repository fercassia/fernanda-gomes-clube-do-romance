import { BadRequestException, HttpStatus, Inject, Injectable, Logger} from '@nestjs/common';
import { USERS_REPOSITORY_INTERFACE, type IUsersRepository } from '../../users/interfaces/repository/iUsersRepository.interface';
import { UsersEntity } from './../../users/entities/users.entity';
import { PasswordHasherd } from '../../../utils/passwordHashed';
import { Metadata } from '../../../utils/metaData';import { LoginUsersModel } from '../../auth/model/loginUsers.model';
import { LoginResponseDto } from '../dto/loginResponse.dto';
import { LoginUsersMapper } from '../mapper/loginUsers.mapper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @Inject(USERS_REPOSITORY_INTERFACE)
    private readonly usersRepository: IUsersRepository, 
    private readonly passwordHasher: PasswordHasherd,
    private readonly jwtService: JwtService
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

    const token = this.generateJwtToken(user);
    return LoginUsersMapper.toResponse(token);
  }

  private generateJwtToken (user: UsersEntity): string {
    return this.jwtService.sign({ id: user.id, email: user.email, displayName: user.displayName });
  }
}
