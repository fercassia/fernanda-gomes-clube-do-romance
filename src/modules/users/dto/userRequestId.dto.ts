import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class UsersRequestIdDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  readonly userId: string;
}
