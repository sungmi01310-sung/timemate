"use client";

import { useId, type ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "@/lib/format";
import { FieldShell, fieldControlClass, fieldInputClass } from "./Field";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<ComponentProps<"select">, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: "sm" | "md";
}

/** 네이티브 <select> 기반 — 모바일에서 OS 기본 선택창이 떠서 사용성과 접근성이 좋다 */
export function Select({ label, hint, error, options, placeholder, size = "md", id, required, disabled, className, ...rest }: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <FieldShell id={selectId} label={label} required={required} hint={hint} error={error}>
      <div className={fieldControlClass({ error: !!error, disabled, size })}>
        <select
          id={selectId}
          className={cx(fieldInputClass, "appearance-none pr-10", className)}
          required={required}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="pointer-events-none absolute right-3.5 text-fg-muted" aria-hidden />
      </div>
    </FieldShell>
  );
}
