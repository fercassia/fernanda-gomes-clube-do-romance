import { BooksEntity } from "../../entities/books.entity";

export class IBooksRepositoryInterface {
  createBooks: (books: BooksEntity[]) => Promise<BooksEntity[]>;
  findBooksByQuery: (query: string) => Promise<BooksEntity[] | null>;
  findBooksByIsbn: (isbn: string) => Promise<BooksEntity[] | null>;
  findBooksExternalIdAndSource: (externalIds: string[], sources: string[]) => Promise<BooksEntity[] | null>;
}

export const BOOKS_REPOSITORY_INTERFACE = Symbol('BOOKS_REPOSITORY_INTERFACE');
