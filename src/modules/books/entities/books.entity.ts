import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { SourceEnum } from '../enum/source.enum';
import type { BookType } from 'src/utils/types/searchTypes';

@Entity('books')
@Index('idx_books_externalId_source',['externalId', 'source'])
export class BooksEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 40,
    nullable: false,
    unique: true,
    name: 'external_id',
  })
  externalId: string;

  @Column({ type: 'enum', enum: SourceEnum, default: SourceEnum.GOOGLE_BOOKS_API, nullable: false, name: 'source' })
  source: SourceEnum;

  @Column({ type: 'varchar', name: 'title', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', array: true, nullable: true, name: 'authors' })
  authors: string[];

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'type' })
  type: BookType | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'self_link' })
  selfLink: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'publisher' })
  publisher: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'published_date' })
  publishedDate: string | null;

  @Column({ type: 'int', nullable: true, name: 'page_count' })
  pageCount: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'language' })
  language: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'isbn_13' })
  isbn13: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'isbn_10' })
  isbn10: string | null;

  @Column({ type: 'float', nullable: true, name: 'average_rating' })
  averageRating: number| null;

  @Column({ type: 'int', nullable: true, name: 'ratings_count' })
  ratingsCount: number | null;

  @Column({ type: 'varchar', length: 1500, nullable: true, name: 'description' })
  description: string | null;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeDescription() {
    if (this.description && this.description.length > 1500) {
      this.description = `${this.description.substring(0, 1497)}...`;
    }
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
