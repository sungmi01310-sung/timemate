"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft, ChevronRight, Clock, FileQuestion, MapPin, MessageSquareText, Monitor, Star } from "lucide-react";
import { Badge, Button, EmptyState, ErrorState, LoadingRegion, Rating, Skeleton, SkeletonText } from "@/components/common";
import { ProfileCard, ReviewCard, TalentCard, TalentImage } from "@/components/domain";
import { getProviderTalents, getTalentDetail, getTalentReviews, type TalentDetailResponse } from "@/lib/api/talents";
import { useAsync } from "@/lib/useAsync";
import { TRADE_MODE_LABEL, categoryLabel } from "@/types";
import { ApplyCard, MobileApplyBar } from "./ApplyCard";
import { ScheduleTable } from "./ScheduleTable";
import { LAST_SEARCH_KEY } from "./useTalentQuery";

/** '목록으로' — 마지막 검색 조건이 있으면 그 URL 로, 없으면 /talents */
function BackToList() {
  const router = useRouter();
  const goBack = () => {
    let qs = "";
    try {
      qs = sessionStorage.getItem(LAST_SEARCH_KEY) ?? "";
    } catch {
      /* 저장소 사용 불가 → 기본 목록 */
    }
    router.push(qs ? `/talents?${qs}` : "/talents");
  };
  return (
    <button type="button" onClick={goBack} className="mb-5 inline-flex items-center gap-1.5 rounded-sm text-body-sm font-semibold text-fg-muted transition-colors hover:text-fg">
      <ArrowLeft size={16} />
      목록으로
    </button>
  );
}

/** PAGE 02. 재능 상세 */
export function TalentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const detail = useAsync(() => getTalentDetail(id), [id]);

  return (
    <div className="page-container pb-24 lg:pb-0">
      <BackToList />
      {detail.loading ? (
        <DetailSkeleton />
      ) : detail.error ? (
        <div className="rounded-lg border border-divider bg-surface">
          <ErrorState title="재능 정보를 불러오지 못했어요" onRetry={detail.reload} />
        </div>
      ) : !detail.data ? (
        <div className="rounded-lg border border-divider bg-surface">
          <EmptyState
            icon={<FileQuestion size={24} />}
            title="존재하지 않거나 비공개된 재능이에요"
            description="주소를 다시 확인하거나 다른 재능을 찾아보세요."
            action={<Button href="/talents">재능 찾기로 이동</Button>}
          />
        </div>
      ) : (
        <TalentDetailView talent={detail.data} />
      )}
    </div>
  );
}

