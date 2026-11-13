import { apiFetch } from "./client";

export interface HealthResponse {
  status: "ok";
  service: string;
  time: string;
}

/** [API] NestJS 서버 상태 확인 (GET /api/health) */
export const getHealth = () => apiFetch<HealthResponse>("/health");
