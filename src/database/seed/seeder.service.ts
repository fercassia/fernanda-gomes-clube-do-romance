import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { UsersTypeSeed } from "./seeds/usersType.seed";
import { trace } from "console";

@Injectable()
export class SeederService implements OnModuleInit { 
  
  constructor(private readonly usersTypeSeed: UsersTypeSeed) {}
  async onModuleInit() {
    try {
      Logger.log("Starting database seeding...");
      await this.usersTypeSeed.seedTypeUsers();
      Logger.log("Database seeding completed.");
    } catch (error) {
      Logger.fatal("Error seeding database:", error, { timestamp: new Date().toISOString(), trace: trace() } );
    }
  }
}