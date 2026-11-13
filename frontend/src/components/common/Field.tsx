"use client";

import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/**
 * Input · Textarea · Select 가 공유하는 스타일과 틀.
 * 상태 우선순위: disabled > error > success > 기본
 */
export function fieldControlClass({
  error,
  success,
  disabled,
  size = "md",
}: {
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  return cx(
    "relative flex items-center rounded-md border bg-surface transition-[border-color,box-shadow]",
    size === "sm" ? "min-h-10" : "min-h-12",
    disabled
      ? "border-divider bg-gray-100 text-fg-disabled"
      : error
        ? "border-error focus-within:shadow-[0_0_0_3px_rgb(217_61_66/0.18)]"
        : success
          ? "border-success focus-within:shadow-[0_0_0_3px_rgb(8_127_102/0.18)]"
          : "border-border hover:border-border-strong focus-within:border-sub focus-within:shadow-[0_0_0_3px_rgb(29_206_246/0.3)]",
  );
}

/** 실제 <input>/<textarea>/<select> 요소 공통 클래스 */
export const fieldInputClass =
  "w-full min-w-0 flex-1 self-stretch bg-transparent px-3.5 text-body-md outline-none placeholder:text-fg-disabled " +
  "focus-visible:shadow-none disabled:cursor-not-allowed";

export interface FieldShellProps {
  id: string;
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  success?: string;
  footExtra?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** 라벨 + 입력 + 도움말/오류/성공 메시지 틀 */
export function FieldShell({ id, label, required, hint, error, success, footExtra, className, children }: FieldShellProps) {
  const msg = error || success || hint;
  return (
    <div className={cx("flex min-w-0 flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-label text-fg-secondary">
          {label}
          {required && (
            <span className="ml-0.5 text-error" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      {children}
      {(msg || footExtra) && (
        <div className="flex gap-2">
          {msg && (
            <p
              id={`${id}-msg`}
              role={error ? "alert" : undefined}
              className={cx("text-caption", error ? "text-error" : success ? "text-success" : "text-fg-muted")}
            >
              {msg}
            </p>
          )}
          {footExtra}
        </div>
      )}
    </div>
  );
}
