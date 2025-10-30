import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersETypeUsers1761783383885 implements MigrationInterface {
    name = 'CreateUsersETypeUsers1761783383885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "type_users" ("id" SERIAL NOT NULL, "description" character varying(7) NOT NULL, CONSTRAINT "UQ_e98e791334cb724337a820725b4" UNIQUE ("description"), CONSTRAINT "PK_d655bb42bef0f87f7db0e59270d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "display_name" character varying(70) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT false, "role_id" integer NOT NULL, CONSTRAINT "UQ_a72fa0bb46a03bedcd1745efb41" UNIQUE ("display_name"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "type_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "type_users"`);
    }

}
