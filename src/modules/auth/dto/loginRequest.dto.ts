import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
    maxLength: 40,
    required: true
  })
  @IsString()
  @IsEmail({}, { message: 'Email invalid' })
  @MaxLength(40, { message: 'Email invalid' })
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'P@ssword123',
    maxLength: 20,
    required: true
  })
  @IsString()
  @MaxLength(20, { message: 'Password invalid' })
  readonly password: string;
}
