import { AttemptsBlockedEntity } from "../../entities/attemptsBlocked.entity";
import { DeleteResult, UpdateResult } from "typeorm";

export interface IAttemptsBlockedRepository {
  create: (attempt: AttemptsBlockedEntity) => Promise<AttemptsBlockedEntity>;
  updateAttempts: (userId: string, attempts: number, lastAttemptAt: Date) => Promise<UpdateResult>;
  updateIsBlocked: (userId: string, isBlocked: boolean) => Promise<UpdateResult>;
  findAttemptsByUserId: (idUser: string) => Promise<AttemptsBlockedEntity | null>;
  findAttemptsById: (id: number) => Promise<AttemptsBlockedEntity | null>;
  deleteAttemptsById: (id: number) => Promise<DeleteResult>;
}

export const ATTEMPTS_BLOCKED_REPOSITORY_INTERFACE = Symbol('ATTEMPTS_BLOCKED_REPOSITORY_INTERFACE');