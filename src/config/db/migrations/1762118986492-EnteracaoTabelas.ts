import { MigrationInterface, QueryRunner } from "typeorm";

export class EnteracaoTabelas1762118986492 implements MigrationInterface {
    name = 'EnteracaoTabelas1762118986492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "description" character varying(7) NOT NULL, CONSTRAINT "UQ_6521db71370e3fecb07064ce930" UNIQUE ("description"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "type_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
