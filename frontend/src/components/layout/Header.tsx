"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, Coins, LayoutDashboard, LogOut, Menu, Settings, User } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Avatar, Button, Dropdown } from "@/components/common";
import { useAuthStore } from "@/store/authStore";
import { useWallet } from "@/store/walletStore";
import { useUnreadCount } from "@/store/notificationStore";
import { toast } from "@/store/toastStore";
import { MAIN_NAV, isActive } from "@/lib/nav";
import { cx } from "@/lib/format";
import { PathnameBoundary } from "./PathnameBoundary";
import { MobileMenu } from "./MobileMenu";

/**
 * 공통 헤더 (다크 네이비).
 * - PC(lg 이상): 로고 · 메인 메뉴 · 코인 · 알림 · 프로필 드롭다운
 * - 태블릿/모바일: 로고 · 코인 · 알림 · 햄버거 메뉴(전체 메뉴 패널)
 * - 로그인 전: 로그인 / 회원가입 버튼
 */
export function Header() {
  return <PathnameBoundary>{(pathname) => <HeaderInner pathname={pathname} />}</PathnameBoundary>;
}

const iconBtn =
  "relative flex size-10 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white";

function HeaderInner({ pathname }: { pathname: string | null }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const wallet = useWallet(user?.id);
  const unread = useUnreadCount();
  const [mobileOpen, setMobileOpen] = useState(false);

  // 페이지가 바뀌면 모바일 메뉴 닫기 (렌더 중 상태 조정 패턴)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  const handleLogout = () => {
    logout();
    toast.info("로그아웃되었습니다.");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 h-(--header-h) bg-navy text-white">
      <div className="page-container flex h-full items-center gap-10">
        <Logo size={30} inverse />

        <nav aria-label="주요 메뉴" className="hidden gap-1 lg:flex">
          {MAIN_NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "relative rounded-sm px-3.5 py-2 font-semibold transition-colors",
                  active ? "text-white" : "text-white/65 hover:bg-white/10 hover:text-white",
                )}
              >
                {item.label}
                {active && <span className="absolute inset-x-3.5 -bottom-[13px] h-0.5 rounded-full bg-point" aria-hidden />}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          {user ? (
            <>
              <Link
                href="/my/coin"
                aria-label={`보유 코인 ${wallet.balance} TC`}
                className="mr-1 inline-flex h-9 items-center gap-1.5 rounded-full bg-white/10 px-3 font-bold text-point transition-colors hover:bg-white/15"
              >
                <Coins size={16} aria-hidden />
                {wallet.balance}
                <span className="text-caption text-white">TC</span>
              </Link>

              <Link href="/notifications" aria-label={`알림, 읽지 않음 ${unread}개`} className={iconBtn}>
                <Bell size={20} />
                {unread > 0 && (
                  <span className="absolute top-1 right-0.5 min-w-[18px] rounded-full border-2 border-navy bg-error px-1 text-center text-[10px] leading-[14px] font-bold text-white">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </Link>

              <div className="hidden lg:block">
                <Dropdown
                  triggerLabel="내 계정 메뉴"
                  triggerClassName="flex rounded-full p-0.5 transition-opacity hover:opacity-85"
                  trigger={<Avatar name={user.nickname} src={user.avatarUrl} size={34} className="ring-2 ring-white/25" />}
                  header={
                    <div className="flex flex-col">
                      <strong>{user.nickname}</strong>
                      <span className="text-caption font-normal text-fg-muted">{user.email}</span>
                    </div>
                  }
                  items={[
                    { label: "마이페이지", href: "/my", icon: <User size={16} /> },
                    { label: "대시보드", href: "/my/dashboard", icon: <LayoutDashboard size={16} /> },
                    { label: "설정", href: "/my/settings", icon: <Settings size={16} /> },
                    { type: "divider" },
                    { label: "로그아웃", onSelect: handleLogout, icon: <LogOut size={16} /> },
                  ]}
                />
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-1.5 md:flex">
              <Link href="/login" className="rounded-sm px-3 py-2 text-body-sm font-semibold text-white/75 hover:text-white">
                로그인
              </Link>
              <Button href="/signup" variant="accent" size="sm">
                회원가입
              </Button>
            </div>
          )}

          <button
            type="button"
            aria-label="전체 메뉴 열기"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className={cx(iconBtn, "lg:hidden")}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} onLogout={handleLogout} />
    </header>
  );
}
