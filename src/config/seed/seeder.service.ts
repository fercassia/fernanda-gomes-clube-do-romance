import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { UsersRolesSeed } from "./seeds/usersRoles.seed";

@Injectable()
export class SeederService implements OnModuleInit { 
  
  constructor(private readonly usersRolesSeed: UsersRolesSeed) {}
  async onModuleInit() {
    
    try {
      Logger.log("Starting database seeding...");
      await this.usersRolesSeed.seedRolesUsers();
      Logger.log("Database seeding completed.");
    } catch (error) {
      Logger.fatal("Error seeding database:", error, { timestamp: new Date().toISOString()} );
    }
  }
}