import { IUsersRepository } from "../interfaces/repository/iUsersRepository.interface";
import { UsersEntity } from "../entities/users.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { UpdateResult } from "typeorm/browser";

@Injectable()
export class UsersRepository implements IUsersRepository{
  constructor(@InjectRepository(UsersEntity) private readonly entity: Repository<UsersEntity>){}

  findByEmailOrDisplayName(displayName: string, email: string):  Promise<UsersEntity | null> {
    return this.entity.createQueryBuilder('user').
          where('user.email = :email OR LOWER(user.displayName) = LOWER(:displayName)', { email, displayName }).
          getOne();
  };

  findOneByEmail (email: string): Promise<UsersEntity | null>{
    return this.entity.findOneBy({email: email});
  }
  
  findOneByDisplayName(displayName: string): Promise<UsersEntity | null>{
    return this.entity.createQueryBuilder('user').
          where('LOWER(user.displayName) = LOWER(:displayName)', { displayName }).
          getOne();
  }

  findById(id: string): Promise<UsersEntity | null> {
     return this.entity.createQueryBuilder('user').
          where('LOWER(user.id) = LOWER(:id)', { id }).
          getOne();
  }

  create(user: UsersEntity): Promise<UsersEntity> {
    return this.entity.save(user);
  }

  updateIsActive(id: string): Promise<UpdateResult> {
    return this.entity.update({id}, {isActive: true});
  }
}