"use client";

import Link from "next/link";
import { Clock, Heart, MapPin, Monitor } from "lucide-react";
import { Avatar, Badge, Rating, Skeleton } from "@/components/common";
import { cx } from "@/lib/format";
import { TRADE_MODE_LABEL, categoryLabel, type Talent, type User } from "@/types";
import { TalentImage } from "./TalentImage";

/**
 * 카드에 필요한 데이터만 골라낸 타입.
 * 전체 Talent/User 객체가 아니어도 되므로 목록 API 응답을 그대로 넘기기 쉽다.
 */
export type TalentCardData = Pick<
  Talent,
  "id" | "title" | "category" | "imageUrl" | "hours" | "mode" | "availableTimes" | "rating" | "reviewCount"
>;
export type TalentCardProvider = Pick<User, "nickname" | "avatarUrl">;

/**
 * vertical   : 이미지 위 · 내용 아래 (그리드용)
 * horizontal : 이미지 왼쪽 · 내용 오른쪽 (리스트용)
 * responsive : 모바일(< sm)은 horizontal, 그 이상은 vertical
 */
export type TalentCardLayout = "vertical" | "horizontal" | "responsive";

export interface TalentCardProps {
  talent: TalentCardData;
  provider: TalentCardProvider;
  liked?: boolean;
  /** 넘기지 않으면 관심(하트) 버튼이 표시되지 않는다 */
  onToggleLike?: (talentId: string) => void;
  layout?: TalentCardLayout;
}

/* 레이아웃별 클래스 — responsive 는 sm: 접두사로 전환 */
const L = {
  card: { vertical: "flex-col", horizontal: "flex-row", responsive: "flex-row sm:flex-col" },
  thumb: {
    vertical: "aspect-[16/10]",
    horizontal: "w-28 shrink-0 md:w-32",
    responsive: "w-28 shrink-0 sm:w-auto sm:aspect-[16/10]",
  },
  icon: { vertical: "size-11", horizontal: "size-8", responsive: "size-8 sm:size-11" },
  body: { vertical: "p-4", horizontal: "p-3.5", responsive: "p-3.5 sm:p-4" },
  title: { vertical: "min-h-[3em]", horizontal: "", responsive: "sm:min-h-[3em]" },
  coin: { vertical: "bottom-3 left-3", horizontal: "bottom-2 left-2", responsive: "bottom-2 left-2 sm:bottom-3 sm:left-3" },
} as const;

/** 재능 정보 카드. 카드 전체가 재능 상세 링크이며, 하트 버튼만 별도로 동작한다. */
export function TalentCard({ talent, provider, liked, onToggleLike, layout = "vertical" }: TalentCardProps) {

  return (
    <article
      className={cx(
        "group relative flex h-full overflow-hidden rounded-lg border border-divider bg-surface transition-[border-color,box-shadow]",
        "hover:border-border-strong hover:shadow-sm has-[a:focus-visible]:focus-ring",
        L.card[layout],
      )}
    >
      {/* 카드 전체 클릭 영역 = 상세 보기 (스크린리더는 제목으로 읽음) */}
      <Link href={`/talents/${talent.id}`} aria-label={`${talent.title} 상세 보기`} className="absolute inset-0 z-1 rounded-[inherit] focus-visible:shadow-none" />

      <div className={cx("relative", L.thumb[layout])}>
        <TalentImage src={talent.imageUrl} category={talent.category} className="size-full" iconClassName={L.icon[layout]} />
        <span className={cx("absolute rounded-full bg-point px-2.5 py-1 text-caption font-bold text-navy", L.coin[layout])}>{talent.hours} TC</span>
      </div>

      <div className={cx("flex min-w-0 flex-1 flex-col gap-2", L.body[layout])}>
        <div className="flex flex-wrap gap-1.5">
          <Badge>{categoryLabel(talent.category)}</Badge>
          <Badge tone={talent.mode === "offline" ? "neutral" : "info"}>
            {talent.mode === "offline" ? <MapPin size={12} /> : <Monitor size={12} />}
            {TRADE_MODE_LABEL[talent.mode]}
          </Badge>
        </div>
        <h3 className={cx("line-clamp-2 text-h4 transition-colors group-hover:text-secondary", L.title[layout])}>{talent.title}</h3>
        <div className="flex items-center gap-1.5 text-body-sm text-fg-secondary">
          <Avatar name={provider.nickname} src={provider.avatarUrl} size={22} />
          <span className="truncate">{provider.nickname}</span>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-divider pt-2.5">
          <Rating value={talent.rating} count={talent.reviewCount} />
          <span className="inline-flex items-center gap-1 text-body-sm text-fg-muted">
            <Clock size={14} aria-hidden />
            {talent.hours}시간{talent.availableTimes[0] && ` · ${talent.availableTimes[0]}`}
          </span>
        </div>
      </div>

      {onToggleLike && (
        <button
          type="button"
          aria-pressed={liked}
          aria-label={liked ? "관심 재능 해제" : "관심 재능 등록"}
          onClick={() => onToggleLike(talent.id)}
          className="absolute top-2 right-2 z-2 flex size-9 items-center justify-center rounded-full bg-navy/40 text-white backdrop-blur-sm transition-colors hover:bg-navy/60 sm:top-2.5 sm:right-2.5"
        >
          <Heart size={18} className={liked ? "fill-point text-point" : undefined} />
        </button>
      )}
    </article>
  );
}

const SKELETON_THUMB: Record<TalentCardLayout, string> = {
  vertical: "aspect-[16/10] w-full",
  horizontal: "w-28 shrink-0 md:w-32",
  responsive: "w-28 shrink-0 sm:aspect-[16/10] sm:w-full",
};

/** 목록 로딩 중 TalentCard 자리표시자 (layout 은 실제 카드와 동일하게) */
export function TalentCardSkeleton({ layout = "vertical" }: { layout?: TalentCardLayout }) {
  return (
    <div aria-hidden className={cx("flex overflow-hidden rounded-lg border border-divider bg-surface", L.card[layout])}>
      <Skeleton className={cx("rounded-none", SKELETON_THUMB[layout])} />
      <div className={cx("flex flex-1 flex-col gap-2.5", L.body[layout])}>
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
        <div className="flex items-center gap-1.5">
          <Skeleton circle className="size-[22px]" />
          <Skeleton className="h-3.5 w-20" />
        </div>
        <Skeleton className="mt-1 h-4 w-1/2" />
      </div>
    </div>
  );
}
