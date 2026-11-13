"use client";

import { useState } from "react";
import { Tabs } from "@/components/common";
import { getPopularTalents, getRecommendedTalents } from "@/lib/api/talents";
import { useAsync } from "@/lib/useAsync";
import { useAuthStore } from "@/store/authStore";
import { CATEGORIES, type CategoryId } from "@/types";
import { HomeHero } from "./HomeHero";
import { CoinSection } from "./CoinSection";
import { CategorySection } from "./CategorySection";
import { TalentSection } from "./TalentSection";
import { HowItWorks } from "./HowItWorks";
import { RecentActivity } from "./RecentActivity";
import { BottomCta } from "./BottomCta";

type PopularFilter = "all" | CategoryId;

/**
 * 메인 페이지.
 * 섹션 순서: 히어로 → Time Coin + 카테고리 → 추천 재능 → 인기 재능 → 이용 방법 → 최근 활동(회원) → 하단 CTA
 * 데이터는 lib/api/* 를 통해 조회한다 (현재 [MOCK]).
 */
export function HomePage() {
  const user = useAuthStore((s) => s.user);
  const [popularFilter, setPopularFilter] = useState<PopularFilter>("all");

  // 회원: 관심 분야 기반 추천 / 비회원: 평점순 추천
  const interests = user?.interests ?? [];
  const recommended = useAsync(() => getRecommendedTalents({ interests, excludeUserId: user?.id }), [interests, user?.id]);
  const popular = useAsync(
    () => getPopularTalents({ category: popularFilter === "all" ? undefined : popularFilter }),
    [popularFilter],
  );

  return (
    <>
      <HomeHero />

      <div className="page-container flex flex-col gap-14 py-12 md:gap-20 md:py-16">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
          <CoinSection />
          <CategorySection />
        </div>

        <TalentSection
          id="recommended"
          title={user ? "추천 재능" : "평점 높은 재능"}
          description={user ? "관심 분야를 바탕으로 골라봤어요." : "후기로 검증된 재능을 만나보세요."}
          moreHref="/talents?sort=recommended"
          {...recommended}
          onRetry={recommended.reload}
        />

        <TalentSection
          id="popular"
          title="인기 재능"
          description="지금 가장 많이 찾는 재능이에요."
          moreHref={popularFilter === "all" ? "/talents?sort=popular" : `/talents?sort=popular&category=${popularFilter}`}
          toolbar={
            <Tabs<PopularFilter>
              variant="pill"
              ariaLabel="인기 재능 카테고리"
              value={popularFilter}
              onChange={setPopularFilter}
              items={[{ value: "all", label: "전체" }, ...CATEGORIES.map((c) => ({ value: c.id, label: c.label }))]}
            />
          }
          {...popular}
          onRetry={popular.reload}
        />
      </div>

      <HowItWorks />

      <div className="page-container flex flex-col gap-14 py-12 md:gap-20 md:py-16">
        {user && <RecentActivity userId={user.id} />}
        <BottomCta />
      </div>
    </>
  );
}
