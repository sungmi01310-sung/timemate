"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Bell, LogOut, X } from "lucide-react";
import { Avatar, Button } from "@/components/common";
import { useAuthStore } from "@/store/authStore";
import { useWallet } from "@/store/walletStore";
import { useUnreadCount } from "@/store/notificationStore";
import { MAIN_NAV, MY_NAV, isActive } from "@/lib/nav";
import { cx } from "@/lib/format";

/** 태블릿·모바일 전체 메뉴 패널 (오른쪽에서 열림) */
export function MobileMenu({
  open,
  onClose,
  pathname,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string | null;
  onLogout: () => void;
}) {
  const user = useAuthStore((s) => s.user);
  const wallet = useWallet(user?.id);
  const unread = useUnreadCount();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const link = (href: string, exact = false) =>
    cx(
      "flex items-center gap-3 rounded-md px-3 py-3 font-semibold transition-colors",
      isActive(pathname, href, exact) ? "bg-navy text-white" : "text-fg-secondary hover:bg-gray-100 hover:text-fg",
    );

  return createPortal(
    <div className="fixed inset-0 z-90 animate-fade-in bg-navy/50 lg:hidden" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="전체 메뉴"
        tabIndex={-1}
        className="ml-auto flex h-full w-[min(86vw,360px)] flex-col overflow-y-auto bg-surface text-fg shadow-lg focus-visible:shadow-lg"
      >
        <div className="flex h-(--header-h) shrink-0 items-center justify-between border-b border-divider px-4">
          <strong className="text-h4">전체 메뉴</strong>
          <Button variant="ghost" size="sm" iconOnly aria-label="메뉴 닫기" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-6 p-4">
          {user ? (
            <div className="flex items-center gap-3 rounded-lg bg-navy p-4 text-white">
              <Avatar name={user.nickname} src={user.avatarUrl} size={44} className="ring-2 ring-white/25" />
              <div className="min-w-0 flex-1">
                <strong className="block truncate">{user.nickname}</strong>
                <span className="text-body-sm text-white/60">
                  보유 <b className="text-point">{wallet.balance} TC</b> · 사용 가능 {wallet.available} TC
                </span>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button href="/login" variant="outline" fullWidth>
                로그인
              </Button>
              <Button href="/signup" variant="accent" fullWidth>
                회원가입
              </Button>
            </div>
          )}

          <nav aria-label="메인 메뉴" className="flex flex-col gap-1">
            {MAIN_NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={link(href)} onClick={onClose}>
                <Icon size={20} />
                {label}
              </Link>
            ))}
            <Link href="/notifications" className={link("/notifications")} onClick={onClose}>
              <Bell size={20} />
              알림
              {unread > 0 && <span className="ml-auto rounded-full bg-error px-2 text-caption leading-5 text-white">{unread}</span>}
            </Link>
          </nav>

          {user && (
            <>
              <nav aria-label="마이페이지 메뉴" className="flex flex-col gap-1 border-t border-divider pt-4">
                <p className="px-3 pb-1 text-label text-fg-muted">마이페이지</p>
                {MY_NAV.slice(1).map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} className={link(href)} onClick={onClose}>
                    <Icon size={18} />
                    {label}
                  </Link>
                ))}
              </nav>
              <button
                type="button"
                className="mt-auto flex items-center gap-3 rounded-md px-3 py-3 font-semibold text-fg-muted transition-colors hover:bg-gray-100 hover:text-fg"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
              >
                <LogOut size={18} />
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
