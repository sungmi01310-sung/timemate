"use client";

import Link from "next/link";
import { MOBILE_NAV, isActive } from "@/lib/nav";
import { cx } from "@/lib/format";
import { PathnameBoundary } from "./PathnameBoundary";

/** 태블릿·모바일 하단 탭 네비게이션 (lg 미만에서만 보임) */
export function Navigation() {
  return <PathnameBoundary>{(pathname) => <NavigationInner pathname={pathname} />}</PathnameBoundary>;
}

function NavigationInner({ pathname }: { pathname: string | null }) {
  return (
    <nav
      aria-label="하단 메뉴"
      className="fixed inset-x-0 bottom-0 z-60 grid h-[calc(var(--mobile-nav-h)+env(safe-area-inset-bottom))] grid-cols-5 border-t border-divider bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cx("flex flex-col items-center justify-center gap-[3px] text-[11px] font-semibold", active ? "text-navy" : "text-gray-500")}
          >
            <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
