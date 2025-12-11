import { MigrationInterface, QueryRunner } from 'typeorm';

export class BooksEntityCorrecao1764894483861 implements MigrationInterface {
  name = 'BooksEntityCorrecao1764894483861';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "authors" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "self_link" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "publisher" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "published_date" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "page_count" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "language" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "isbn_13" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "isbn_10" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "average_rating" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "ratings_count" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "description" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "ratings_count" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "average_rating" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "isbn_10" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "isbn_13" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "language" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "page_count" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "published_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "publisher" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "self_link" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "authors" SET NOT NULL`,
    );
  }
}
