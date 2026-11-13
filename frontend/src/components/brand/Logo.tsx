"use client";

import Link from "next/link";
import { useId } from "react";
import { cx } from "@/lib/format";

/** 심볼 가로:세로 비율 (viewBox 975 × 564) */
export const LOGO_MARK_RATIO = 975 / 564;

/**
 * TimeMate 심볼: 두 개의 화살표가 서로 맞물려 순환하는 형태.
 * - 왼쪽(블루) → 오른쪽으로, 오른쪽(틸) → 왼쪽으로 = 서로의 시간을 주고받는 '교환'
 * - 끊기지 않고 이어지는 고리 = 사람 사이를 계속 '순환'하는 시간
 *
 * size 는 심볼의 높이(px). 너비는 비율에 맞춰 자동 계산된다.
 * 그라데이션 id 는 useId 로 인스턴스마다 고유하게 만들어, 한 화면에 여러 개 있어도 충돌하지 않는다.
 */
export function LogoMark({ size = 32, className, title = "TimeMate" }: { size?: number; className?: string; title?: string | null }) {
  const uid = useId().replace(/:/g, "");
  const left = `tm-l-${uid}`;
  const right = `tm-r-${uid}`;
  return (
    <svg
      width={Math.round(size * LOGO_MARK_RATIO)}
      height={size}
      viewBox="395 158 975 564"
      fill="none"
      role={title ? "img" : undefined}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      className={cx("shrink-0", className)}
    >
      <defs>
        <linearGradient id={left} x1="560" y1="660" x2="960" y2="230" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0A7CF7" />
          <stop offset="1" stopColor="#043E9F" />
        </linearGradient>
        <linearGradient id={right} x1="1290" y1="300" x2="830" y2="640" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#05C2B4" />
          <stop offset="0.45" stopColor="#04B4D8" />
          <stop offset="1" stopColor="#0A6DE2" />
        </linearGradient>
      </defs>
      {/* 왼쪽 화살표 (→) */}
      <path
        d="M712 612 C600 655 468 605 466 466 C464 330 590 248 730 255 C775 258 805 264 845 276"
        stroke={`url(#${left})`}
        strokeWidth="112"
        strokeLinecap="round"
      />
      <path d="M884 170 L1008 348 L766 390 Z" fill={`url(#${left})`} stroke={`url(#${left})`} strokeWidth="18" strokeLinejoin="round" />
      {/* 오른쪽 화살표 (←) */}
      <path
        d="M1068 294 C1185 268 1300 345 1300 458 C1300 572 1195 634 1085 632 C1030 631 985 621 938 605"
        stroke={`url(#${right})`}
        strokeWidth="110"
        strokeLinecap="round"
      />
      <path d="M1010 488 L878 707 L758 528 Z" fill={`url(#${right})`} stroke={`url(#${right})`} strokeWidth="18" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 심볼 + 워드마크.
 * inverse: 어두운 배경(헤더)용 — 심볼은 흰 배지 위에 올려 원래 색을 그대로 보여주고 글자는 흰색.
 */
export function Logo({ href = "/", inverse = false, size = 32 }: { href?: string | null; inverse?: boolean; size?: number }) {
  const markHeight = Math.round(size * 0.62);
  const content = (
    <span className={cx("inline-flex items-center gap-2", inverse ? "text-white" : "text-navy")}>
      <span
        className={cx("inline-flex items-center justify-center rounded-md", inverse && "bg-white")}
        style={{ height: size, width: Math.round(size * 1.35) }}
      >
        <LogoMark size={markHeight} title={null} />
      </span>
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
    <span role="img" aria-label="TimeMate">
      {content}
    </span>
  );
}
