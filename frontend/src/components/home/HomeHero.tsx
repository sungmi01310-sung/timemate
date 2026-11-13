"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { Button, SearchInput } from "@/components/common";
import { getPopularKeywords } from "@/lib/api/talents";
import { useAsync } from "@/lib/useAsync";
import { talentSearchHref } from "@/lib/search";

/**
 * SECTION 02. 메인 히어로 (다크 네이비)
 * 메인 카피 · 서브 카피 · 재능 검색 · 인기 키워드 · 재능 찾기 / 재능 등록 버튼
 */
export function HomeHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { data: keywords } = useAsync(getPopularKeywords, []);

  // form submit = Enter 키 + 검색 버튼 모두 처리
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(talentSearchHref({ q: query.trim() }));
  };

  return (
    <section aria-labelledby="hero-title" className="bg-navy text-white">
      <div className="page-container py-14 md:py-20 lg:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-body-sm font-semibold text-white/80">
            <span className="size-1.5 rounded-full bg-point" aria-hidden />
            1시간의 재능 공유 = 1 Time Coin
          </span>

          <h1 id="hero-title" className="text-display">
            당신의 시간은
            <br className="md:hidden" /> 소중하고 가치 있습니다.
          </h1>
          <p className="mt-4 text-body-lg text-white/70">내 재능을 나누고, 필요한 재능을 만나보세요.</p>

          {/* 검색 */}
          <form role="search" aria-label="재능 검색" onSubmit={onSubmit} className="mt-8 flex w-full flex-col gap-2 md:mt-10 md:flex-row">
            <SearchInput
              aria-label="재능 검색어"
              value={query}
              onValueChange={setQuery}
              placeholder="배우고 싶은 재능을 검색해 보세요 (예: 영상 편집)"
              containerClassName="flex-1 text-left text-fg"
              className="h-14 text-body-lg"
            />
            <Button type="submit" variant="accent" size="lg" className="md:w-32">
              검색
            </Button>
          </form>

          {/* 인기 검색 키워드 */}
          <div className="mt-5 flex min-h-8 flex-wrap items-center justify-center gap-2">
            <span className="text-body-sm font-semibold text-white/50">인기 검색</span>
            {keywords?.map((kw) => (
              <Link
                key={kw}
                href={talentSearchHref({ q: kw })}
                className="rounded-full border border-white/15 px-3 py-1.5 text-body-sm text-white/80 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                {kw}
              </Link>
            ))}
          </div>

          {/* 주요 이동 */}
          <div className="mt-10 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button href="/talents" variant="outline" size="lg" rightIcon={<ArrowRight size={18} />}>
              재능 찾기
            </Button>
            <Link
              href="/my/talents"
              className="inline-flex h-[54px] items-center justify-center gap-2 rounded-lg border border-white/20 px-6 text-body-lg font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/10"
            >
              <Plus size={18} />
              재능 등록하기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
