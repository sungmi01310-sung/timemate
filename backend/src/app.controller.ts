import { Controller, Get } from '@nestjs/common';
import { AppService, type HealthStatus } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /** GET /api/health — 프론트(frontend)에서 연결 확인용 */
  @Get('health')
  health(): HealthStatus {
    return this.appService.health();
  }
}
