import { Inject, Injectable, Logger} from '@nestjs/common';
import { Metadata } from '../../../utils/metaData';import { LoginUsersModel } from '../model/loginUsers.model';
import { ATTEMPTS_BLOCKED_REPOSITORY_INTERFACE, type IAttemptsBlockedRepository } from '../interfaces/repository/iAttemptsBlockedRepository.interface';
import { AttemptsBlockedMapper } from '../mapper/attemptsBlocked.mapper';
import { AttemptsBlockedEntity } from '../entities/attemptsBlocked.entity';
import { DateVerify } from '../../../utils/dateVerify';
import { AttemptsBlockedModel } from '../model/attemptsBlocked.model';

@Injectable()
export class AttemptsBlockService {
  private readonly LIMIT_FOR_BLOCK = 5;
  private readonly BLOCK_TIME_DAYS = 1;
  
  private attemptsBlockedUser: AttemptsBlockedEntity | null;
  private isBlocked: boolean = false;

  constructor(
    @Inject(ATTEMPTS_BLOCKED_REPOSITORY_INTERFACE)
    private readonly attemptsBlockedRepository: IAttemptsBlockedRepository,
  ) {}

  public async attemptsBlockPermission (idUser: string, isPasswordValid: boolean): Promise<boolean> {
    this.attemptsBlockedUser = await this.attemptsBlockedRepository.findAttemptsByUserId(idUser);

    if(!isPasswordValid && !this.attemptsBlockedUser){
      this.isBlocked = await this.isAttemptsBlocked(AttemptsBlockedMapper.toModel(idUser, 0, new Date()), true);
      return this.isBlocked;
    }

    if(!this.attemptsBlockedUser){
      Logger.warn(`User ID: ${idUser} attempts not found.`, Metadata.create({serviceMethod: 'AuthService.AttemptsLogin'}));
      this.isBlocked = false;
      return this.isBlocked;
    }

    const isResetedAttempts = await this.isResetedAttempts(this.attemptsBlockedUser, new Date());

    if(!isPasswordValid){
      this.isBlocked = await this.isAttemptsBlocked(AttemptsBlockedMapper.toModel(idUser, 0, new Date()), isResetedAttempts);
      return this.isBlocked;
    }

    if(!isResetedAttempts){
      this.isBlocked = await this.isAttemptsBlocked(AttemptsBlockedMapper.toModel(this.attemptsBlockedUser.userId.id, this.attemptsBlockedUser.attempts, this.attemptsBlockedUser.lastAttemptAt), isResetedAttempts);
      return this.isBlocked;
    }
    return this.isBlocked;
  }
  private async isAttemptsBlocked (attemptsModel: AttemptsBlockedModel, resetedOrNotContain: boolean): Promise<boolean> {
    
    if (resetedOrNotContain === true) {
      const attemptsEntity = AttemptsBlockedMapper.toEntity(attemptsModel);
      await this.attemptsBlockedRepository.create(attemptsEntity);
      Logger.warn(`User ID: ${attemptsModel.userId} is save in attempts to block. Attempts: ${attemptsModel.attempts}.`, Metadata.create({serviceMethod: 'AuthService.AttemptsLogin'}));
      return false;
    }

    if (attemptsModel.attempts < this.LIMIT_FOR_BLOCK) {
      const newAttemptsCount = attemptsModel.attempts + 1;
      await this.attemptsBlockedRepository.updateAttempts(attemptsModel.userId, newAttemptsCount, attemptsModel.lastAttemptAt);
      Logger.warn(`User ID: ${attemptsModel.userId} - Attempts: ${newAttemptsCount}.`, Metadata.create({serviceMethod: 'AuthService.AttemptsLogin'}));
      return false;
    }

    if(attemptsModel.isBlocked === true) {
      Logger.warn(`User ID: ${attemptsModel.userId} is already blocked. Attempts: ${attemptsModel.attempts}.`, Metadata.create({serviceMethod: 'AuthService.AttemptsLogin'}));
      return true;
    }

    await this.attemptsBlockedRepository.updateIsBlocked(attemptsModel.userId, true);
    Logger.warn(`User ID: ${attemptsModel.userId} blocked. Attempts: ${attemptsModel.attempts}.`, Metadata.create({serviceMethod: 'AuthService.AttemptsLogin'}));
    return true;
  }

  private async isResetedAttempts (attemptsEntity: AttemptsBlockedEntity, actualDate: Date): Promise<boolean> {
    if(DateVerify.verify(actualDate, attemptsEntity.lastAttemptAt, this.BLOCK_TIME_DAYS) === false) {
      Logger.warn(`User ID: ${attemptsEntity.id} - attempts was not reseted.`, Metadata.create({serviceMethod: 'AuthService.AttemptsLogin'}));
      return false;
    }
    await this.attemptsBlockedRepository.deleteAttemptsById(attemptsEntity.id);
    Logger.warn(`User ID: ${attemptsEntity.id} - attempts was reseted.`, Metadata.create({serviceMethod: 'AuthService.AttemptsLogin'}));
    return true;
  }
}
