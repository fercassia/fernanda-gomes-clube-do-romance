import { IUsersRepository } from "../interfaces/repository/iUsersRepository.interface";
import { UsersEntity } from "../entities/users.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository implements IUsersRepository{
  constructor(@InjectRepository(UsersEntity) private readonly entity: Repository<UsersEntity>){}

  async findByEmailOrDisplayName(displayName: string, email: string):  Promise<UsersEntity | null> {
    return await this.entity.findOne({
        where: [
          { email: email },
          { displayName: displayName }
        ]
    });
  };

  async findOneByEmail (email: string): Promise<UsersEntity | null>{
    return await this.entity.findOneBy({email: email});
  }
  
  async findOneByDisplayName(displayName: string): Promise<UsersEntity | null>{
    return await this.entity.findOneBy({displayName: displayName});
  }

  async create(user: UsersEntity): Promise<UsersEntity> {
    return await this.entity.save(user);
  }
}