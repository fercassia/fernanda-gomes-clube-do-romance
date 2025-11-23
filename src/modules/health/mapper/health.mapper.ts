import { HealthResponseDto } from "../dto/healthResponse.dto";

export class HealthMapper {

  static toResponse(message: string): HealthResponseDto {
    return new HealthResponseDto(message);
  }
}
