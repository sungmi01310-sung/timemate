"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useHasHydrated } from "@/store/useHasHydrated";
import { cx } from "@/lib/format";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

/**
 * 서비스 공통 틀: Header + 본문 + Footer + (모바일) 하단 탭.
 * - requireAuth(기본 true): 비로그인 상태면 /login 으로 이동  [MOCK] 클라이언트 가드 → STEP 5에서 JWT 기반으로 교체
 * - flush: 본문 상단 여백 제거 (메인 히어로처럼 헤더에 바로 붙는 전체 폭 섹션용)
 */
export function AppShell({ children, requireAuth = true, flush = false }: { children: ReactNode; requireAuth?: boolean; flush?: boolean }) {
  const hydrated = useHasHydrated();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const router = useRouter();
  const blocked = requireAuth && hydrated && !isLoggedIn;

  useEffect(() => {
    if (!blocked) return;
    const next = window.location.pathname + window.location.search;
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [blocked, router]);

  return (
    // 하단 탭이 있는 lg 미만에서는 그 높이만큼 아래 여백 확보
    <div className="flex min-h-dvh flex-col pb-[calc(var(--mobile-nav-h)+env(safe-area-inset-bottom))] lg:pb-0">
      <Header />
      {/* 페이지 상·하단 간격 통일 */}
      <main className={cx("flex-1", flush ? "pb-0" : "pt-6 pb-16 md:pt-8 lg:pt-10")}>{blocked ? null : children}</main>
      <Footer />
      <Navigation />
    </div>
  );
}
