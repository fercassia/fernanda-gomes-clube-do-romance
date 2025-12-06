import type { BookType, FilterType } from "src/utils/types/searchTypes";
import { BooksEntity } from "../../entities/books.entity";

export class IBooksRepositoryInterface {
  createBooks: (books: BooksEntity[]) => Promise<BooksEntity[]>;
  findBooksByQuery: (query: string, type: BookType, page: number, limit: number, filter: FilterType) => Promise<BooksEntity[] | null>;
  findBooksByIsbn: (isbn: string) => Promise<BooksEntity[] | null>;
  findBooksExternalIdAndSource: (filterExternalIdAndSource: Map<string, string>) => Promise<BooksEntity[] | null>;
}

export const BOOKS_REPOSITORY_INTERFACE = Symbol('BOOKS_REPOSITORY_INTERFACE');
