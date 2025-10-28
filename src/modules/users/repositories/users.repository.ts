import { IUsersRepository } from "../interfaces/repository/iUsersRepository.interface";
import { UsersEntity } from "../entities/users.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository implements IUsersRepository{
  constructor(@InjectRepository(UsersEntity) private readonly entity: Repository<UsersEntity>){}

  async create(user: UsersEntity): Promise<UsersEntity> {
    return await this.entity.save(user);
  }
}