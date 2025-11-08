import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token of the authenticated user - JWT',
    required: true
  })
  readonly access_token: string;

  @ApiProperty({
    description: 'Type of Token',
    example: 'Bearer',
    required: true
  })
  readonly token_type: string;

  constructor(token: string) {
    this.access_token = token;
    this.token_type = 'Bearer';
  }
}
