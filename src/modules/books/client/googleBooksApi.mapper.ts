import { Injectable } from "@nestjs/common";
import { GoogleBooksApiResponseDto } from "./googleBooksApiResponse.dto";
import { BooksResponseDto } from "../dto/booksResponse.dto";
import { IApiGoogleBooksResponse } from "./interfaces/iApiGoogleBooksResponse ";
import { IApiGoogleBooksItem } from "./interfaces/iApiGoogleBooksItem";

@Injectable()
export class GoogleBooksApiMapper {
  toResponseDtoApiGoogleBooks(data: IApiGoogleBooksResponse): GoogleBooksApiResponseDto {
    const itemsListData = (data.items?? []).map((item: IApiGoogleBooksItem) => {
      return new BooksResponseDto (
        item.id,
        item.volumeInfo.title,
        item.volumeInfo.authors,
        item.volumeInfo.publisher,
        item.volumeInfo.publishedDate,
        item.volumeInfo.pageCount,
        item.volumeInfo.categories,
        item.volumeInfo.language,
  item.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier ?? null,
        item.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier ?? null,
        item.volumeInfo.averageRating,
        item.volumeInfo.ratingsCount,
        item.volumeInfo.description,
        item.searchInfo?.textSnippet,
      )
    })
    return new GoogleBooksApiResponseDto(itemsListData);
  }
}