/**
 * 재능(Talent) API.
 *
 *  [MOCK] 지금은 mocks/*.ts 를 사용한다.
 *  [API]  NestJS TalentController 구현 후 USE_MOCK=false 로 바꾸면 아래 apiFetch 경로를 호출한다.
 *         예정 라우트: GET /api/talents, /api/talents/:id, /api/talents/:id/reviews, /api/talents/regions
 *
 * 화면 컴포넌트는 mocks 를 직접 import 하지 말고 이 함수들만 호출한다.
 */
import { categoryLabel, type CategoryId, type Review, type Talent, type TalentDetail, type User } from "@/types";
import { mockLikedTalentIds, mockPopularKeywords, mockReviews, mockTalents, mockUsers } from "@/mocks/data";
import { mockCompletedTradeCounts, mockExtraReviews, mockTalentDetails } from "@/mocks/talentDetails";
import { toQueryString, type TalentQuery, type TalentSort } from "@/lib/talentQuery";
import { USE_MOCK, apiFetch, mockDelay } from "./client";

/* ── 응답 타입 (프론트 표시용 = API 응답 형태) ─────────────── */

/** 목록·카드용: 재능 + 제공자 요약 */
export type TalentWithProvider = Talent & {
  provider: Pick<User, "id" | "nickname" | "avatarUrl">;
};

/** 상세용 제공자 프로필 */
export type ProviderProfile = Pick<User, "id" | "nickname" | "avatarUrl" | "bio" | "skills" | "interests" | "rating" | "reviewCount" | "region"> & {
  completedTradeCount: number;
};

/** 상세용: 재능 상세 + 제공자 프로필 */
export type TalentDetailResponse = TalentDetail & { provider: ProviderProfile };

export type ReviewWithAuthor = Review & { author: Pick<User, "id" | "nickname" | "avatarUrl"> };

export interface TalentSearchResult {
  items: TalentWithProvider[];
  total: number;
  page: number;
  totalPages: number;
}

/* ── 정렬 기준 (실제 데이터 필드 기반) ─────────────────────── */

/**
 * 후기 수를 반영한 평점 (베이지안 평균).
 * 후기가 적은 재능의 5.0 이 후기 많은 4.9 를 이기지 않도록 평균 4.5 · 가중치 5 로 보정한다.
 */
const trustedRating = (t: Talent) => (t.rating * t.reviewCount + 4.5 * 5) / (t.reviewCount + 5);
/** 인기 점수 = 관심(하트) 수 + 후기 수 × 3 (후기는 실제 거래 완료를 의미하므로 가중) */
export const popularityScore = (t: Talent) => t.likeCount + t.reviewCount * 3;

function sortTalents(list: Talent[], sort: TalentSort, interests: CategoryId[] = []) {
  const byInterest = (a: Talent, b: Talent) => Number(interests.includes(b.category)) - Number(interests.includes(a.category));
  const compare: Record<TalentSort, (a: Talent, b: Talent) => number> = {
    recommended: (a, b) => byInterest(a, b) || trustedRating(b) - trustedRating(a),
    popular: (a, b) => popularityScore(b) - popularityScore(a),
    rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
    latest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  };
  return [...list].sort(compare[sort]);
}

/* ── mock 헬퍼 ─────────────────────────────────────────────── */

const userOf = (id: string) => mockUsers.find((m) => m.id === id);
const summaryOf = (id: string) => ({ id, nickname: userOf(id)?.nickname ?? "알 수 없음", avatarUrl: userOf(id)?.avatarUrl });
const attachProvider = (t: Talent): TalentWithProvider => ({ ...t, provider: summaryOf(t.providerId) });
const publicTalents = () => mockTalents.filter((t) => t.isPublic);

/** 검색어를 공백으로 나눠 모든 단어가 제목·소개·설명·카테고리·제공자 닉네임/보유 재능 중 어딘가에 포함되면 일치 */
function matchesKeyword(t: Talent, q: string) {
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return true;
  const u = userOf(t.providerId);
  const haystack = [t.title, t.summary, t.description, categoryLabel(t.category), u?.nickname, ...(u?.skills ?? [])].join(" ").toLowerCase();
  return tokens.every((tk) => haystack.includes(tk));
}

/* ── 목록 / 검색 ───────────────────────────────────────────── */

/**
 * 재능 검색 (검색어 + 카테고리 + 다중 필터 + 정렬 + 페이지네이션)
 * GET /api/talents?q=&category=&mode=&region=&hours=1,2&minRating=&provider=&sort=&page=&pageSize=
 */
export async function searchTalents(
  query: TalentQuery,
  ctx: { interests?: CategoryId[]; maxCoin?: number; pageSize?: number } = {},
): Promise<TalentSearchResult> {
  const pageSize = ctx.pageSize ?? 9;
  if (!USE_MOCK) {
    const extra = new URLSearchParams({ pageSize: String(pageSize), ...(ctx.maxCoin !== undefined && query.affordable ? { maxCoin: String(ctx.maxCoin) } : {}) });
    return apiFetch<TalentSearchResult>(`/talents?${toQueryString(query)}&${extra}`);
  }

  const filtered = publicTalents().filter((t) => {
    if (!matchesKeyword(t, query.q)) return false;
    if (query.category && t.category !== query.category) return false;
    // "온·오프라인(both)" 재능은 온라인·오프라인 필터 모두에 포함
    if (query.mode && t.mode !== query.mode && t.mode !== "both") return false;
    // 지역은 오프라인 진행이 가능한 재능에만 의미가 있다
    if (query.region && (t.mode === "online" || t.region !== query.region)) return false;
    if (query.hours.length && !query.hours.some((h) => (h === 3 ? t.hours >= 3 : t.hours === h))) return false;
    if (query.affordable && ctx.maxCoin !== undefined && t.hours > ctx.maxCoin) return false;
    if (query.minRating && t.rating < query.minRating) return false;
    if (query.provider && t.providerId !== query.provider) return false;
    return true;
  });

  const sorted = sortTalents(filtered, query.sort, ctx.interests);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const page = Math.min(query.page, totalPages);
  const items = sorted.slice((page - 1) * pageSize, page * pageSize).map(attachProvider);
  return mockDelay({ items, total: sorted.length, page, totalPages }, 350);
}

