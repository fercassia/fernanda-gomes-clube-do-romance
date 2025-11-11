
import { DeleteResult, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { UpdateResult } from "typeorm/browser";
import { IAttemptsBlockedRepository } from "../interfaces/repository/iAttemptsBlockedRepository.interface";
import { AttemptsBlockedEntity } from "../entities/attemptsBlocked.entity";

@Injectable()
export class AttemptsBlockedRepository implements IAttemptsBlockedRepository{
  constructor(@InjectRepository(AttemptsBlockedEntity) private readonly entity: Repository<AttemptsBlockedEntity>){}
  deleteAttemptsById(id: number): Promise<DeleteResult> {
    return this.entity.createQueryBuilder()
      .delete()
      .from(AttemptsBlockedEntity, 'attempts')
      .where('attempts.id = :id', { id })
      .execute()
  }
  create(attempt: AttemptsBlockedEntity): Promise<AttemptsBlockedEntity> {
    return this.entity.save(attempt);
  }
  updateAttempts (id: number, attempts: number, lastAttemptAt: Date): Promise<UpdateResult>{
    return this.entity.update({id}, {attempts, lastAttemptAt});
  };
  updateIsBlocked (id: number, isBlocked: boolean): Promise<UpdateResult>{
    return this.entity.update({id}, {isBlocked});
  };
  findAttemptsByUserId (idUser: string): Promise<AttemptsBlockedEntity | null> {
    return this.entity.createQueryBuilder('user').
          where('LOWER(user.id) = LOWER(:id)', { id: idUser }).
          getOne();
  }

  findAttemptsById (id: number): Promise<AttemptsBlockedEntity | null> {
    return this.entity.createQueryBuilder('attempt').
          where('attempt.id = :id', { id }).
          getOne();
  }
}