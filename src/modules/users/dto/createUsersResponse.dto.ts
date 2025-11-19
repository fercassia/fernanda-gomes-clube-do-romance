import { ApiProperty } from "@nestjs/swagger";

export class CreateUsersResponseDto { 
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  readonly id: string
  @ApiProperty({ example: 'JohnDoe' })
  readonly displayName: string;
  @ApiProperty({ example: 'johndoe@example.com' })
  readonly email: string;
  @ApiProperty({ example: 'Sat Nov 01 2025 11:37:19 GMT+0000 (Coordinated Universal Time)' })
  readonly createdAt: string;
  
  constructor(id: string, displayName: string, email: string, createdAt: string) {
    this.id = id;
    this.displayName = displayName;
    this.email = email;
    this.createdAt = createdAt;
  }
}
