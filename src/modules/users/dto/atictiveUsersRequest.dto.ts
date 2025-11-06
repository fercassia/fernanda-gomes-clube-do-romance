import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class ActiveUsersRequestIdDto {
  @ApiProperty({
    description: 'The Code user activation',
    example: 123444,
    required: true,
    maximum: 999999,
    maxLength: 6,
    minLength: 6
  })
  @IsNumberString()
  readonly codActive: string;
}
