"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SearchX, SlidersHorizontal, X } from "lucide-react";
import {
  Button,
  Chip,
  EmptyState,
  ErrorState,
  LoadingRegion,
  Modal,
  Pagination,
  SearchInput,
  Select,
} from "@/components/common";
import { TalentCard, TalentCardSkeleton } from "@/components/domain";
import { getPopularKeywords, getTalentRegions, searchTalents } from "@/lib/api/talents";
import { useAsync } from "@/lib/useAsync";
import { cx } from "@/lib/format";
import {
  SORT_OPTIONS,
  countActiveFilters,
  hourLabel,
  resetFilters,
  type TalentQuery,
  type TalentSort,
} from "@/lib/talentQuery";
import { CATEGORIES, categoryLabel } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { useWallet } from "@/store/walletStore";
import { useLikeStore } from "@/store/likeStore";
import { toast } from "@/store/toastStore";
import { FilterPanel } from "./FilterPanel";
import { LAST_SEARCH_KEY, useTalentQuery } from "./useTalentQuery";

const GRID = "grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3";
const PAGE_SIZE = 9;

/** PAGE 01. 재능 찾기 — 검색 조건은 모두 URL 쿼리와 동기화된다 */
export function TalentSearchPage() {
  const { query, update, queryString } = useTalentQuery();
  const user = useAuthStore((s) => s.user);
  const wallet = useWallet(user?.id);
  const likedIds = useLikeStore((s) => s.ids);
  const toggleLike = useLikeStore((s) => s.toggle);
  const [filterOpen, setFilterOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // 검색창 입력값: URL 의 q 가 바뀌면(키워드 클릭·뒤로 가기) 따라서 갱신
  const [input, setInput] = useState(query.q);
  const [lastQ, setLastQ] = useState(query.q);
  if (lastQ !== query.q) {
    setLastQ(query.q);
    setInput(query.q);
  }

  const maxCoin = user ? wallet.available : undefined;
  const result = useAsync(
    () => searchTalents(query, { interests: user?.interests, maxCoin, pageSize: PAGE_SIZE }),
    [queryString, user?.interests, maxCoin],
  );
  const { data: regions } = useAsync(getTalentRegions, []);
  const { data: keywords } = useAsync(getPopularKeywords, []);

  // 상세 페이지의 '목록으로' 가 이 검색 조건으로 돌아올 수 있게 저장
  useEffect(() => {
    try {
      sessionStorage.setItem(LAST_SEARCH_KEY, queryString);
    } catch {
      /* 저장소 사용 불가 환경은 무시 */
    }
  }, [queryString]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    update({ q: input.trim() }, true);
  };

  const onToggleLike = (id: string) => {
    if (!user) {
      toast.info("로그인 후 관심 재능을 저장할 수 있어요.");
      return;
    }
    toast.show(toggleLike(id) ? "관심 재능에 추가했어요." : "관심 재능에서 뺐어요.");
  };

  const goPage = (page: number) => {
    update({ page });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeCount = countActiveFilters(query);
  const providerName = query.provider ? result.data?.items[0]?.provider.nickname : undefined;

  return (
    <div className="page-container">
      {/* ── 상단: 제목 · 검색 · 인기 키워드 ── */}
      <section aria-labelledby="search-title" className="mb-6 md:mb-8">
        <h1 id="search-title" className="text-h1">
          어떤 재능을 찾고 계신가요?
        </h1>
        <p className="mt-1.5 text-fg-muted">당신에게 필요한 재능을 가진 타임메이트를 만나보세요.</p>

        <form role="search" aria-label="재능 검색" onSubmit={onSearch} className="mt-5 flex flex-col gap-2 sm:flex-row">
          <SearchInput
            aria-label="재능 검색어"
            value={input}
            onValueChange={(v) => {
              setInput(v);
              if (!v && query.q) update({ q: "" }); // X 버튼으로 지우면 검색어 조건도 해제
            }}
            placeholder="재능, 제공자, 키워드로 검색해 보세요"
            containerClassName="flex-1"
            className="h-12"
          />
          <Button type="submit" size="lg" className="sm:w-28">
            검색
          </Button>
        </form>

        {keywords && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-body-sm font-semibold text-fg-muted">인기 검색</span>
            {keywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => update({ q: kw }, true)}
                aria-pressed={query.q === kw}
                className={cx(
                  "rounded-full border px-3 py-1 text-body-sm transition-colors",
                  query.q === kw ? "border-navy bg-navy text-white" : "border-divider bg-surface text-fg-secondary hover:border-navy hover:text-fg",
                )}
              >
                {kw}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── 카테고리 ── */}
      <nav aria-label="카테고리" className="-mx-(--gutter) mb-6 flex gap-2 overflow-x-auto px-(--gutter) pb-1 [scrollbar-width:none]">
        <Chip selected={!query.category} onClick={() => update({ category: null })}>
          전체
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.id} selected={query.category === c.id} onClick={() => update({ category: c.id })}>
            {c.label}
          </Chip>
        ))}
      </nav>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-8">
        {/* ── PC 필터 사이드바 ── */}
        <aside aria-label="필터" className="hidden rounded-lg border border-divider bg-surface p-5 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:block">
          <FilterPanel query={query} onChange={update} regions={regions ?? []} availableCoin={maxCoin} />
        </aside>

        <div ref={resultsRef} className="min-w-0 scroll-mt-[calc(var(--header-h)+16px)]">
          {/* ── 결과 툴바: 개수 · 필터 버튼 · 정렬 ── */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <p className="mr-auto text-body-md" aria-live="polite">
              {result.loading ? (
                <span className="text-fg-muted">검색 중…</span>
              ) : result.data ? (
                <>
                  <strong className="text-fg">{result.data.total}개</strong>
                  <span className="text-fg-muted">의 재능</span>
                </>
              ) : null}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              leftIcon={<SlidersHorizontal size={16} />}
              onClick={() => setFilterOpen(true)}
              aria-label={`필터 열기${activeCount ? `, ${activeCount}개 적용 중` : ""}`}
            >
              필터
              {activeCount > 0 && <span className="rounded-full bg-navy px-1.5 text-[11px] leading-[18px] text-white">{activeCount}</span>}
            </Button>
            <div className="w-32">
              <Select
                aria-label="정렬"
                size="sm"
                value={query.sort}
                onChange={(e) => update({ sort: e.target.value as TalentSort })}
                options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              />
            </div>
          </div>

          {/* ── 적용 중인 조건 ── */}
          <ActiveFilters query={query} providerName={providerName} onChange={update} />

          {/* ── 결과 ── */}
          {result.loading ? (
            <LoadingRegion label="재능을 검색하는 중">
              <div className={GRID}>
                {Array.from({ length: 6 }, (_, i) => (
                  <TalentCardSkeleton key={i} layout="responsive" />
                ))}
              </div>
            </LoadingRegion>
          ) : result.error ? (
            <div className="rounded-lg border border-divider bg-surface">
              <ErrorState title="재능 목록을 불러오지 못했어요" onRetry={result.reload} />
            </div>
          ) : !result.data?.items.length ? (
            <NoResults query={query} keywords={keywords ?? []} onChange={update} />
          ) : (
            <>
              <ul className={GRID}>
                {result.data.items.map((t) => (
                  <li key={t.id}>
                    <TalentCard
                      talent={t}
                      provider={t.provider}
                      layout="responsive"
                      liked={!!user && likedIds.includes(t.id)}
                      onToggleLike={onToggleLike}
                    />
                  </li>
                ))}
              </ul>
              <Pagination className="mt-8" page={result.data.page} totalPages={result.data.totalPages} onChange={goPage} />
            </>
          )}
        </div>
      </div>

      {/* ── 태블릿·모바일 필터 (모바일은 하단 시트) ── */}
      <Modal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="필터"
        footer={
          <>
            <Button variant="secondary" fullWidth onClick={() => update(resetFilters(query))} disabled={activeCount === 0}>
              초기화
            </Button>
            <Button fullWidth onClick={() => setFilterOpen(false)}>
              {result.loading ? "검색 중…" : `${result.data?.total ?? 0}개 재능 보기`}
            </Button>
          </>
        }
      >
        <FilterPanel query={query} onChange={update} regions={regions ?? []} availableCoin={maxCoin} className="[&>div:first-child]:hidden" />
      </Modal>
    </div>
  );
}

