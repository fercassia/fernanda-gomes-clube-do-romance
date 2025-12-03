import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { BooksSearchModel } from '../model/booksSearch.model';
import { GoogleBooksApiService } from '../client/googleBooksApi.service';
import { Metadata } from '../../../utils/metaData';
import { NormalizeValueToQuery } from '../../../utils/normalizeValueToQuery';
import { GoogleBooksApiResponseDto } from '../client/googleBooksApiResponse.dto';

@Injectable()
export class BooksService {
  constructor(private readonly googleBooksApiService: GoogleBooksApiService, private readonly normalizeValueToQuery: NormalizeValueToQuery) { }

  async getBooks(query: BooksSearchModel): Promise<GoogleBooksApiResponseDto>{

    const searchParams: Record<string, string> = this.principalParamsToSearchNotNull(query);
    const returnGoogle = await this.googleBooksApiService.getBooksGoogleApi(searchParams);
    //verificar se tem no banco de dados
    // se não tiver, buscar na api externa

    //Fazer consulta primeira na api externa para definir contrato de retorno e verificar se funciona;
    return returnGoogle;
  }

  private principalParamsToSearchNotNull(query: BooksSearchModel): Record<string, string> {
    const searchParams = {};

    if(query.title !== null){
      searchParams['title'] = query.title;
    }

    if(query.author !== null){
      searchParams['author'] = query.author;
    }

    if(query.category !== null){
      searchParams['category'] = query.category;
    }

    if(query.author === null && query.category === null && query.title === null){
      Logger.warn(`Bad Request - At least one search parameter must be provided.`, Metadata.create({serviceMethod: 'BooksService.getBooks'}));
      throw new BadRequestException('At least one search parameter must be provided.');
    }
    return searchParams;
  }

  //Identificar quais parametros de busca e de filtro nao sao nullo para fazer a filtragem e buscar no banco
  //Talvez fazer uma classe apenas pra isso;
}
