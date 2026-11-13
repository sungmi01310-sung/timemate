"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarClock, ChevronRight, Handshake, Heart, MessageCircle, type LucideIcon } from "lucide-react";
import { Avatar, Badge, ErrorState, LoadingRegion, RelativeTime, Skeleton } from "@/components/common";
import { TradeStatusBadge } from "@/components/domain";
import { getMyActivity } from "@/lib/api/activity";
import { getTalentsByIds } from "@/lib/api/talents";
import { useAsync } from "@/lib/useAsync";
import { formatDateTime } from "@/lib/format";
import { categoryLabel } from "@/types";
import { useLikeStore } from "@/store/likeStore";

/**
 * SECTION 08. 최근 활동 (로그인 사용자 전용)
 * 진행 중인 거래 · 예정된 예약 · 최근 채팅 · 관심 재능
 * 조회만 한다 — 상태 변경은 각 상세 페이지(STEP 6~8)에서 백엔드를 통해 처리.
 */
export function RecentActivity({ userId }: { userId: string }) {
  const activity = useAsync(() => getMyActivity(userId), [userId]);
  const likedIds = useLikeStore((s) => s.ids);
  const liked = useAsync(() => getTalentsByIds(likedIds), [likedIds]);

  return (
    <section aria-labelledby="activity-title">
      <h2 id="activity-title" className="mb-4 text-h2">
        최근 활동
      </h2>

      {activity.error ? (
        <div className="rounded-lg border border-divider bg-surface">
          <ErrorState title="활동 내역을 불러오지 못했어요" onRetry={activity.reload} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <Panel icon={Handshake} title="진행 중인 거래" href="/my/trades" loading={activity.loading} empty={!activity.data?.ongoingTrades.length} emptyText="진행 중인 거래가 없어요.">
            {activity.data?.ongoingTrades.slice(0, 3).map((t) => (
              <Row key={t.id} href="/my/trades">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{t.talentTitle}</p>
                  <p className="text-body-sm text-fg-muted">
                    {t.partner.nickname} · {t.role === "requester" ? "내가 이용" : "내가 제공"} · {t.hours} TC
                  </p>
                </div>
                <TradeStatusBadge status={t.status} />
              </Row>
            ))}
          </Panel>

          <Panel icon={CalendarClock} title="예정된 예약" href="/my/calendar" loading={activity.loading} empty={!activity.data?.upcomingBookings.length} emptyText="예정된 예약이 없어요.">
            {activity.data?.upcomingBookings.slice(0, 3).map((t) => (
              <Row key={t.id} href="/my/calendar">
                <div className="flex w-14 shrink-0 flex-col items-center rounded-md bg-navy py-1.5 text-white">
                  <span className="text-caption text-white/60">{new Date(t.scheduledAt!).getMonth() + 1}월</span>
                  <span className="text-h3 leading-none text-point">{new Date(t.scheduledAt!).getDate()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{t.talentTitle}</p>
                  <p className="text-body-sm text-fg-muted">
                    {formatDateTime(t.scheduledAt!)} · {t.partner.nickname}
                  </p>
                </div>
              </Row>
            ))}
          </Panel>

          <Panel icon={MessageCircle} title="최근 채팅" href="/chat" loading={activity.loading} empty={!activity.data?.recentChats.length} emptyText="아직 대화가 없어요.">
            {activity.data?.recentChats.slice(0, 3).map((c) => (
              <Row key={c.id} href={`/chat/${c.id}`}>
                <Avatar name={c.partner.nickname} src={c.partner.avatarUrl} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold">{c.partner.nickname}</p>
                    <RelativeTime iso={c.lastAt} className="shrink-0 text-caption font-normal text-fg-muted" />
                  </div>
                  <p className="truncate text-body-sm text-fg-muted">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="min-w-5 rounded-full bg-error px-1.5 text-center text-caption leading-5 text-white" aria-label={`읽지 않은 메시지 ${c.unread}개`}>
                    {c.unread}
                  </span>
                )}
              </Row>
            ))}
          </Panel>

          <Panel icon={Heart} title="관심 재능" href="/talents" loading={liked.loading} empty={!liked.data?.length} emptyText="하트를 눌러 관심 재능을 모아보세요.">
            {liked.data?.slice(0, 3).map((t) => (
              <Row key={t.id} href={`/talents/${t.id}`}>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{t.title}</p>
                  <p className="text-body-sm text-fg-muted">{t.provider.nickname}</p>
                </div>
                <Badge>{categoryLabel(t.category)}</Badge>
                <Badge tone="accent">{t.hours} TC</Badge>
              </Row>
            ))}
          </Panel>
        </div>
      )}
    </section>
  );
}

function Panel({
  icon: Icon,
  title,
  href,
  loading,
  empty,
  emptyText,
  children,
}: {
  icon: LucideIcon;
  title: string;
  href: string;
  loading: boolean;
  empty: boolean;
  emptyText: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-divider bg-surface p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2 text-h4">
          <Icon size={18} className="text-secondary" aria-hidden />
          {title}
        </h3>
        <Link href={href} className="inline-flex items-center rounded-sm text-body-sm font-semibold text-fg-muted hover:text-fg">
          전체보기
          <ChevronRight size={16} />
        </Link>
      </div>
      {loading ? (
        <LoadingRegion>
          <div className="flex flex-col gap-3 py-2">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton circle className="size-10" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-4 w-3/5" />
                  <Skeleton className="h-3.5 w-2/5" />
                </div>
              </div>
            ))}
          </div>
        </LoadingRegion>
      ) : empty ? (
        <p className="flex min-h-24 items-center justify-center rounded-md bg-gray-50 text-body-sm text-fg-muted">{emptyText}</p>
      ) : (
        <ul className="-mx-2 flex flex-col">{children}</ul>
      )}
    </div>
  );
}

function Row({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-gray-50">
        {children}
      </Link>
    </li>
  );
}