function Section({ id, title, children }: { id?: string; title: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="scroll-mt-[calc(var(--header-h)+16px)] border-t border-divider pt-8">
      <h2 id={id ? `${id}-title` : undefined} className="mb-4 text-h2">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** 제공 내용·추천 대상 등 항목 목록 (비어 있으면 숨김) */
function InfoList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="mb-2 text-h4">{title}</h3>
      <ul className="flex flex-col gap-1.5">
        {items.map((it) => (
          <li key={it} className="flex gap-2 text-fg-secondary">
            <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-point-strong" aria-hidden />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TalentDetailView({ talent }: { talent: TalentDetailResponse }) {
  const reviews = useAsync(() => getTalentReviews(talent.id), [talent.id]);
  const others = useAsync(() => getProviderTalents(talent.provider.id, talent.id), [talent.provider.id, talent.id]);
  const ModeIcon = talent.mode === "offline" ? MapPin : Monitor;

  return (
    <>
      {/* ── 상단: 카테고리 · 제목 · 제공자 · 평점 · 진행 방식 ── */}
      <header className="mb-6">
        <div className="flex flex-wrap gap-1.5">
          <Link href={`/talents?category=${talent.category}`} className="rounded-sm">
            <Badge>{categoryLabel(talent.category)}</Badge>
          </Link>
          <Badge tone={talent.mode === "offline" ? "neutral" : "info"}>
            <ModeIcon size={12} />
            {TRADE_MODE_LABEL[talent.mode]}
          </Badge>
        </div>
        <h1 className="mt-3 text-h1">{talent.title}</h1>
        <p className="mt-1.5 text-body-lg text-fg-secondary">{talent.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm text-fg-muted">
          <a href="#provider" className="font-semibold text-fg hover:underline hover:underline-offset-2">
            {talent.provider.nickname}
          </a>
          <a href="#reviews" className="hover:underline hover:underline-offset-2">
            <Rating value={talent.rating} count={talent.reviewCount} />
          </a>
          <span className="inline-flex items-center gap-1">
            <Clock size={14} aria-hidden /> {talent.hours}시간 · {talent.hours} TC
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
        {/* ── 왼쪽: 본문 ── */}
        <div className="flex min-w-0 flex-col gap-8">
          <TalentImage
            src={talent.images[0]}
            category={talent.category}
            alt={`${talent.title} 대표 이미지`}
            className="aspect-[16/9] w-full rounded-xl"
            iconClassName="size-16 md:size-20"
          />

          <Section id="intro" title="재능 소개">
            <p className="whitespace-pre-line text-body-lg text-fg-secondary">{talent.description}</p>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <InfoList title="제공 내용" items={talent.offerings} />
              <InfoList title="추천 대상" items={talent.targets} />
              <InfoList title="준비물" items={talent.materials} />
              <InfoList title="진행 방식" items={talent.process} />
            </div>
            {talent.notes.length > 0 && (
              <div className="mt-6 rounded-md bg-warning-soft p-4">
                <h3 className="mb-1.5 text-h4 text-warning">유의사항</h3>
                <ul className="flex flex-col gap-1 text-body-sm text-fg-secondary">
                  {talent.notes.map((n) => (
                    <li key={n}>· {n}</li>
                  ))}
                </ul>
              </div>
            )}
          </Section>

          <Section id="schedule" title="예약 가능 일정">
            <dl className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-body-sm">
              <div className="flex gap-1.5">
                <dt className="text-fg-muted">진행 방식</dt>
                <dd className="font-semibold">
                  {TRADE_MODE_LABEL[talent.mode]}
                  {talent.mode !== "online" && talent.region ? ` · ${talent.region}` : ""}
                </dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="text-fg-muted">예상 소요 시간</dt>
                <dd className="font-semibold">{talent.hours}시간</dd>
              </div>
            </dl>
            <ScheduleTable schedule={talent.schedule} hours={talent.hours} />
            <p className="mt-3 text-caption text-fg-muted">정확한 날짜와 시간은 신청 단계에서 선택하고, 제공자와 채팅으로 조율할 수 있어요.</p>
          </Section>

          <Section id="provider" title="제공자 소개">
            <ProfileCard
              user={talent.provider}
              stats={[
                { label: "평점", value: talent.provider.rating.toFixed(1) },
                { label: "받은 후기", value: `${talent.provider.reviewCount}개` },
                { label: "완료 거래", value: `${talent.provider.completedTradeCount}건` },
              ]}
              actions={
                <Button href={`/talents?provider=${talent.provider.id}`} variant="outline" rightIcon={<ChevronRight size={16} />}>
                  {talent.provider.nickname}님의 재능 전체 보기
                </Button>
              }
            />
          </Section>

          <Section id="reviews" title="후기">
            <ReviewSummary rating={talent.rating} count={talent.reviewCount} />
            {reviews.loading ? (
              <LoadingRegion label="후기를 불러오는 중">
                <div className="flex flex-col gap-3">
                  {[0, 1].map((i) => (
                    <div key={i} className="rounded-lg border border-divider bg-surface p-5">
                      <div className="mb-3 flex items-center gap-2.5">
                        <Skeleton circle className="size-9" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <SkeletonText lines={2} />
                    </div>
                  ))}
                </div>
              </LoadingRegion>
            ) : reviews.error ? (
              <ErrorState title="후기를 불러오지 못했어요" onRetry={reviews.reload} />
            ) : !reviews.data?.length ? (
              <p className="flex items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-8 text-body-sm text-fg-muted">
                <MessageSquareText size={16} aria-hidden /> 아직 등록된 후기가 없어요.
              </p>
            ) : (
              <>
                <ul className="flex flex-col gap-3">
                  {reviews.data.map((r) => (
                    <li key={r.id}>
                      <ReviewCard review={r} author={r.author} />
                    </li>
                  ))}
                </ul>
                {talent.reviewCount > reviews.data.length && (
                  <p className="mt-3 text-center text-caption text-fg-muted">최근 후기 {reviews.data.length}개를 보여드리고 있어요.</p>
                )}
              </>
            )}
          </Section>

          {others.data && others.data.length > 0 && (
            <Section title={`${talent.provider.nickname}님의 다른 재능`}>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {others.data.map((t) => (
                  <li key={t.id}>
                    <TalentCard talent={t} provider={t.provider} layout="horizontal" />
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        {/* ── 오른쪽: 신청 카드 (PC sticky) ── */}
        <div className="hidden lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:block">
          <ApplyCard talent={talent} />
        </div>
      </div>

      <MobileApplyBar talent={talent} />
    </>
  );
}

function ReviewSummary({ rating, count }: { rating: number; count: number }) {
  const full = Math.round(rating);
  return (
    <div className="mb-4 flex items-center gap-4 rounded-lg bg-gray-100 p-5">
      <p className="text-[40px] leading-none font-extrabold">{rating.toFixed(1)}</p>
      <div>
        <div className="flex gap-0.5" aria-label={`5점 만점에 ${rating.toFixed(1)}점`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={18} className={i <= full ? "fill-[#ffb800] text-[#ffb800]" : "fill-gray-300 text-gray-300"} aria-hidden />
          ))}
        </div>
        <p className="mt-1 text-body-sm text-fg-muted">후기 {count}개</p>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <LoadingRegion label="재능 정보를 불러오는 중">
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-8 w-3/4 max-w-xl" />
        <Skeleton className="h-5 w-1/2 max-w-sm" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
        <div className="flex flex-col gap-6">
          <Skeleton className="aspect-[16/9] w-full rounded-xl" />
          <SkeletonText lines={4} />
        </div>
        <Skeleton className="hidden h-80 rounded-xl lg:block" />
      </div>
    </LoadingRegion>
  );
}
