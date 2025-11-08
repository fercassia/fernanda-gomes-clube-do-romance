import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token of the authenticated user',
    required: true
  })
  readonly token: string;

  constructor(token: string) {
    this.token = token;
  }
}
