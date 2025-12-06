import { Injectable } from '@nestjs/common';
import { BooksSearchModel } from '../model/booksSearch.model';
import { BooksSearchRequestDto } from '../dto/booksSearchRequest.dto';
import { BooksModel } from '../model/books.model';
import { BooksEntity } from '../entities/books.entity';
import { BooksResponseDto } from '../dto/booksResponse.dto';

@Injectable()
export class BooksMapper {
  
  //Usado para quando buscar livros com esses parametros e converter para modelo interno
  toBooksSearchModel(dto: BooksSearchRequestDto): BooksSearchModel {
    return new BooksSearchModel(
      dto.query,
      dto.page,
      dto.limit,
      dto.filter,
      dto.type,
    );
  }
  //Usado para quando buscar livros na api externa e converter para modelo interno
  toModelBook(dto: BooksResponseDto): BooksModel {
    return new BooksModel(
      dto.externalId,
      dto.source,
      dto.title,
      dto.authors,
      dto.type,
      dto.selfLink,
      dto.publisher,
      dto.publishedDate,
      dto.pageCount,
      dto.language,
      dto.isbn13,
      dto.isbn10,
      dto.averageRating,
      dto.ratingsCount,
      dto.description,
    );
  }

  //Usado para pegar o model e converter para entity para salvar no banco
  toEntityBooks(model: BooksModel[]): BooksEntity[] {
    return model.map((book) => {
      const entity = new BooksEntity();
      entity.externalId = book.externalId;
      entity.source = book.source;
      entity.title = book.title;
      entity.authors = book.authors;
      entity.type = book.type;
      entity.selfLink = book.selfLink;
      entity.publisher = book.publisher;
      entity.publishedDate = book.publishedDate;
      entity.pageCount = book.pageCount;
      entity.language = book.language;
      entity.isbn13 = book.isbn13;
      entity.isbn10 = book.isbn10;
      entity.averageRating = book.averageRating;
      entity.ratingsCount = book.ratingsCount;
      entity.description = book.description;
      return entity;
    });
  }

  //Usado para pegar a entity do banco e converter para response dto - lista de livros salvos no banco
  toResponseBooks(entity: BooksEntity[]): BooksResponseDto[] {
    return entity.map((book) =>
        new BooksResponseDto(
          book.externalId,
          book.source,
          book.title,
          book.authors,
          book.type,
          book.selfLink,
          book.publisher,
          book.publishedDate,
          book.pageCount,
          book.language,
          book.isbn13,
          book.isbn10,
          book.averageRating,
          book.ratingsCount,
          book.description,
        ),
    );
  }
}
