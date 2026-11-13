import Link from "next/link";
import { cx } from "@/lib/format";

/**
 * TimeMate 심볼: 위쪽의 T(민트)가 아래 M(화이트)의 가운데 골짜기와 맞닿는 형태.
 * - T의 가로획 = 시간의 흐름(타임라인)
 * - T의 세로획이 M의 중심과 연결 = 두 사람의 시간이 맞닿는 '교환' 지점
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" role="img" aria-label="TimeMate" className={className}>
      <rect width="40" height="40" rx="11" fill="#1D2129" />
      <path d="M10.5 30V17.5L20 26.5L29.5 17.5V30" stroke="#FFFFFF" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12.5V26.5" stroke="#34F5C6" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M10.5 10.5H29.5" stroke="#34F5C6" strokeWidth="3.6" strokeLinecap="round" />
      <circle cx="20" cy="26.5" r="2.6" fill="#1DCEF6" />
    </svg>
  );
}

/** 심볼 + 워드마크. inverse 는 어두운 배경(헤더)용 */
export function Logo({ href = "/", inverse = false, size = 32 }: { href?: string | null; inverse?: boolean; size?: number }) {
  const content = (
    <span className={cx("inline-flex items-center gap-2", inverse ? "text-white" : "text-navy")}>
      {/* 어두운 배경에서는 심볼 외곽이 묻히지 않도록 얇은 테두리 */}
      <LogoMark size={size} className={inverse ? "rounded-[11px] ring-1 ring-white/15" : undefined} />
      <span className="text-[19px] font-medium tracking-[-0.02em]">
        Time<b className="font-extrabold">Mate</b>
      </span>
    </span>
  );
  return href ? (
    <Link href={href} aria-label="TimeMate 홈" className="rounded-sm">
      {content}
    </Link>
  ) : (
    content
  );
}
