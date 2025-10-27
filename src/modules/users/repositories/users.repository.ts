import { IUsersRepository } from "../interfaces/repository/iUsersRepository.interface";
import { UsersEntity } from "../entities/users.entity";
import { Repository } from "typeorm";


export class UsersRepository implements IUsersRepository{
  constructor(private readonly entity: Repository<UsersEntity>){}

  async create(user: UsersEntity): Promise<UsersEntity> {
    return this.entity.save(user);
  }
}