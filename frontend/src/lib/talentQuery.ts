/**
 * 재능 찾기 검색 조건 ↔ URL Query 변환.
 *
 *   /talents?q=영상&category=video&mode=online&hours=1,2&minRating=4.5&sort=rating&page=2
 *
 * URL 이 "검색 조건의 원본(Single Source of Truth)" 이므로
 * 새로고침 · 뒤로 가기 · 링크 공유 시에도 같은 결과가 나온다.
 * 같은 이름의 쿼리 파라미터를 NestJS GET /api/talents 에서도 그대로 받도록 설계한다.
 */
import { CATEGORIES, type CategoryId } from "@/types";

export const SORT_OPTIONS = [
  { value: "recommended", label: "추천순" },
  { value: "popular", label: "인기순" },
  { value: "rating", label: "평점순" },
  { value: "latest", label: "최신순" },
] as const;
export type TalentSort = (typeof SORT_OPTIONS)[number]["value"];

export type ModeFilter = "online" | "offline";
export const HOUR_OPTIONS = [1, 2, 3] as const; // 3 = 3시간 이상
export type HourOption = (typeof HOUR_OPTIONS)[number];
export const RATING_OPTIONS = [4.5, 4.8] as const;

export interface TalentQuery {
  q: string;
  category: CategoryId | null;
  /** null = 전체 / online / offline ("온·오프라인" 재능은 둘 다에 포함) */
  mode: ModeFilter | null;
  region: string | null;
  /** 소요 시간(=필요 코인) 다중 선택. 3 은 '3시간 이상' */
  hours: HourOption[];
  /** 내 사용 가능 코인 이내 재능만 */
  affordable: boolean;
  minRating: number | null;
  /** 특정 제공자의 재능만 (상세 페이지 '다른 재능 보기') */
  provider: string | null;
  sort: TalentSort;
  page: number;
}

export const DEFAULT_QUERY: TalentQuery = {
  q: "",
  category: null,
  mode: null,
  region: null,
  hours: [],
  affordable: false,
  minRating: null,
  provider: null,
  sort: "recommended",
  page: 1,
};

const isCategory = (v: string | null): v is CategoryId => CATEGORIES.some((c) => c.id === v);

/** URLSearchParams → TalentQuery (잘못된 값은 무시하고 기본값 사용) */
export function parseTalentQuery(sp: URLSearchParams): TalentQuery {
  const category = sp.get("category");
  const mode = sp.get("mode");
  const sort = sp.get("sort");
  const minRating = Number(sp.get("minRating"));
  const page = Number(sp.get("page"));
  return {
    q: (sp.get("q") ?? "").trim(),
    category: isCategory(category) ? category : null,
    mode: mode === "online" || mode === "offline" ? mode : null,
    region: sp.get("region") || null,
    hours: (sp.get("hours") ?? "")
      .split(",")
      .map(Number)
      .filter((h): h is HourOption => (HOUR_OPTIONS as readonly number[]).includes(h)),
    affordable: sp.get("affordable") === "1",
    minRating: (RATING_OPTIONS as readonly number[]).includes(minRating) ? minRating : null,
    provider: sp.get("provider") || null,
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as TalentSort) : "recommended",
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

/** TalentQuery → 쿼리 문자열 (기본값은 생략해 URL 을 짧게 유지) */
export function toQueryString(query: TalentQuery): string {
  const sp = new URLSearchParams();
  if (query.q) sp.set("q", query.q);
  if (query.category) sp.set("category", query.category);
  if (query.mode) sp.set("mode", query.mode);
  if (query.region) sp.set("region", query.region);
  if (query.hours.length) sp.set("hours", [...query.hours].sort().join(","));
  if (query.affordable) sp.set("affordable", "1");
  if (query.minRating) sp.set("minRating", String(query.minRating));
  if (query.provider) sp.set("provider", query.provider);
  if (query.sort !== "recommended") sp.set("sort", query.sort);
  if (query.page > 1) sp.set("page", String(query.page));
  return sp.toString();
}

/** 사이드바 필터 중 적용된 개수 (카테고리·검색어·정렬 제외) */
export function countActiveFilters(q: TalentQuery) {
  return [q.mode, q.region, q.hours.length, q.affordable, q.minRating, q.provider].filter(Boolean).length;
}

/** 필터만 초기화 (검색어·카테고리·정렬은 유지) */
export const resetFilters = (q: TalentQuery): TalentQuery => ({
  ...q,
  mode: null,
  region: null,
  hours: [],
  affordable: false,
  minRating: null,
  provider: null,
  page: 1,
});

export const hourLabel = (h: HourOption) => (h === 3 ? "3시간 이상" : `${h}시간`);
