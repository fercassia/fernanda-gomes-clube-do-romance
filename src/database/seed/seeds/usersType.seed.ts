import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeUsersEntity } from "src/app/users/entities/typeUsers.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersTypeSeed {
  constructor(@InjectRepository(TypeUsersEntity)private readonly repo: Repository<TypeUsersEntity>) {}
  async seedTypeUsers() {
    const userTypes = [
      { description: "user" },
      { description: "admin" },
      { description: "viewer" }
    ];

    for (const type of userTypes) {
      const exists = await this.repo.findOne({ where: { description: type.description } });
      if(!exists) {
        await this.repo.save(this.repo.create(type));
      }
    }
  }
}