import { MigrationInterface, QueryRunner } from "typeorm";

export class BooksEntity1764891190402 implements MigrationInterface {
    name = 'BooksEntity1764891190402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."books_source_enum" AS ENUM('GOOGLE_BOOKS_API', 'OPEN_LIBRARY_API')`);
        await queryRunner.query(`CREATE TABLE "books" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "external_id" character varying(40) NOT NULL, "source" "public"."books_source_enum" NOT NULL DEFAULT 'GOOGLE_BOOKS_API', "title" character varying(255) NOT NULL, "authors" character varying array NOT NULL, "self_link" character varying(255) NOT NULL, "publisher" character varying(255) NOT NULL, "published_date" character varying(50) NOT NULL, "page_count" integer NOT NULL, "language" character varying(50) NOT NULL, "isbn_13" character varying(50), "isbn_10" character varying(50), "average_rating" double precision, "ratings_count" integer, "description" character varying(1500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_01a6f4b1772fc141b271ba151d0" UNIQUE ("external_id"), CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_books_externalId_source" ON "books" ("external_id", "source") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_books_externalId_source"`);
        await queryRunner.query(`DROP TABLE "books"`);
        await queryRunner.query(`DROP TYPE "public"."books_source_enum"`);
    }

}
