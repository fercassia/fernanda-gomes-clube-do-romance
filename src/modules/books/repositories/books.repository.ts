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
    return this.entity.find({where: [{isbn10: isbn}, {isbn13: isbn}]});
  }

  async findBooksExternalIdAndSource(externalIds: string[], sources: string[]): Promise<BooksEntity[] | null> {
    if (!externalIds.length || !sources.length) {
      return [];
    }
    const foundBooks = await this.entity.createQueryBuilder('book')
      .where('book.external_id IN (:...externalIds)', { externalIds })
      .andWhere('book.source IN (:...sources)', { sources })
      .getMany();
      
    return foundBooks.length > 0 ? foundBooks : null;
  }
}
