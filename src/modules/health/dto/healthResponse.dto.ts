import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class HealthResponseDto {
  @ApiProperty({
    description: 'Message Api is healthy',
  })
  @IsString()
  readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}
