import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { GoogleBooksApiResponseDto } from "./googleBooksApiResponse.dto";
import { GoogleBooksApiMapper } from "./googleBooksApi.mapper";

@Injectable()
export class GoogleBooksApiService {
  private readonly baseUrl: string = 'https://www.googleapis.com/books/v1/volumes/';

  constructor(private readonly httpService: HttpService, private readonly googleBooksApiMapper: GoogleBooksApiMapper) { }

  async getBooksGoogleApi(query: string): Promise<GoogleBooksApiResponseDto> {

    const response = this.httpService.get(this.baseUrl, {
      params: {
        q: query,
        orderBy: 'newest',
        key: process.env.KEY_GOOGLE_BOOKS,
      },
      headers: {
        Accept: 'application/json',
      },
    });

    const { data } = await firstValueFrom(response);
    return this.googleBooksApiMapper.toResponseDtoApiGoogleBooks(data);
  }
}