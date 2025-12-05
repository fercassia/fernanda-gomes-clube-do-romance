import { Injectable } from "@nestjs/common";
import { GoogleBooksApiResponseDto } from "./googleBooksApiResponse.dto";
import { BooksResponseDto } from "../dto/booksResponse.dto";
import { IApiGoogleBooksResponse } from "./interfaces/iApiGoogleBooksResponse ";
import { IApiGoogleBooksItem } from "./interfaces/iApiGoogleBooksItem";
import { SourceEnum } from "../enum/source.enum";

@Injectable()
export class GoogleBooksApiMapper {
  toResponseDtoApiGoogleBooks(data: IApiGoogleBooksResponse): GoogleBooksApiResponseDto {
    const itemsListData = (data.items?? []).map((item: IApiGoogleBooksItem) => {
      return new BooksResponseDto (
        item.id,
        SourceEnum.GOOGLE_BOOKS_API,
        item.volumeInfo.title,
        item.volumeInfo.authors,
        item.selfLink,
        item.volumeInfo.publisher,
        item.volumeInfo.publishedDate,
        item.volumeInfo.pageCount,
        item.volumeInfo.language,
  item.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier ?? null,
        item.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier ?? null,
        item.volumeInfo.averageRating,
        item.volumeInfo.ratingsCount,
        item.volumeInfo.description,
      )
    })
    return new GoogleBooksApiResponseDto(itemsListData);
  }
}