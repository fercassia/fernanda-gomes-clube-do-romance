import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class HealthResponseDto {
  @ApiProperty({
    description: 'Message Api is healthy',
    example: 'Api is healthy',
  })
  @IsString()
  readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}
