
import { DataSource } from 'typeorm';
import { HealthResponseDto } from '../dto/healthResponse.dto';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Metadata } from '../../../utils/metaData';
import { HealthMapper } from '../mapper/health.mapper';

@Injectable()
export class HealthService {

  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async check(): Promise<HealthResponseDto> {

    const result = await this.dataSource.query('SELECT 1 as alive') ?? [];
    Logger.log(`Health check DB result: ${JSON.stringify(result)}`, Metadata.create());

    if (result.length === 0) {
      Logger.log(`Api is not healthy: ${JSON.stringify(result)}`, Metadata.create());
      throw new InternalServerErrorException('Api is not healthy');
    }
    return HealthMapper.toResponse('Api is healthy');
  }
}
