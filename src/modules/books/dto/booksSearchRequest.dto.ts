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
import type { BookType, FilterType } from '../../../utils/types/searchTypes';

export class BooksSearchRequestDto {
  @ApiPropertyOptional({
    description: 'Query (opcional)',
    example: 'It a Coisa',
  })
  @IsOptional()
  @IsString()
  query: string;

  @ApiPropertyOptional({ description: 'Página (opcional)', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @IsPositive()
  page: number;

  @ApiPropertyOptional({ description: 'Limite (opcional)', example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(40)
  @IsPositive()
  limit: number;

  @ApiPropertyOptional({ description: 'Filter (opcional)', example: 'newest' })
  @IsOptional()
  @IsString()
  filter: FilterType;

  @ApiPropertyOptional({ description: 'Type (opcional)', example: 'book' })
  @IsOptional()
  @IsString()
  type: BookType;
}
