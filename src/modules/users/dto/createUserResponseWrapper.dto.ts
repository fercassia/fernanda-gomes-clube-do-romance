import { ApiProperty } from '@nestjs/swagger';
import { CreateUsersResponseDto } from './createUserResponse.dto';

export class CreateUserResponseWrapperDto {
 @ApiProperty({ example: 'User created successfully' })
  message: string;

  @ApiProperty({ type: CreateUsersResponseDto })
  data: CreateUsersResponseDto;
}