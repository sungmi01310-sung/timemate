import { Injectable } from '@nestjs/common';

export interface HealthStatus {
  status: 'ok';
  service: string;
  time: string;
}

@Injectable()
export class AppService {
  health(): HealthStatus {
    return { status: 'ok', service: 'timemate-api', time: new Date().toISOString() };
  }
}
