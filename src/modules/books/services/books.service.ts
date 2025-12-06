import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { BooksSearchModel } from '../model/booksSearch.model';
import { GoogleBooksApiService } from '../client/googleBooksApi.service';
import { Metadata } from '../../../utils/metaData';
import { GoogleBooksApiResponseDto } from '../client/googleBooksApiResponse.dto';
import { BOOKS_REPOSITORY_INTERFACE, type IBooksRepositoryInterface } from '../interfaces/repository/iBooksRepository.interface';
import { BooksEntity } from '../entities/books.entity';
import { BooksMapper } from '../mapper/books.mapper';
import { BooksModel } from '../model/books.model';
import { ApiUriTooLongResponse } from '@nestjs/swagger';

@Injectable()
export class BooksService {

  constructor(@Inject(BOOKS_REPOSITORY_INTERFACE) private readonly  booksRepository: IBooksRepositoryInterface, 
                            private readonly googleBooksApiService: GoogleBooksApiService,
                            private readonly booksMapper: BooksMapper) { }

  async getBooks(query: BooksSearchModel){

    if(query.query === null){
      Logger.warn(`Bad Request - At least one search parameter must be provided.`, Metadata.create({serviceMethod: 'BooksService.getBooks'}));
      throw new BadRequestException('At least one search parameter must be provided.');
    }

    const booksFound: BooksEntity[] | null = await this.verifyExistenceBooks(query);
    if(booksFound === null){

      //Faz chamadas para API externa e salva novos livros;
      const returnGoogle: GoogleBooksApiResponseDto = await this.callExternalApi(query.query);
      const newBooksSaved: BooksEntity[] = await this.booksAndNewBooksSavedFromGoogleBooks(returnGoogle);
      if(newBooksSaved.length === 0){
        return [];
      }

      //Faz novamente a busca dos novos livros salvos com os filtros iniciais
      const newBooksSavedReturned: BooksEntity[] | null = await this.verifyExistenceBooks(query);
      if(newBooksSavedReturned === null){
        return [];
      }
      return this.booksMapper.toResponseBooks(newBooksSavedReturned);
    }
    return this.booksMapper.toResponseBooks(booksFound);
  }

  private async callExternalApi(query: string): Promise<GoogleBooksApiResponseDto>{
    const returnGoogle = await this.googleBooksApiService.getBooksGoogleApi(query);
    return returnGoogle;
  }

  private async booksAndNewBooksSavedFromGoogleBooks(newBooks: GoogleBooksApiResponseDto): Promise<BooksEntity[]> {
    if(newBooks.items.length === 0){
      return [];
    }

    const booksModels = newBooks.items.map((book) => {
      return this.booksMapper.toModelBook(book)
    });

    const books = await this.filterBooksDifference(booksModels);

    if(books === null){
      return [];
    }

    const booksEntities = this.booksMapper.toEntityBooks(books);
    return await this.booksRepository.createBooks(booksEntities);
  }

  private async  filterBooksDifference(booksExternal: BooksModel[]): Promise<BooksModel[] | null> {
    const filterExternalIdAndSource: Map<string, string> = new Map();

    for (const book of booksExternal) {
      filterExternalIdAndSource.set(book.externalId, book.source);
    }

    const existBooks = await this.booksRepository.findBooksExternalIdAndSource(filterExternalIdAndSource);

    if(existBooks === null){
      return booksExternal;
    }

    const booksDifference = booksExternal.filter(book => {
      return !existBooks.some(existBook => existBook.externalId === book.externalId && existBook.source === book.source);
    })

    if(booksDifference.length === 0){
      return null;
    }
    return booksDifference;
  }

  private async verifyExistenceBooks (query: BooksSearchModel): Promise<BooksEntity[] | null> {
    const queryVerification = query.query ?? '';
    const isNumeric = /^\d+$/.test(queryVerification);

    if(isNumeric){
      return await this.booksRepository.findBooksByIsbn(queryVerification);
    }
    return await this.booksRepository.findBooksByQuery(queryVerification, query.type, query.page, query.limit, query.filter);
  }
}
