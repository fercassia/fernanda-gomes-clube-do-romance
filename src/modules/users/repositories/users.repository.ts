import { IUsersRepository } from "../interfaces/repository/iUsersRepository.interface";
import { UsersEntity } from "../entities/users.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository implements IUsersRepository{
  constructor(@InjectRepository(UsersEntity) private readonly entity: Repository<UsersEntity>){}

  findByEmailOrDisplayName(displayName: string, email: string):  Promise<UsersEntity | null> {
    return this.entity.findOne({
        where: [
          { email: email },
          { displayName: displayName }
        ]
    });
  };

  findOneByEmail (email: string): Promise<UsersEntity | null>{
    return this.entity.findOneBy({email: email});
  }
  
  findOneByDisplayName(displayName: string): Promise<UsersEntity | null>{
    return this.entity.findOneBy({displayName: displayName});
  }

  create(user: UsersEntity): Promise<UsersEntity> {
    return this.entity.save(user);
  }
}