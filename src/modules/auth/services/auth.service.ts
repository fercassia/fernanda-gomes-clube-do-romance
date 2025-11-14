import { BadRequestException, HttpStatus, Inject, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import { USERS_REPOSITORY_INTERFACE, type IUsersRepository } from '../../users/interfaces/repository/iUsersRepository.interface';
import { UsersEntity } from './../../users/entities/users.entity';
import { PasswordHasherd } from '../../../utils/passwordHashed';
import { Metadata } from '../../../utils/metaData';import { LoginUsersModel } from '../../auth/model/loginUsers.model';
import { LoginResponseDto } from '../dto/loginResponse.dto';
import { LoginUsersMapper } from '../mapper/loginUsers.mapper';
import { JwtService } from '@nestjs/jwt';
import { AttemptsBlockService } from './attemptsBlock.service';

@Injectable()
export class AuthService {
  private attemptsBlockStatus: boolean = false;

  constructor(
    @Inject(USERS_REPOSITORY_INTERFACE)
    private readonly usersRepository: IUsersRepository, 
    private readonly attemptsBlockService: AttemptsBlockService,
    private readonly passwordHasher: PasswordHasherd,
    private readonly jwtService: JwtService
  ) {}

  async login(loginUser: LoginUsersModel): Promise<LoginResponseDto> {
    const user: UsersEntity | null =  await this.usersRepository.findOneByEmail(loginUser.email);

    if(!user){
      Logger.warn(`${HttpStatus.NOT_FOUND} - User with email ${loginUser.email} not found.`, Metadata.create({serviceMethod: 'AuthService.login'}));
      throw new BadRequestException('Invalid Email or Password.');
    }

    const isPasswordValid: boolean = await this.passwordHasher.verify(loginUser.password, user.password);

    this.attemptsBlockStatus = await this.attemptsBlockService.attemptsBlockPermission(user.id, isPasswordValid);

    if(!user.isActive){
      await this.usersRepository.updateIsActive(user.id);
    }

    const token: string = this.generateJwtToken(user, this.attemptsBlockStatus);
    return LoginUsersMapper.toResponse(token);
  }

  private generateJwtToken (user: UsersEntity, isBlocked: boolean): string {
    const payload = { id: user.id, email: user.email, role: user.role };
    if(isBlocked === false){
      return this.jwtService.sign(payload);
    }
    Logger.warn(`${HttpStatus.UNAUTHORIZED} - Tentativa de login ${user.email} falha. Causa usuário bloqueado por tentativas excessivas de logins invalidos.`, Metadata.create({serviceMethod: 'AuthService.login'}));
    throw new UnauthorizedException('Login blocked due to multiple invalid attempts. Please try again later.');
  }
}
