import { ApiResponse, ApiProperty } from '@nestjs/swagger';

// DTO de exemplo para erro
export class ValidationErrorDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Validation error' })
  message: string;

  @ApiProperty({
    example: [
      { property: 'email', errorMessage: 'email must be an email' },
    ]
  })
  errors?: { property: string; errorMessage: string }[];
}