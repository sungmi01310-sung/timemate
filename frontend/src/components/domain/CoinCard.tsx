import Link from "next/link";
import { ChevronRight, Lock, Wallet } from "lucide-react";
import { Skeleton } from "@/components/common";
import { cx } from "@/lib/format";

export interface CoinCardProps {
  /** 총 보유 코인 (잠금 포함) */
  balance: number;
  /** 사용 가능 = balance - locked */
  available: number;
  /** 거래 확정으로 잠긴 코인 */
  locked: number;
  /** 코인 내역 링크. null 이면 숨김 */
  historyHref?: string | null;
  variant?: "full" | "compact";
  loading?: boolean;
}

/**
 * Time Coin 요약 카드 (다크 네이비 강조 카드).
 * 숫자 계산은 하지 않고 받은 값만 보여준다 → 계산·정산은 백엔드 책임.
 */
export function CoinCard({ balance, available, locked, historyHref = "/my/coin", variant = "full", loading }: CoinCardProps) {
  return (
    <section aria-label="Time Coin 현황" aria-busy={loading || undefined} className={cx("rounded-xl bg-navy text-white", variant === "compact" ? "p-5" : "p-6")}>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-white/70">
          <Wallet size={16} aria-hidden />
          보유 Time Coin
        </span>
        {historyHref && (
          <Link href={historyHref} className="inline-flex items-center rounded-sm text-body-sm font-semibold text-white/70 transition-colors hover:text-point">
            코인 내역
            <ChevronRight size={16} />
          </Link>
        )}
      </div>

      {loading ? (
        <>
          <Skeleton inverse className="mt-3 h-11 w-32" />
          <Skeleton inverse className="mt-2 h-4 w-48" />
        </>
      ) : (
        <>
          <p className={cx("mt-3 leading-[1.1] font-extrabold tracking-[-0.02em] text-point", variant === "compact" ? "text-[32px]" : "text-[40px]")}>
            {balance.toLocaleString("ko-KR")}
            <span className="ml-1.5 text-[18px] font-bold text-white">TC</span>
          </p>
          <p className="mt-1.5 text-body-sm text-white/60">= {balance}시간의 재능을 이용할 수 있어요</p>
        </>
      )}

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-white/10">
        <div className="bg-secondary px-3.5 py-3">
          <dt className="text-caption text-white/60">사용 가능</dt>
          <dd className="mt-1 text-[17px] font-bold text-sub">{loading ? "–" : `${available} TC`}</dd>
        </div>
        <div className="bg-secondary px-3.5 py-3">
          <dt className="inline-flex items-center gap-1 text-caption text-white/60">
            <Lock size={12} aria-hidden />
            잠금
          </dt>
          <dd className="mt-1 text-[17px] font-bold">{loading ? "–" : `${locked} TC`}</dd>
        </div>
      </dl>

      {variant === "full" && (
        <p className="mt-4 text-caption font-normal text-white/60">
          재능을 <b className="font-semibold text-white">1시간 제공</b>하면 1 TC 적립, <b className="font-semibold text-white">1시간 이용</b>하면 1 TC가 사용돼요.
        </p>
      )}
    </section>
  );
}
