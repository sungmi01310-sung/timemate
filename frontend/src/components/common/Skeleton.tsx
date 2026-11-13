import { cx } from "@/lib/format";

/**
 * 로딩 자리표시자. API 응답 전 레이아웃이 흔들리지 않도록 실제 콘텐츠 크기에 맞춰 배치한다.
 *   <Skeleton className="h-5 w-40" />
 */
export function Skeleton({ className, circle, inverse }: { className?: string; circle?: boolean; /** 어두운 배경용 */ inverse?: boolean }) {
  return (
    <span
      aria-hidden
      className={cx("block animate-shimmer", inverse ? "bg-white/10" : "bg-gray-200", circle ? "rounded-full" : "rounded-sm", className)}
    />
  );
}

/** 여러 줄 텍스트 자리표시자 (마지막 줄은 짧게) */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <span aria-hidden className={cx("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cx("h-3.5", i === lines - 1 ? "w-3/5" : "w-full")} />
      ))}
    </span>
  );
}

/** 스크린리더에 "불러오는 중"을 알리는 래퍼 */
export function LoadingRegion({ label = "불러오는 중", children }: { label?: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
