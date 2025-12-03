import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { GoogleBooksApiResponseDto } from "./googleBooksApiResponse.dto";
import { GoogleBooksApiMapper } from "./googleBooksApi.mapper";

@Injectable()
export class GoogleBooksApiService {
  private readonly baseUrl: string = 'https://www.googleapis.com/books/v1/volumes/';

  constructor(private readonly httpService: HttpService, private readonly googleBooksApiMapper: GoogleBooksApiMapper) { }

  async getBooksGoogleApi(query: Record<string, string>): Promise<GoogleBooksApiResponseDto> {
    const queryString = await this.queryBuilderSearchParams(query);

    const response = this.httpService.get(this.baseUrl, {
      params: {
        q: queryString,
        key: process.env.KEY_GOOGLE_BOOKS,
      },
      headers: {
        Accept: 'application/json',
      },
    });

    const { data } = await firstValueFrom(response);
    return this.googleBooksApiMapper.toResponseDtoApiGoogleBooks(data);
  }

  private async queryBuilderSearchParams(query: Record<string, string>): Promise<string>{

    const stringValues: string[] = [];

    if (query.title) {
      stringValues.push(query.title);
    }

    if (query.author) {
      stringValues.push(query.author);
    }

    if (query.category) {
      stringValues.push(query.category);
    }

    const queryString = stringValues.map(value => value).join('&');

    return queryString;
  }
}