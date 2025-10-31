import { UsersEntity } from "../../entities/users.entity";

export interface IUsersRepository {
  create: (user: UsersEntity) => Promise<UsersEntity>;
  findOneByEmail: (email: string) => Promise<UsersEntity | null>
  findOneByDisplayName: (displayName: string) => Promise<UsersEntity | null>
  findByEmailOrDisplayName: (displayName: string, email: string) => Promise<UsersEntity | null>
}

export const USERS_REPOSITORY_INTERFACE = Symbol('USERS_REPOSITORY_INTERFACE');