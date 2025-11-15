import { ApiProperty } from '@nestjs/swagger';

// DTO de exemplo para erro
export class ValidationUnauthorizedDto {
  @ApiProperty({ example: "/api/v1/auth/login" })
  path: string;

  @ApiProperty({ example: { status: 401, errorText: {message: 'Unauthorized', remainingAttempts: 2} } })
  cause?: { status: number; errorText: {message: string, remainingAttempts: number, retryAfterMinutes?: number} }
}