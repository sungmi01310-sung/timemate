"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { cx } from "@/lib/format";

/**
 * 스크롤해서 화면에 들어올 때 살짝 떠오르며 나타나는 래퍼.
 *
 * 안전 장치
 * - 서버 렌더링 결과는 항상 '보이는 상태' (JS 실패·검색엔진에도 내용이 보임)
 * - 처음부터 화면 안에 있는 요소는 숨기지 않음 (깜빡임 없음)
 * - '동작 줄이기' 설정 사용자에게는 효과를 적용하지 않음
 * React 상태 대신 classList 를 직접 바꿔 불필요한 리렌더를 막는다.
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
}: {
  as?: ElementType;
  /** 같은 줄 카드를 순서대로 등장시킬 때 (ms) */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return; // 이미 보이는 영역

    el.classList.add("reveal-pending");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.style.transitionDelay = `${delay}ms`;
        el.classList.remove("reveal-pending");
        io.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={cx("transition-[opacity,transform] duration-700 ease-out", className)}>
      {children}
    </Tag>
  );
}
