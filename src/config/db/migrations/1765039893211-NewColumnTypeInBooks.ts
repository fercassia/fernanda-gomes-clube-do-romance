import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewColumnTypeInBooks1765039893211 implements MigrationInterface {
  name = 'NewColumnTypeInBooks1765039893211';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "books" ADD COLUMN "type" varchar(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "type"`);
  }
}