/** 적용 중인 검색어·카테고리·필터를 칩으로 보여주고 하나씩 해제 */
function ActiveFilters({ query, providerName, onChange }: { query: TalentQuery; providerName?: string; onChange: (p: Partial<TalentQuery>) => void }) {
  const chips: { key: string; label: string; clear: Partial<TalentQuery> }[] = [];
  if (query.q) chips.push({ key: "q", label: `"${query.q}"`, clear: { q: "" } });
  if (query.category) chips.push({ key: "category", label: categoryLabel(query.category), clear: { category: null } });
  if (query.mode) chips.push({ key: "mode", label: query.mode === "online" ? "온라인" : "오프라인", clear: { mode: null } });
  if (query.region) chips.push({ key: "region", label: query.region, clear: { region: null } });
  query.hours.forEach((h) => chips.push({ key: `h${h}`, label: hourLabel(h), clear: { hours: query.hours.filter((x) => x !== h) } }));
  if (query.affordable) chips.push({ key: "affordable", label: "내 코인으로 이용 가능", clear: { affordable: false } });
  if (query.minRating) chips.push({ key: "rating", label: `★ ${query.minRating} 이상`, clear: { minRating: null } });
  if (query.provider) chips.push({ key: "provider", label: `제공자: ${providerName ?? "선택한 제공자"}`, clear: { provider: null } });
  if (!chips.length) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-1.5" aria-label="적용 중인 조건">
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => onChange(c.clear)}
          aria-label={`${c.label} 조건 해제`}
          className="inline-flex h-8 items-center gap-1 rounded-full bg-secondary-soft pr-2 pl-3 text-body-sm font-medium text-secondary transition-colors hover:bg-[#dbe3ea]"
        >
          {c.label}
          <X size={14} />
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange({ ...resetFilters(query), q: "", category: null })}
        className="ml-1 rounded-sm text-body-sm font-semibold text-fg-muted underline-offset-2 hover:text-fg hover:underline"
      >
        전체 해제
      </button>
    </div>
  );
}

