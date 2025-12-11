import { Controller, HttpCode, HttpStatus, Get } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../../config/auth/public.decorator';
import { HealthResponseDto } from '../dto/healthResponse.dto';
import { HealthService } from '../service/health.service';

@Controller('api/v1/health')
@ApiTags('Health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'API is Available',
    type: HealthResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: 'API Not Available.' })
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getHealth(): Promise<HealthResponseDto> {
    return await this.healthService.check();
  }
}
