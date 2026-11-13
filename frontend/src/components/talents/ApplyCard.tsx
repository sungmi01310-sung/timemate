"use client";

import Link from "next/link";
import { AlertCircle, Clock, Coins, MapPin, Monitor } from "lucide-react";
import { Avatar, Button, Rating } from "@/components/common";
import { cx } from "@/lib/format";
import { TRADE_MODE_LABEL } from "@/types";
import type { TalentDetailResponse } from "@/lib/api/talents";
import { useAuthStore } from "@/store/authStore";
import { useWallet } from "@/store/walletStore";

/**
 * 신청 버튼 상태 계산 (카드·모바일 하단 바 공통).
 * 실제 신청(거래 생성)은 STEP 6 의 /talents/:id/apply 에서 백엔드 API 로 처리한다.
 * 여기서는 이동만 하며 거래·코인을 절대 만들거나 바꾸지 않는다.
 */
function useApplyState(talent: TalentDetailResponse) {
  const user = useAuthStore((s) => s.user);
  const wallet = useWallet(user?.id);
  const isOwner = user?.id === talent.provider.id;
  const shortage = user && !isOwner ? Math.max(0, talent.hours - wallet.available) : 0;
  return { user, wallet, isOwner, shortage, applyHref: `/talents/${talent.id}/apply` };
}

function ApplyButton({ talent, size = "lg" }: { talent: TalentDetailResponse; size?: "md" | "lg" }) {
  const { isOwner, applyHref } = useApplyState(talent);
  if (isOwner) {
    return (
      <Button href="/my/talents" variant="outline" size={size} fullWidth>
        내 재능 관리
      </Button>
    );
  }
  return (
    <Button href={applyHref} variant="accent" size={size} fullWidth>
      재능 신청하기
    </Button>
  );
}

/** PC 오른쪽 신청 카드 (sticky) */
export function ApplyCard({ talent }: { talent: TalentDetailResponse }) {
  const { user, wallet, isOwner, shortage } = useApplyState(talent);
  const ModeIcon = talent.mode === "offline" ? MapPin : Monitor;

  return (
    <aside aria-label="재능 신청" className="flex flex-col gap-5 rounded-xl border border-divider bg-surface p-6">
      <div>
        <p className="text-body-sm text-fg-muted">1회 진행</p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-h1">{talent.hours}시간</span>
          <span className="text-fg-muted">/</span>
          <span className="text-h2 text-point-strong">{talent.hours} Time Coin</span>
        </p>
      </div>

      <dl className="flex flex-col gap-2.5 border-y border-divider py-4 text-body-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="inline-flex items-center gap-1.5 text-fg-muted">
            <Clock size={15} aria-hidden /> 소요 시간
          </dt>
          <dd className="font-semibold">{talent.hours}시간</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="inline-flex items-center gap-1.5 text-fg-muted">
            <Coins size={15} aria-hidden /> 필요 코인
          </dt>
          <dd className="font-semibold">{talent.hours} TC</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="inline-flex items-center gap-1.5 text-fg-muted">
            <ModeIcon size={15} aria-hidden /> 진행 방식
          </dt>
          <dd className="text-right font-semibold">
            {TRADE_MODE_LABEL[talent.mode]}
            {talent.mode !== "online" && talent.region && <span className="block text-caption font-normal text-fg-muted">{talent.region}</span>}
          </dd>
        </div>
      </dl>

      <div className="flex items-center gap-3">
        <Avatar name={talent.provider.nickname} src={talent.provider.avatarUrl} size={40} />
        <div className="min-w-0">
          <p className="truncate font-semibold">{talent.provider.nickname}</p>
          <p className="flex items-center gap-2 text-caption text-fg-muted">
            <Rating value={talent.provider.rating} size={12} /> 완료 거래 {talent.provider.completedTradeCount}건
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <ApplyButton talent={talent} />
        {isOwner ? (
          <p className="text-center text-caption text-fg-muted">내가 등록한 재능이에요.</p>
        ) : user ? (
          <p className={cx("flex items-center justify-center gap-1 text-center text-caption", shortage ? "text-warning" : "text-fg-muted")}>
            {shortage ? (
              <>
                <AlertCircle size={13} aria-hidden /> 사용 가능 {wallet.available} TC · {shortage} TC가 부족해요
              </>
            ) : (
              <>사용 가능 {wallet.available} TC · 신청 후 제공자가 수락하면 코인이 잠겨요</>
            )}
          </p>
        ) : (
          <p className="text-center text-caption text-fg-muted">
            신청하려면{" "}
            <Link href={`/login?next=/talents/${talent.id}`} className="font-semibold text-fg underline underline-offset-2">
              로그인
            </Link>
            이 필요해요.
          </p>
        )}
      </div>
    </aside>
  );
}

/** 모바일·태블릿 하단 고정 신청 바 (하단 탭 바로 위) */
export function MobileApplyBar({ talent }: { talent: TalentDetailResponse }) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(var(--mobile-nav-h)+env(safe-area-inset-bottom))] z-40 border-t border-divider bg-surface/95 backdrop-blur-md lg:hidden">
      <div className="page-container flex items-center gap-4 py-3">
        <div className="shrink-0">
          <p className="text-caption text-fg-muted">{talent.hours}시간 진행</p>
          <p className="text-h4 text-point-strong">{talent.hours} Time Coin</p>
        </div>
        <div className="min-w-0 flex-1">
          <ApplyButton talent={talent} size="md" />
        </div>
      </div>
    </div>
  );
}
