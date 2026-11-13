"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "@/lib/format";

/** 현재 페이지 주변만 보여주고 나머지는 … 으로 축약한 페이지 번호 목록 */
export function getPageItems(page: number, total: number, siblings = 1): (number | "…")[] {
  const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  if (total <= 5 + siblings * 2) return range(1, total);
  const left = Math.max(page - siblings, 2);
  const right = Math.min(page + siblings, total - 1);
  return [1, ...(left > 2 ? ["…" as const] : []), ...range(left, right), ...(right < total - 1 ? ["…" as const] : []), total];
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

/** 페이지네이션. 서버 API 의 page / totalPages 응답과 그대로 연결한다. */
export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const btn =
    "flex h-9 min-w-9 items-center justify-center rounded-sm px-2 text-body-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:text-fg-disabled";
  return (
    <nav aria-label="페이지 이동" className={cx("flex items-center justify-center gap-1", className)}>
      <button type="button" className={cx(btn, "text-fg-secondary enabled:hover:bg-gray-100")} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="이전 페이지">
        <ChevronLeft size={18} />
      </button>
      {getPageItems(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-fg-muted" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cx(btn, p === page ? "bg-navy text-white" : "text-fg-secondary hover:bg-gray-100 hover:text-fg")}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className={cx(btn, "text-fg-secondary enabled:hover:bg-gray-100")} disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="다음 페이지">
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
