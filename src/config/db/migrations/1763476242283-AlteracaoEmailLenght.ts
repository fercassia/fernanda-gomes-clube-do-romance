import { MigrationInterface, QueryRunner } from "typeorm";

export class AlteracaoEmailLenght1763476242283 implements MigrationInterface {
    name = 'AlteracaoEmailLenght1763476242283'

    public async up(queryRunner: QueryRunner): Promise<void> {
await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" TYPE character varying(100)`);
        await queryRunner.query(`UPDATE "users" SET "email" = substring("email" from 1 for 100) WHERE "email" IS NOT NULL AND char_length("email") > 100`);
        await queryRunner.query(`UPDATE "users" SET "email" = concat('user_', "id", '@example.com') WHERE "email" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" TYPE character varying(42)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
    }
}
