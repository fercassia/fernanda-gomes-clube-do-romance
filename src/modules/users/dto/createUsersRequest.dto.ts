import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUsersRequestDto {
  @ApiProperty({
    description: 'The display name of the user',
    example: 'JohnDoe',
    maxLength: 70
  })
  @IsString()
  @MaxLength(70, { message: 'Display name must be at most 70 characters long' })
  @MinLength(3, { message: 'Display name must be at least 3 characters long' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'display name can only contain letters, numbers, underscores and hyphens'
  })
  readonly displayName: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
    maxLength: 100
  })
  @IsEmail({ 
    allow_utf8_local_part: false,
    domain_specific_validation: true
  }, { message: 'Invalid email format.' })
  @Matches(/^[a-zA-Z0-9._-]{3,}@[a-zA-Z0-9-]{2,}\.[a-zA-Z]{2,}$/, {
    message: 'Invalid email. Valid email: johndoe@example.com'
  })
  @MaxLength(100, { message: 'Email must be at most 100 characters long' })
  @MinLength(5, { message: 'Email must be at least 5 characters long' })
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'P@ssword123',
    minLength: 8,
    maxLength: 20
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character (@$!%*?&)'
  })
  readonly password: string;
}
