import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { BooksService } from '../services/books.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ValidationErrorDto } from '../../../error/dto/ValidationErrorDto';
import { BooksResponseDto } from '../dto/booksResponse.dto';
import { BooksSearchRequestDto } from '../dto/booksSearchRequest.dto';
import { ValidationUnauthorizedDto } from '../../../error/dto/validationUnauthorizedDto';
import { BooksMapper } from '../mapper/books.mapper';
import { BooksSearchModel } from '../model/booksSearch.model';

@Controller('api/v1/books')
@ApiTags('Books')
@ApiBearerAuth('access-token')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly booksMapper: BooksMapper,
  ) {}

  @ApiOkResponse({
    description: 'Books returned successfully.',
    type: BooksResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Invalid user data.',
    type: ValidationErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access.',
    type: ValidationUnauthorizedDto,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getBooks(
    @Query() querySearch: BooksSearchRequestDto,
  ): Promise<BooksResponseDto[]> {
    const searchParamsModel: BooksSearchModel =
      this.booksMapper.toBooksSearchModel(querySearch);
    return this.booksService.getBooks(searchParamsModel);
  }
}
