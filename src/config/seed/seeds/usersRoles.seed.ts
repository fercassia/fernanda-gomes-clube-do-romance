import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolesEntity } from "src/modules/users/entities/roles.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersRolesSeed {
  constructor(@InjectRepository(RolesEntity)private readonly repo: Repository<RolesEntity>) {}
  async seedRolesUsers() {
    const userRoles = [
      { description: "user" },
      { description: "admin" },
      { description: "viewer" }
    ];

    for (const role of userRoles) {
      const exists = await this.repo.findOne({ where: { description: role.description } });
      if(!exists) {
        await this.repo.save(this.repo.create(role));
      }
    }
  }
}