import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { GoogleBooksApiResponseDto } from "./googleBooksApiResponse.dto";
import { GoogleBooksApiMapper } from "./googleBooksApi.mapper";
import { BooksResponseDto } from "../dto/booksResponse.dto";
import { IApiGoogleBooksResponse } from "./interfaces/iApiGoogleBooksResponse ";
import { IApiGoogleBooksItem } from "./interfaces/iApiGoogleBooksItem";

@Injectable()
export class GoogleBooksApiService {
  private readonly baseUrl: string = 'https://www.googleapis.com/books/v1/volumes/';

  constructor(private readonly httpService: HttpService, private readonly googleBooksApiMapper: GoogleBooksApiMapper) { }

  async getBooksGoogleApi(query: string): Promise<GoogleBooksApiResponseDto> {

    const response = this.httpService.get(this.baseUrl, {
      params: {
        q: query,
        orderBy: 'newest',
        maxResults: 40,
        key: process.env.KEY_GOOGLE_BOOKS,
      },
      headers: {
        Accept: 'application/json',
      },
    });

    const { data } = await firstValueFrom(response);
    const booksTitleFiltered: IApiGoogleBooksItem[] = this.removeBooksWithoutTitles(data)
    return this.googleBooksApiMapper.toResponseDtoApiGoogleBooks(booksTitleFiltered);
  }

  private removeBooksWithoutTitles(books: IApiGoogleBooksResponse): IApiGoogleBooksItem[] {
    const filteredItems = books.items.filter(book => !book.volumeInfo.title || book.volumeInfo.title !== '');
    return filteredItems;
  }
}