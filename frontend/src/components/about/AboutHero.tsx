"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowRight, Camera, Clapperboard, Code2, Lock } from "lucide-react";
import { Button } from "@/components/common";
import { LogoMark } from "@/components/brand/Logo";
import { cx } from "@/lib/format";

/** '이용 방법 알아보기' → #how 섹션으로 부드럽게 이동 + 키보드 포커스도 함께 이동 */
function scrollToHow() {
  const el = document.getElementById("how");
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
}

/** 떠 있는 거래 칩 (설명용) */
function Chip({ icon, label, coin, plus, className }: { icon: ReactNode; label: string; coin: string; plus: boolean; className: string }) {
  return (
    <div className={cx("absolute flex items-center gap-2.5 rounded-lg border border-divider bg-surface py-2.5 pr-4 pl-2.5 text-body-sm font-bold shadow-md", className)}>
      <span className={cx("flex size-8 items-center justify-center rounded-sm", plus ? "bg-point-soft text-point-strong" : "bg-sub-soft text-sub-strong")}>{icon}</span>
      {label}
      <span className={plus ? "text-success" : "text-sub-strong"}>{coin}</span>
    </div>
  );
}

/** 코인 지갑 카드 + 떠 있는 거래 칩 (설명용 예시 — 실제 사용자 데이터 아님) */
function WalletVisual() {
  return (
    <div aria-hidden className="relative mx-auto h-[360px] w-full max-w-[420px] md:h-[420px]">
      {/* 지갑 카드 */}
      <div className="absolute top-1/2 left-1/2 w-[270px] -translate-x-1/2 -translate-y-1/2 -rotate-3 overflow-hidden rounded-2xl bg-navy p-6 text-white shadow-lg md:w-[290px]">
        <span className="absolute -top-8 -right-8 size-32 rounded-full bg-white/[0.06]" />
        <p className="flex items-center gap-2 text-body-sm font-semibold text-white/75">
          <span className="inline-flex h-5 w-7 items-center justify-center rounded-[5px] bg-white">
            <LogoMark size={11} title={null} />
          </span>
          내 Time Coin
        </p>
        <p className="mt-3 text-[44px] leading-none font-extrabold tracking-[-0.03em] text-point">
          8<span className="ml-1.5 text-h4 text-white">TC</span>
        </p>
        <p className="mt-2 text-body-sm text-white/60">= 8시간의 재능을 이용할 수 있어요</p>
        <div className="mt-5 flex justify-between border-t border-white/15 pt-4 text-caption font-semibold text-white/70">
          <span>이번 주 +2 TC</span>
          <span className="inline-flex items-center gap-1">
            <Lock size={12} /> 잠금 2 TC
          </span>
        </div>
      </div>
      <Chip icon={<Clapperboard size={16} />} label="영상 편집" coin="+1 TC" plus className="top-4 left-0 animate-float md:top-6" />
      <Chip icon={<Code2 size={16} />} label="React 도움" coin="−1 TC" plus={false} className="right-0 bottom-14 animate-float-alt" />
      <Chip icon={<Camera size={16} />} label="사진 촬영" coin="+2 TC" plus className="bottom-0 left-6 animate-float [animation-delay:600ms]" />
    </div>
  );
}

/** SECTION 01. Hero (화이트 + 네이비 지갑 카드) */
export function AboutHero() {
  return (
    <section aria-labelledby="about-hero-title" className="overflow-hidden border-b border-divider bg-surface">
      <div className="page-container grid grid-cols-1 items-center gap-10 pt-14 pb-16 md:pt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 lg:pt-24 lg:pb-24">
        <div>
          <p className="mb-5 text-label tracking-wide text-secondary">시간 기반 재능 교환 플랫폼</p>
          <h1 id="about-hero-title" className="text-[clamp(2.25rem,5.2vw,3.75rem)] leading-[1.15] font-extrabold tracking-[-0.04em]">
            당신의 한 시간이{" "}
            <br />
            누군가에게{" "}
            <br />
            {/* '새로운 가능성이'는 한 줄로 유지, 민트 밑줄은 '새로운 가능성'에만 */}
            <span className="whitespace-nowrap">
              <span className="relative">
                <span className="absolute inset-x-0 bottom-1 h-3 bg-point/60 md:bottom-2 md:h-4" aria-hidden />
                <span className="relative">새로운 가능성</span>
              </span>
              이
            </span>{" "}
            됩니다.
          </h1>
          <p className="mt-6 text-body-lg font-semibold">돈이 아닌 시간으로 연결되는 새로운 재능 교환 플랫폼, TIMEMATE</p>
          <p className="mt-2 max-w-lg text-body-lg text-fg-muted">
            내가 잘하는 것을 나누고, 필요한 것을 배워보세요.
            <br className="hidden sm:block" /> 서로의 시간이 새로운 가치를 만듭니다.
          </p>
          <div className="mt-9 flex flex-col gap-2 sm:flex-row">
            <Button href="/talents" variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>
              재능 찾아보기
            </Button>
            <Button variant="secondary" size="lg" rightIcon={<ArrowDown size={18} />} onClick={scrollToHow}>
              이용 방법 알아보기
            </Button>
          </div>
          <p className="mt-5 text-body-sm font-semibold text-fg-muted">
            <span className="text-point-strong">1시간 = 1 Time Coin</span> · 현금 결제 없이 시간으로 교환해요
          </p>
        </div>
        <WalletVisual />
      </div>
    </section>
  );
}
