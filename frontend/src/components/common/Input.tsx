"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { Eye, EyeOff, Search, X } from "lucide-react";
import { cx } from "@/lib/format";
import { FieldShell, fieldControlClass, fieldInputClass } from "./Field";

export interface InputProps extends Omit<ComponentProps<"input">, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  /** 검증 성공 메시지 (예: "사용 가능한 닉네임이에요") */
  success?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  size?: "sm" | "md";
  containerClassName?: string;
}

/** 기본 입력창 — Default / Focus / Error / Success / Disabled 상태 지원 */
export function Input({
  label,
  hint,
  error,
  success,
  leftIcon,
  rightSlot,
  size = "md",
  id,
  required,
  disabled,
  className,
  containerClassName,
  ...rest
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <FieldShell id={inputId} label={label} required={required} hint={hint} error={error} success={success} className={containerClassName}>
      <div className={fieldControlClass({ error: !!error, success: !!success, disabled, size })}>
        {leftIcon && <span className="flex pl-3.5 text-fg-muted">{leftIcon}</span>}
        <input
          id={inputId}
          className={cx(fieldInputClass, leftIcon ? "pl-2.5" : undefined, className)}
          required={required}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          aria-describedby={error || success || hint ? `${inputId}-msg` : undefined}
          {...rest}
        />
        {rightSlot && <span className="flex items-center pr-2">{rightSlot}</span>}
      </div>
    </FieldShell>
  );
}

/** 비밀번호 입력 — 보기/숨기기 토글 */
export function PasswordInput(props: Omit<InputProps, "type" | "rightSlot">) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      autoComplete={props.autoComplete ?? "current-password"}
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
          aria-pressed={visible}
          disabled={props.disabled}
          className="flex size-9 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-gray-100 hover:text-fg disabled:opacity-50"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
    />
  );
}

export interface SearchInputProps extends Omit<InputProps, "type" | "leftIcon" | "rightSlot" | "onChange" | "value"> {
  value: string;
  onValueChange: (value: string) => void;
  /** Enter 키 또는 검색 실행 시 호출 */
  onSearch?: (value: string) => void;
}

/** 검색 입력 — 돋보기 아이콘, 지우기 버튼, Enter 검색 */
export function SearchInput({ value, onValueChange, onSearch, placeholder = "검색어를 입력하세요", ...rest }: SearchInputProps) {
  return (
    <Input
      {...rest}
      type="search"
      role="searchbox"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onValueChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.nativeEvent.isComposing) onSearch?.(value.trim());
      }}
      leftIcon={<Search size={18} aria-hidden />}
      className="[&::-webkit-search-cancel-button]:hidden"
      rightSlot={
        value ? (
          <button
            type="button"
            onClick={() => onValueChange("")}
            aria-label="검색어 지우기"
            className="flex size-8 items-center justify-center rounded-full text-fg-muted hover:bg-gray-100 hover:text-fg"
          >
            <X size={16} />
          </button>
        ) : undefined
      }
    />
  );
}

export interface TextareaProps extends ComponentProps<"textarea"> {
  label?: string;
  hint?: string;
  error?: string;
  showCount?: boolean;
}

export function Textarea({ label, hint, error, showCount, id, required, disabled, maxLength, value, className, ...rest }: TextareaProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const count = typeof value === "string" ? value.length : 0;
  return (
    <FieldShell
      id={inputId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      footExtra={
        showCount && maxLength ? (
          <span className="ml-auto text-caption text-fg-muted">
            {count}/{maxLength}
          </span>
        ) : undefined
      }
    >
      <div className={fieldControlClass({ error: !!error, disabled })}>
        <textarea
          id={inputId}
          className={cx(fieldInputClass, "min-h-28 resize-y py-3", className)}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          aria-invalid={!!error || undefined}
          aria-describedby={error || hint ? `${inputId}-msg` : undefined}
          {...rest}
        />
      </div>
    </FieldShell>
  );
}
