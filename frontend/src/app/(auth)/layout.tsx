import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { FOOTER_LINKS } from "@/lib/nav";

/** 비회원 영역 (온보딩 · 로그인 · 회원가입 · 비밀번호 찾기 · 약관) — 단순한 상단 바 + 본문 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="page-container flex h-(--header-h) items-center">
        <Logo href="/onboarding" size={30} />
      </header>
      <main className="flex flex-1 flex-col pt-8 pb-16">{children}</main>
      <footer className="page-container flex flex-wrap gap-x-4 gap-y-1 pb-8 text-caption font-normal text-fg-muted">
        {FOOTER_LINKS.slice(1).map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-fg">
            {l.label}
          </Link>
        ))}
        <span className="ml-auto">© 2026 TimeMate</span>
      </footer>
    </div>
  );
}
