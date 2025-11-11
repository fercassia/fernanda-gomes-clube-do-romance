import { UsersEntity } from "src/modules/users/entities/users.entity";
import { AttemptsBlockedEntity } from "../entities/attemptsBlocked.entity";
import { AttemptsBlockedModel } from "../model/attemptsBlocked.model";

export class AttemptsBlockedMapper {
  static toModel(idUserId: string, attempts: number, lastAttemptAt: Date, isBlocked?: boolean): AttemptsBlockedModel {
    return new AttemptsBlockedModel(idUserId, attempts, lastAttemptAt, isBlocked);
  }

  static toEntity(attemptsModel: AttemptsBlockedModel): AttemptsBlockedEntity {
    const attempts = new AttemptsBlockedEntity();
    attempts.userId = { id: attemptsModel.userId } as UsersEntity;
    attempts.attempts = attemptsModel.attempts;
    attempts.isBlocked = attemptsModel.isBlocked;
    attempts.lastAttemptAt = attempts.lastAttemptAt;
    return attempts;
  }
}
