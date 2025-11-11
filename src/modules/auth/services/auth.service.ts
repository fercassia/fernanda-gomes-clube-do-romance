import { BadRequestException, HttpStatus, Inject, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import { USERS_REPOSITORY_INTERFACE, type IUsersRepository } from '../../users/interfaces/repository/iUsersRepository.interface';
import { UsersEntity } from './../../users/entities/users.entity';
import { PasswordHasherd } from '../../../utils/passwordHashed';
import { Metadata } from '../../../utils/metaData';import { LoginUsersModel } from '../../auth/model/loginUsers.model';
import { LoginResponseDto } from '../dto/loginResponse.dto';
import { LoginUsersMapper } from '../mapper/loginUsers.mapper';
import { JwtService } from '@nestjs/jwt';
import { ATTEMPTS_BLOCKED_REPOSITORY_INTERFACE, type IAttemptsBlockedRepository } from '../interfaces/repository/iAttemptsBlockedRepository.interface';
import { AttemptsBlockedMapper } from '../mapper/attemptsBlocked.mapper';
import { AttemptsBlockedEntity } from '../entities/attemptsBlocked.entity';

@Injectable()
export class AuthService {
  private readonly LIMIT_FOR_BLOCK = 5;
  private readonly MS_PER_DAY = 24 * 60 * 60 * 1000;
  private readonly BLOCK_TIME_DAYS = 1;
  
  private isBlocked: boolean;


  constructor(
    @Inject(USERS_REPOSITORY_INTERFACE)
    private readonly usersRepository: IUsersRepository, 
    @Inject(ATTEMPTS_BLOCKED_REPOSITORY_INTERFACE)
    private readonly attemptsBlockedRepository: IAttemptsBlockedRepository,
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

    if(!isPasswordValid){
      this.isBlocked = await this.isLoginBlocked(user.id);
      Logger.warn(`${HttpStatus.UNAUTHORIZED} - Invalid password for user ${loginUser.email}.`, Metadata.create({serviceMethod: 'AuthService.login'}));
      throw new BadRequestException('Invalid Email or Password.');
    }

    if(!user.isActive){
      await this.usersRepository.updateIsActive(user.id);
    }

    const token: string = this.generateJwtToken(user, this.isBlocked);
    return LoginUsersMapper.toResponse(token);
  }

  private generateJwtToken (user: UsersEntity, isBlocked: boolean): string {
    if(isBlocked === false){
      return this.jwtService.sign({ id: user.id, email: user.email, displayName: user.displayName });
    }
    Logger.warn(`${HttpStatus.UNAUTHORIZED} - Tentativa de login ${user.email} falha. Causa usuário bloqueado por tentativas excessivas de logins invalidos.`, Metadata.create({serviceMethod: 'AuthService.login'}));
    throw new UnauthorizedException('Login blocked due to multiple invalid attempts. Please try again later.');
  }

  private async isLoginBlocked (idUser: string): Promise<boolean> {
    const attemptsBlocked: AttemptsBlockedEntity | null = await this.attemptsBlockedRepository.findAttemptsByUserId(idUser);
    const date: Date = new Date();

    if (!attemptsBlocked) {
      const attemptsModel = AttemptsBlockedMapper.toModel(idUser, 1, date);
      const attemptsEntity = AttemptsBlockedMapper.toEntity(attemptsModel);
      await this.attemptsBlockedRepository.create(attemptsEntity);
      Logger.warn(`User ID: ${idUser} is save in attempts to block. Attempts: ${attemptsModel.attempts}.`, Metadata.create({serviceMethod: 'AuthService.AttemptsLogin'}));
      return false;
    }

    if(attemptsBlocked.lastAttemptAt && (( date.getTime() - attemptsBlocked.lastAttemptAt.getTime()) >= this.BLOCK_TIME_DAYS * this.MS_PER_DAY )){
      await this.attemptsBlockedRepository.deleteAttemptsById(attemptsBlocked.id);
      Logger.warn(`User ID: ${attemptsBlocked.id} - removed.`, Metadata.create({serviceMethod: 'AuthService.AttemptsLogin'}));
      return false;
    }

    if (attemptsBlocked.attempts < this.LIMIT_FOR_BLOCK) {
      const newAttemptsCount = attemptsBlocked.attempts + 1;
      await this.attemptsBlockedRepository.updateAttempts(attemptsBlocked.id, newAttemptsCount, date);
      Logger.warn(`User ID: ${idUser} - Attempts: ${newAttemptsCount}.`, Metadata.create({serviceMethod: 'AuthService.AttemptsLogin'}));
      return false;
    }

    await this.attemptsBlockedRepository.updateIsBlocked(attemptsBlocked.id, true);
    Logger.warn(`$User ID: ${idUser} blocked. Attempts: ${attemptsBlocked.attempts}.`, Metadata.create({serviceMethod: 'AuthService.AttemptsLogin'}));
    return true;
  }
}