/** 오프라인 진행 지역 목록 (필터 선택지) — GET /api/talents/regions */
export async function getTalentRegions() {
  if (!USE_MOCK) return apiFetch<string[]>(`/talents/regions`);
  const regions = [...new Set(publicTalents().filter((t) => t.mode !== "online" && t.region).map((t) => t.region!))].sort();
  return mockDelay(regions, 100);
}

/** 추천 재능 (메인) — 추천순 정렬과 동일 기준, 내 재능 제외. GET /api/talents/recommended?limit=4 */
export async function getRecommendedTalents(params: { interests: CategoryId[]; excludeUserId?: string; limit?: number }) {
  const { interests, excludeUserId, limit = 4 } = params;
  if (!USE_MOCK) return apiFetch<TalentWithProvider[]>(`/talents/recommended?limit=${limit}`);
  const list = sortTalents(publicTalents().filter((t) => t.providerId !== excludeUserId), "recommended", interests);
  return mockDelay(list.slice(0, limit).map(attachProvider), 400);
}

/** 인기 재능 (메인) — GET /api/talents?sort=popular&category=&pageSize=4 */
export async function getPopularTalents(params: { category?: CategoryId; limit?: number } = {}) {
  const { category, limit = 4 } = params;
  if (!USE_MOCK) {
    const q = new URLSearchParams({ sort: "popular", pageSize: String(limit), ...(category ? { category } : {}) });
    return (await apiFetch<TalentSearchResult>(`/talents?${q}`)).items;
  }
  const list = sortTalents(publicTalents().filter((t) => !category || t.category === category), "popular");
  return mockDelay(list.slice(0, limit).map(attachProvider), 400);
}

/** 여러 id 의 재능 (관심 재능) — GET /api/talents?ids=a,b */
export async function getTalentsByIds(ids: string[]) {
  if (!USE_MOCK) return (await apiFetch<TalentSearchResult>(`/talents?ids=${ids.join(",")}`)).items;
  return mockDelay(mockTalents.filter((t) => ids.includes(t.id)).map(attachProvider), 300);
}

/** 제공자의 다른 재능 — GET /api/talents?provider=:id */
export async function getProviderTalents(providerId: string, excludeId?: string) {
  if (!USE_MOCK) return (await apiFetch<TalentSearchResult>(`/talents?provider=${providerId}`)).items.filter((t) => t.id !== excludeId);
  return mockDelay(publicTalents().filter((t) => t.providerId === providerId && t.id !== excludeId).map(attachProvider), 300);
}

/* ── 상세 ──────────────────────────────────────────────────── */

/**
 * 재능 상세. 없거나 비공개면 null (→ 화면에서 '존재하지 않는 재능' 처리)
 * GET /api/talents/:id  (404 → null)
 */
export async function getTalentDetail(id: string): Promise<TalentDetailResponse | null> {
  if (!USE_MOCK) {
    try {
      return await apiFetch<TalentDetailResponse>(`/talents/${encodeURIComponent(id)}`);
    } catch (e) {
      if ((e as { status?: number }).status === 404) return null;
      throw e;
    }
  }
  const t = publicTalents().find((x) => x.id === id);
  if (!t) return mockDelay(null, 300);
  const u = userOf(t.providerId);
  const detail = mockTalentDetails[id] ?? { images: [], offerings: [], targets: [], materials: [], process: [], notes: [], schedule: [] };
  return mockDelay(
    {
      ...t,
      ...detail,
      images: t.imageUrl ? [t.imageUrl, ...detail.images] : detail.images,
      provider: {
        id: t.providerId,
        nickname: u?.nickname ?? "알 수 없음",
        avatarUrl: u?.avatarUrl,
        bio: u?.bio ?? "",
        skills: u?.skills ?? [],
        interests: u?.interests ?? [],
        rating: u?.rating ?? 0,
        reviewCount: u?.reviewCount ?? 0,
        region: u?.region,
        completedTradeCount: mockCompletedTradeCounts[t.providerId] ?? 0,
      },
    },
    400,
  );
}

/** 재능 후기 목록 (최신순) — GET /api/talents/:id/reviews */
export async function getTalentReviews(id: string): Promise<ReviewWithAuthor[]> {
  if (!USE_MOCK) return apiFetch<ReviewWithAuthor[]>(`/talents/${encodeURIComponent(id)}/reviews`);
  const list = [...mockReviews, ...mockExtraReviews]
    .filter((r) => r.talentId === id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((r) => ({ ...r, author: summaryOf(r.authorId) }));
  return mockDelay(list, 450);
}

/* ── 기타 ──────────────────────────────────────────────────── */

/** 인기 검색 키워드 — GET /api/search/keywords/popular */
export async function getPopularKeywords() {
  if (!USE_MOCK) return apiFetch<string[]>(`/search/keywords/popular`);
  return mockDelay(mockPopularKeywords, 150);
}

/** 관심 재능 초기값 (로그인 사용자) — GET /api/me/likes */
export const INITIAL_LIKED_IDS = mockLikedTalentIds;
