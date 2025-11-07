import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class LoginUsersRequestDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
    maxLength: 100,
    required: true
  })
  @MaxLength(100, { message: 'Email invalid' })
  @MinLength(5, { message: 'Email invalid' })
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'P@ssword123',
    minLength: 8,
    maxLength: 20,
    required: true
  })
  @IsString()
  @MinLength(8, { message: 'Password invalid' })
  @MaxLength(20, { message: 'Password invalid' })
  readonly password: string;
}
