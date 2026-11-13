"use client";

import Link from "next/link";
import { useRef, type ComponentProps, type ReactNode } from "react";
import { AlertCircle, ChevronRight, Star } from "lucide-react";
import { cx } from "@/lib/format";
import { Button } from "./Button";

/* ── Badge ─────────────────────────────────────────────── */
export type BadgeTone = "neutral" | "navy" | "accent" | "info" | "success" | "warning" | "error";

const BADGE_TONE: Record<BadgeTone, string> = {
  neutral: "bg-gray-100 text-fg-secondary",
  navy: "bg-navy text-white",
  accent: "bg-point-soft text-point-strong",
  info: "bg-info-soft text-info",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  error: "bg-error-soft text-error",
};

export function Badge({ tone = "neutral", dot, children, className }: { tone?: BadgeTone; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span className={cx("inline-flex h-6 items-center gap-1 rounded-sm px-2 text-caption font-semibold whitespace-nowrap", BADGE_TONE[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

/* ── Avatar ────────────────────────────────────────────── */
const AVATAR_BG = ["#2F455B", "#1D2129", "#08708C", "#087F66", "#4E5661"];

/** 프로필 이미지. 이미지가 없으면 닉네임 첫 글자 + 이름 기반 고정 배경색 */
export function Avatar({ name, src, size = 40, className }: { name: string; src?: string; size?: number; className?: string }) {
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return (
    <span
      role="img"
      aria-label={name}
      className={cx("inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold text-white select-none", className)}
      style={{ width: size, height: size, fontSize: size * 0.4, background: AVATAR_BG[hash % AVATAR_BG.length] }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        name.slice(0, 1).toUpperCase()
      )}
    </span>
  );
}

/* ── Tabs ──────────────────────────────────────────────── */
export interface TabItem<T extends string> {
  value: T;
  label: string;
  count?: number;
  disabled?: boolean;
}

/** 탭. ← → 키로 이동 가능 (WAI-ARIA tabs 패턴) */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  variant = "line",
  ariaLabel,
  className,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (v: T) => void;
  variant?: "line" | "pill";
  ariaLabel?: string;
  className?: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const enabled = items.filter((t) => !t.disabled);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const idx = enabled.findIndex((t) => t.value === value);
    const next = enabled[(idx + (e.key === "ArrowRight" ? 1 : -1) + enabled.length) % enabled.length];
    onChange(next.value);
    listRef.current?.querySelector<HTMLElement>(`[data-value="${next.value}"]`)?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cx(
        "flex overflow-x-auto [scrollbar-width:none]",
        variant === "line" ? "gap-5 border-b border-divider" : "w-fit max-w-full gap-1 rounded-md bg-gray-100 p-1",
        className,
      )}
    >
      {items.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            data-value={t.value}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            disabled={t.disabled}
            onClick={() => onChange(t.value)}
            className={cx(
              "inline-flex shrink-0 items-center gap-1.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:text-fg-disabled",
              variant === "line"
                ? cx("-mb-px h-11 border-b-2 px-0.5", active ? "border-navy text-fg" : "border-transparent text-fg-muted hover:text-fg")
                : cx("h-9 rounded-sm px-3.5 text-body-sm", active ? "bg-surface text-fg shadow-xs" : "text-fg-muted hover:text-fg"),
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span
                className={cx(
                  "min-w-[18px] rounded-full px-1.5 text-center text-[11px] leading-[18px]",
                  active ? "bg-navy text-white" : "bg-gray-200 text-fg-secondary",
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── Chip (필터 선택 토글) ─────────────────────────────── */
export function Chip({ selected, className, children, ...rest }: ComponentProps<"button"> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[14px] font-medium whitespace-nowrap transition-colors",
        "disabled:cursor-not-allowed disabled:border-divider disabled:bg-gray-100 disabled:text-fg-disabled",
        selected ? "border-navy bg-navy text-white" : "border-border bg-surface text-fg-secondary enabled:hover:border-navy enabled:hover:text-fg",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ── Rating ────────────────────────────────────────────── */
export function Rating({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  return (
    <span
      className="inline-flex items-center gap-[3px] text-body-sm font-semibold text-fg"
      aria-label={`평점 ${value.toFixed(1)}${count !== undefined ? `, 후기 ${count}개` : ""}`}
    >
      <Star size={size} className="fill-[#ffb800] text-[#ffb800]" aria-hidden />
      {value.toFixed(1)}
      {count !== undefined && <span className="font-normal text-fg-muted">({count})</span>}
    </span>
  );
}

/* ── EmptyState / ErrorState ───────────────────────────── */
export function EmptyState({ icon, title, description, action, className }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cx("flex flex-col items-center gap-2 px-6 py-12 text-center text-fg-muted", className)}>
      {icon && <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">{icon}</div>}
      <p className="text-h4 text-fg">{title}</p>
      {description && <p>{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

/** 데이터 로딩 실패 시 표시 + 다시 시도 */
export function ErrorState({ title = "정보를 불러오지 못했어요", description = "잠시 후 다시 시도해 주세요.", onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return (
    <div role="alert">
      <EmptyState
        icon={<AlertCircle size={24} className="text-error" />}
        title={title}
        description={description}
        action={onRetry && <Button variant="outline" onClick={onRetry}>다시 시도</Button>}
      />
    </div>
  );
}

/* ── Card ──────────────────────────────────────────────── */
export function Card({
  padded = true,
  tone = "default",
  className,
  children,
  ...rest
}: ComponentProps<"div"> & { padded?: boolean; tone?: "default" | "navy" | "muted" }) {
  return (
    <div
      className={cx(
        "rounded-lg",
        tone === "navy" ? "bg-navy text-white" : tone === "muted" ? "bg-gray-100" : "border border-divider bg-surface",
        padded && "p-5 md:p-6",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ── SectionHeader ─────────────────────────────────────── */
export function SectionHeader({
  title,
  description,
  moreHref,
  moreLabel = "전체보기",
  as: Tag = "h2",
}: {
  title: ReactNode;
  description?: ReactNode;
  moreHref?: string;
  moreLabel?: string;
  as?: "h2" | "h3";
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <Tag className={Tag === "h2" ? "text-h2" : "text-h3"}>{title}</Tag>
        {description && <p className="mt-1 text-body-sm text-fg-muted">{description}</p>}
      </div>
      {moreHref && (
        <Link href={moreHref} className="inline-flex shrink-0 items-center gap-0.5 rounded-sm text-body-sm font-semibold text-fg-muted hover:text-fg">
          {moreLabel}
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}
