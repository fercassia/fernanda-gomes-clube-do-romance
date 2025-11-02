import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { UsersRolesSeed } from "./seeds/usersRoles.seed";
import { Metadata } from "../../utils/metaData";

@Injectable()
export class SeederService implements OnModuleInit { 
  
  constructor(private readonly usersRolesSeed: UsersRolesSeed) {}
  async onModuleInit() {
    
    try {
      Logger.log("Starting database seeding...");
      await this.usersRolesSeed.seedRolesUsers();
      Logger.log("Database seeding completed.");
    } catch (error) {
      Logger.fatal("Error seeding database:", Metadata.create({error: error, trace: error.stack}) );
    }
  }
}