/**
 * API 클라이언트.
 *
 * - NEXT_PUBLIC_API_URL : NestJS 서버 주소 (기본 http://localhost:10000/api)
 * - NEXT_PUBLIC_USE_MOCK: "false" 로 설정하면 mock 대신 실제 API를 호출한다.
 *
 * 각 도메인 모듈(talents.ts, trades.ts …)은 USE_MOCK 분기로
 * [MOCK] 구현과 [API] 구현을 함께 가진다. 화면 컴포넌트는 항상 이 계층만 호출한다.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:10000/api";
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new ApiError(res.status, body?.message ?? `요청에 실패했습니다. (${res.status})`);
  }
  return (await res.json()) as T;
}

/** mock 응답에 네트워크 지연을 흉내낸다 */
export const mockDelay = <T,>(value: T, ms = 250) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
