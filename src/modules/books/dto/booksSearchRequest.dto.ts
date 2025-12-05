import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

type BookType = 'magazine' | 'book';
type FilterType = 'newest' | 'ranking';

export class BooksSearchRequestDto {
  @ApiPropertyOptional({
    description: 'Query (opcional)',
    example: 'It a Coisa',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  query?: string;

  @ApiPropertyOptional({ description: 'Página (opcional)', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsPositive()
  page?: number;

  @ApiPropertyOptional({ description: 'Limite (opcional)', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  @IsPositive()
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter (opcional)', example: 'newest' })
  @IsOptional()
  @Type(() => String)
  @IsString()
  filter?: FilterType;

  @ApiPropertyOptional({ description: 'Type (opcional)', example: 'book' })
  @IsOptional()
  @Type(() => String)
  @IsString()
  type?: BookType;
}
