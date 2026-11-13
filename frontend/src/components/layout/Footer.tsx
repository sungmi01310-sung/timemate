import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { FOOTER_LINKS } from "@/lib/nav";
import { cx } from "@/lib/format";

/** 공통 푸터: 서비스 정보 · 정책 링크 · 고객센터 · 저작권 */
export function Footer() {
  return (
    <footer className="border-t border-divider bg-surface">
      <div className="page-container grid grid-cols-1 gap-6 py-10 md:grid-cols-[1fr_auto] md:gap-x-10">
        <div>
          <Logo href={null} size={26} />
          <p className="mt-3 text-body-sm text-fg-muted">
            당신의 시간은 소중하고 가치 있다.
            <br />
            TimeMate는 현금 대신 시간으로 재능을 교환하는 플랫폼입니다. 1시간 = 1 Time Coin.
          </p>
        </div>
        <nav aria-label="정책 및 고객지원" className="flex flex-wrap content-start gap-x-5 gap-y-2 text-body-sm">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={cx("rounded-sm hover:text-fg", l.strong ? "font-bold text-fg" : "text-fg-secondary")}>
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="border-t border-divider pt-5 text-caption font-normal text-fg-disabled md:col-span-2">© 2026 TimeMate. All rights reserved.</p>
      </div>
    </footer>
  );
}
