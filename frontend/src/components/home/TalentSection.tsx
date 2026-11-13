"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { SearchX } from "lucide-react";
import { EmptyState, ErrorState, LoadingRegion, SectionHeader } from "@/components/common";
import { TalentCard, TalentCardSkeleton } from "@/components/domain";
import type { TalentWithProvider } from "@/lib/api/talents";
import { useAuthStore } from "@/store/authStore";
import { useLikeStore } from "@/store/likeStore";
import { toast } from "@/store/toastStore";

/** 재능 카드 그리드 공통: PC 4열 · 태블릿 2열 · 모바일 1열(가로형 카드) */
const GRID = "grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4";

export interface TalentSectionProps {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  moreHref: string;
  /** 제목 아래 필터 등 */
  toolbar?: ReactNode;
  data?: TalentWithProvider[];
  loading: boolean;
  error?: unknown;
  onRetry: () => void;
  skeletonCount?: number;
}

/**
 * SECTION 05·06 공통: 추천 재능 / 인기 재능.
 * 데이터 조회는 부모가 하고, 여기서는 Loading → Error → Empty → 목록 순으로 그린다.
 */
export function TalentSection({ id, title, description, moreHref, toolbar, data, loading, error, onRetry, skeletonCount = 4 }: TalentSectionProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const likedIds = useLikeStore((s) => s.ids);
  const toggleLike = useLikeStore((s) => s.toggle);
  const router = useRouter();

  const onToggleLike = (talentId: string) => {
    if (!isLoggedIn) {
      toast.info("로그인 후 관심 재능을 저장할 수 있어요.");
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    toast.show(toggleLike(talentId) ? "관심 재능에 추가했어요." : "관심 재능에서 뺐어요.");
  };

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <SectionHeader title={<span id={`${id}-title`}>{title}</span>} description={description} moreHref={moreHref} />
      {toolbar && <div className="mb-4">{toolbar}</div>}

      {loading ? (
        <LoadingRegion label="재능을 불러오는 중">
          <div className={GRID}>
            {Array.from({ length: skeletonCount }, (_, i) => (
              <TalentCardSkeleton key={i} layout="responsive" />
            ))}
          </div>
        </LoadingRegion>
      ) : error ? (
        <div className="rounded-lg border border-divider bg-surface">
          <ErrorState title="재능 목록을 불러오지 못했어요" onRetry={onRetry} />
        </div>
      ) : !data?.length ? (
        <div className="rounded-lg border border-divider bg-surface">
          <EmptyState icon={<SearchX size={24} />} title="아직 등록된 재능이 없어요" description="다른 카테고리를 선택해 보세요." />
        </div>
      ) : (
        <ul className={GRID}>
          {data.map((t) => (
            <li key={t.id}>
              <TalentCard
                talent={t}
                provider={t.provider}
                layout="responsive"
                liked={isLoggedIn && likedIds.includes(t.id)}
                onToggleLike={onToggleLike}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
