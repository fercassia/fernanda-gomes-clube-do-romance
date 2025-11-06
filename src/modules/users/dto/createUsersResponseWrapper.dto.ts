import { ApiProperty } from '@nestjs/swagger';
import { CreateUsersResponseDto } from './createUsersResponse.dto';

export class CreateUsersResponseWrapperDto {
 @ApiProperty({ example: 'User created successfully' })
  message: string;

  @ApiProperty({ type: CreateUsersResponseDto })
  data: CreateUsersResponseDto;
}