/** 검색 결과 없음 — 원인(검색어 / 필터)에 맞는 안내와 해결 동작 제공 */
function NoResults({ query, keywords, onChange }: { query: TalentQuery; keywords: string[]; onChange: (p: Partial<TalentQuery>, push?: boolean) => void }) {
  const hasFilters = countActiveFilters(query) > 0 || !!query.category;
  return (
    <div className="rounded-lg border border-divider bg-surface">
      <EmptyState
        icon={<SearchX size={24} />}
        title={query.q ? `'${query.q}'에 맞는 재능이 없어요` : "조건에 맞는 재능이 없어요"}
        description={
          query.q && hasFilters
            ? "필터를 줄이거나 다른 검색어로 찾아보세요."
            : query.q
              ? "단어를 줄이거나 다른 검색어로 찾아보세요."
              : "필터 조건을 바꿔보세요."
        }
        action={
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
              {hasFilters && (
                <Button variant="outline" onClick={() => onChange({ ...resetFilters(query), category: null })}>
                  필터 초기화
                </Button>
              )}
              {query.q && (
                <Button variant="secondary" onClick={() => onChange({ q: "" })}>
                  검색어 지우기
                </Button>
              )}
            </div>
            {query.q && keywords.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5">
                {keywords.map((kw) => (
                  <Link key={kw} href={`/talents?q=${encodeURIComponent(kw)}`} className="rounded-full border border-divider px-3 py-1 text-body-sm text-fg-secondary hover:border-navy hover:text-fg">
                    {kw}
                  </Link>
                ))}
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}
