export class DirEntitiesAndMigrations {

  private static getEnvironment(): string {
    return process.env.ENVIRONMENT ?? 'production';
  }
  private static isProduction(): boolean {
    return this.getEnvironment() === 'production';
  }

  static whichDirEntities(): string {
    if (this.isProduction()) {
      return 'dist/modules/**/entities/*.js';
    }
    return 'src/modules/**/entities/*{.ts,.js}';
  }

  static whichDirMigrations(): string {
    if (this.isProduction()) {
      return 'dist/config/db/migrations/*.js';
    }
    return 'src/config/db/migrations/*{.ts,.js}';
  }
}