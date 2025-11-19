import { UsersEntity } from "../../entities/users.entity";
import { UpdateResult } from "typeorm";

export interface IUsersRepository {
  create: (user: UsersEntity) => Promise<UsersEntity>;
  updateIsActive: (id: string) => Promise<UpdateResult>;
  findOneByEmail: (email: string) => Promise<UsersEntity | null>;
  findOneByDisplayName: (displayName: string) => Promise<UsersEntity | null>;
  findByEmailOrDisplayName: (displayName: string, email: string) => Promise<UsersEntity | null>;
  findById: (id: string) => Promise<UsersEntity | null>;
}

export const USERS_REPOSITORY_INTERFACE = Symbol('USERS_REPOSITORY_INTERFACE');