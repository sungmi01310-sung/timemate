"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type Render = (pathname: string | null) => ReactNode;

function Resolver({ render }: { render: Render }) {
  return render(usePathname());
}

/**
 * cacheComponents 환경에서 동적 라우트([id] 등)는 prerender 시 pathname 을 알 수 없어
 * usePathname 이 suspend 된다. 활성 메뉴 표시처럼 pathname 에 의존하는 UI만
 * 이 경계로 감싸서, prerender 단계에서는 pathname=null 버전을 먼저 보여준다.
 */
export function PathnameBoundary({ children }: { children: Render }) {
  return (
    <Suspense fallback={children(null)}>
      <Resolver render={children} />
    </Suspense>
  );
}
