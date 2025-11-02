import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { UsersTypeSeed } from "./seeds/usersType.seed";

@Injectable()
export class SeederService implements OnModuleInit { 
  
  constructor(private readonly usersTypeSeed: UsersTypeSeed) {}
  async onModuleInit() {
    
    try {
      Logger.log("Starting database seeding...");
      await this.usersTypeSeed.seedTypeUsers();
      Logger.log("Database seeding completed.");
    } catch (error) {
      Logger.fatal("Error seeding database:", error, { timestamp: new Date().toISOString()} );
    }
  }
}