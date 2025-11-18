import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
    maxLength: 100,
    required: true
  })
  @IsString()  
  @Matches(/^[a-zA-Z0-9._-]{3,}@[a-zA-Z0-9-]{2,}\.[a-zA-Z]{2,}$/, {
      message: 'Email invalid'
  })
  @MaxLength(100, { message: 'Email invalid' })
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
