"use client";

import Link from "next/link";
import { Avatar } from "@/components/common";
import { useAuthStore } from "@/store/authStore";
import { MY_NAV, isActive } from "@/lib/nav";
import { cx } from "@/lib/format";
import { PathnameBoundary } from "./PathnameBoundary";

/** 마이페이지 메뉴. PC(lg↑)는 왼쪽 고정 사이드바, 그 이하는 상단 가로 스크롤 탭 */
export function Sidebar() {
  return <PathnameBoundary>{(pathname) => <SidebarInner pathname={pathname} />}</PathnameBoundary>;
}

function SidebarInner({ pathname }: { pathname: string | null }) {
  const user = useAuthStore((s) => s.user);
  return (
    <aside aria-label="마이페이지 메뉴" className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:rounded-lg lg:border lg:border-divider lg:bg-surface lg:p-3">
      {user && (
        <div className="mb-2 hidden items-center gap-2.5 border-b border-divider px-2 pt-2 pb-4 lg:flex">
          <Avatar name={user.nickname} src={user.avatarUrl} size={40} />
          <div className="flex min-w-0 flex-col">
            <strong>{user.nickname}</strong>
            <span className="truncate text-caption font-normal text-fg-muted">{user.email}</span>
          </div>
        </div>
      )}
      <nav className="-mx-(--gutter) flex gap-1.5 overflow-x-auto px-(--gutter) [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0.5 lg:px-0">
        {MY_NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href, href === "/my");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cx(
                "flex shrink-0 items-center gap-2.5 font-medium whitespace-nowrap transition-colors",
                // 모바일: 칩 형태 / PC: 세로 메뉴
                "rounded-full border px-3.5 py-2 text-[14px] lg:rounded-sm lg:border-0 lg:px-3 lg:py-2.5 lg:text-body-md",
                active
                  ? "border-navy bg-navy text-white"
                  : "border-divider bg-surface text-fg-secondary hover:bg-gray-100 hover:text-fg",
              )}
            >
              <Icon size={18} className="hidden lg:block" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
