import { Module } from '@nestjs/common';
import { HealthController } from './controller/health.controller';
import { HealthService } from './service/health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
