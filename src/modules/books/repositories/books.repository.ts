import { Inject } from "@nestjs/common";
import { BooksEntity } from "../entities/books.entity";
import { IBooksRepositoryInterface } from "../interfaces/repository/iBooksRepository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class BooksRepository implements IBooksRepositoryInterface {
  constructor(@InjectRepository(BooksEntity) private readonly entity: Repository<BooksEntity>) {}
  createBooks (books: BooksEntity[]): Promise<BooksEntity[]> {
    return this.entity.save(books);
  }
  async findBooksByQuery(query: string): Promise<BooksEntity[] | null> {
    const resultByTitle =  await this.entity.
          createQueryBuilder('book').
          where('LOWER(book.title) LIKE LOWER(:query)', { query: `%${query}%` }).
          getMany();
    if(resultByTitle.length > 0){
      return resultByTitle;
    }
    const resultByAuthor =  await this.entity.createQueryBuilder('book').
          where('EXISTS (SELECT 1 FROM unnest(COALESCE(book.authors, ARRAY[]::varchar[])) AS aut WHERE LOWER(aut) LIKE LOWER(:query))', { query: `%${query}%` })
          .getMany();
    if(resultByAuthor.length > 0){
      return resultByAuthor;
    }
    return null;
  }
  async findBooksByIsbn(isbn: string): Promise<BooksEntity[] | null> {
    const result = await this.entity.find({where: [{isbn10: isbn}, {isbn13: isbn}]});
    return result.length > 0 ? result : null;
  }

  async findBooksExternalIdAndSource(filterExternalIdAndSource: Map<string, string>): Promise<BooksEntity[] | null> {
    if (filterExternalIdAndSource.size === 0) {
      return null;
    }
    const foundBooks = await this.entity.createQueryBuilder('book')
      .where('book.external_id IN (:...externalIds)', { externalIds: Array.from(filterExternalIdAndSource.keys()) })
      .andWhere('book.source IN (:...sources)', { sources: Array.from(filterExternalIdAndSource.values()) })
      .getMany();
      
    return foundBooks.length > 0 ? foundBooks : null;
  }
}
