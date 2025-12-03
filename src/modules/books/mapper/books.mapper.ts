import { Injectable } from "@nestjs/common";
import { BooksSearchModel } from "../model/booksSearch.model";
import { BooksSearchRequestDto } from "../dto/booksSearchRequest.dto";

@Injectable()
export class BooksMapper {
  toBooksSearchModel(dto: BooksSearchRequestDto): BooksSearchModel {
    return new BooksSearchModel(
      dto.title,
      dto.author,
      dto.category,
      dto.page,
      dto.limit,
      dto.filter,
      dto.type,
    );
  }

}
