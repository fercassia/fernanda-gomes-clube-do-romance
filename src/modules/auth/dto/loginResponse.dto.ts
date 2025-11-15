import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token of the authenticated user - JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCfggrkpXVCJ9.eyJpZCI6MSfdsefhaWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2ODgwMDAwMDAsImV4cCI6MTY4ODAfsfe0.SflKsdfsdfsdfeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
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
