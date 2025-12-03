import { BooksResponseDto } from "../dto/booksResponse.dto";

export class GoogleBooksApiResponseDto {
  private readonly _items: BooksResponseDto[];
  
  constructor(items: BooksResponseDto[]){
    this._items = items;
  }
  get items(): BooksResponseDto[] {
    return this._items;
  }
}