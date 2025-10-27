import { UsersEntity } from "../../entities/users.entity";

export interface IUsersRepository {
  create: (user: UsersEntity) => Promise<UsersEntity>;
}

export const USERS_REPOSITORY_INTERFACE = Symbol('USERS_REPOSITORY_INTERFACE');