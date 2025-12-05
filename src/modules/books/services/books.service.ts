import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { BooksSearchModel } from '../model/booksSearch.model';
import { GoogleBooksApiService } from '../client/googleBooksApi.service';
import { Metadata } from '../../../utils/metaData';
import { GoogleBooksApiResponseDto } from '../client/googleBooksApiResponse.dto';
import { BOOKS_REPOSITORY_INTERFACE, type IBooksRepositoryInterface } from '../interfaces/repository/iBooksRepository.interface';
import { BooksEntity } from '../entities/books.entity';
import { BooksMapper } from '../mapper/books.mapper';

@Injectable()
export class BooksService {

  private returnGoogle: GoogleBooksApiResponseDto;

  constructor(@Inject(BOOKS_REPOSITORY_INTERFACE) private readonly  booksRepository: IBooksRepositoryInterface, 
                            private readonly googleBooksApiService: GoogleBooksApiService,
                            private readonly booksMapper: BooksMapper) { }

  async getBooks(query: BooksSearchModel){

    if(query.query === null){
      Logger.warn(`Bad Request - At least one search parameter must be provided.`, Metadata.create({serviceMethod: 'BooksService.getBooks'}));
      throw new BadRequestException('At least one search parameter must be provided.');
    }

    const booksFound: BooksEntity[] | null = await this.verifyExistenceBooks(query.query);

    if(booksFound === null){
      const returnGoogle: GoogleBooksApiResponseDto = await this.callExternalApi(query.query);
      const newBooksSaved: BooksEntity[] = await this.saveNewBooksFromGoogleBooks(returnGoogle);
      if(newBooksSaved.length === 0){
        return [];
      }
      return this.booksMapper.toResponseBooks(newBooksSaved);
    }
    return this.booksMapper.toResponseBooks(booksFound);
  }

  private async callExternalApi(query: string): Promise<GoogleBooksApiResponseDto>{
    const returnGoogle = await this.googleBooksApiService.getBooksGoogleApi(query);
    return returnGoogle;
  }

  private async saveNewBooksFromGoogleBooks(newBooks: GoogleBooksApiResponseDto): Promise<BooksEntity[]> {
    if(newBooks.items.length === 0){
      return [];
    }

    const booksModels = newBooks.items.map((book) => {
      return this.booksMapper.toModelBook(book, book.source)
    });

    //ADICIONAR LOGICA PARA VERIFICAR SE O LIVRO JA EXISTE ANTES DE SALVAR
    // SALVAR APENAS OS LIVROS QUE NAO EXISTEM NO BANCO

    const booksEntities = this.booksMapper.toEntityBooks(booksModels);
    await this.booksRepository.createBooks(booksEntities);

    return booksEntities;
  }

  private async verifyExistenceBooks (query: string): Promise<BooksEntity[] | null> {
    const isNumeric = /^\d+$/.test(query);
    if(isNumeric){
      return await this.booksRepository.findBooksByIsbn(query);
    }
    return await this.booksRepository.findBooksByQuery(query);
  }
}
