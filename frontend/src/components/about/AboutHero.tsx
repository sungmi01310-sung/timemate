"use client";

import { ArrowDown, ArrowRight, ArrowRightLeft } from "lucide-react";
import { Avatar, Button } from "@/components/common";

/** '이용 방법 알아보기' → #how 섹션으로 부드럽게 이동 + 키보드 포커스도 함께 이동 */
function scrollToHow() {
  const el = document.getElementById("how");
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
}

/** 시간 교환을 보여주는 예시 카드 (설명용 UI, 실제 거래 데이터 아님) */
function ExchangeVisual() {
  const row = (name: string, talent: string, coin: string, plus: boolean) => (
    <div className="flex items-center gap-3 rounded-lg bg-white/[0.06] p-4">
      <Avatar name={name} size={40} className="ring-2 ring-white/15" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{name}</p>
        <p className="truncate text-body-sm text-white/60">{talent}</p>
      </div>
      <span className={plus ? "text-h4 text-point" : "text-h4 text-sub"}>{coin}</span>
    </div>
  );
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-sm rounded-2xl border border-white/10 bg-secondary/40 p-5">
      <p className="mb-4 text-caption font-semibold tracking-wide text-white/50">예시 · 시간 교환</p>
      {row("민지", "디자인을 1시간 알려줬어요", "+1 TC", true)}
      <div className="my-3 flex items-center justify-center gap-2 text-body-sm text-white/50">
        <ArrowRightLeft size={16} />1시간 = 1 Time Coin
      </div>
      {row("준호", "디자인을 1시간 배웠어요", "−1 TC", false)}
    </div>
  );
}

/** SECTION 01. Hero (다크 네이비) */
export function AboutHero() {
  return (
    <section aria-labelledby="about-hero-title" className="bg-navy text-white">
      <div className="page-container grid grid-cols-1 items-center gap-12 py-16 md:py-20 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 lg:py-28">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-body-sm font-semibold text-white/80">
            <span className="size-1.5 rounded-full bg-point" aria-hidden />
            시간 기반 재능 교환 플랫폼
          </p>
          <h1 id="about-hero-title" className="text-display">
            당신의 한 시간이{" "}
            <br />
            누군가에게 <span className="text-point">새로운 가능성</span>이 됩니다.
          </h1>
          <p className="mt-5 text-body-lg font-semibold text-white/90">돈이 아닌 시간으로 연결되는 새로운 재능 교환 플랫폼, TIMEMATE</p>
          <p className="mt-3 max-w-xl text-white/60">
            내가 잘하는 것을 나누고, 필요한 것을 배워보세요.
            <br className="hidden sm:block" /> 서로의 시간이 새로운 가치를 만듭니다.
          </p>
          <div className="mt-9 flex flex-col gap-2 sm:flex-row">
            <Button href="/talents" variant="accent" size="lg" rightIcon={<ArrowRight size={18} />}>
              재능 찾아보기
            </Button>
            <button
              type="button"
              onClick={scrollToHow}
              className="inline-flex h-[54px] items-center justify-center gap-2 rounded-lg border border-white/20 px-6 text-body-lg font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/10"
            >
              이용 방법 알아보기
              <ArrowDown size={18} />
            </button>
          </div>
        </div>
        <ExchangeVisual />
      </div>
    </section>
  );
}
