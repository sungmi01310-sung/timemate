import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/format";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "accent" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** 아이콘만 있는 정사각형 버튼 (aria-label 필수) */
  iconOnly?: boolean;
}

type ButtonAsButton = BaseProps & ComponentProps<"button"> & { href?: undefined };
type ButtonAsLink = BaseProps & Omit<ComponentProps<typeof Link>, "href"> & { href: string; disabled?: boolean };
export type ButtonProps = ButtonAsButton | ButtonAsLink;

/* 상태별 스타일: hover / active(눌림) / disabled 를 variant 마다 정의 */
const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-navy text-white hover:bg-navy-hover active:bg-navy-active",
  accent: "bg-point text-navy hover:bg-point-hover active:bg-point-active",
  // gray-200: 페이지 배경(#F5F6F8) 위에서도 버튼 윤곽이 보이도록
  secondary: "bg-gray-200 text-fg hover:bg-gray-300 active:bg-gray-400",
  outline: "border border-border bg-surface text-fg hover:border-navy active:bg-gray-100",
  ghost: "bg-transparent text-fg-secondary hover:bg-gray-100 hover:text-fg active:bg-gray-200",
  danger: "bg-error-soft text-error hover:bg-[#fadcdd] active:bg-[#f6c9cb]",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-body-sm rounded-sm gap-1.5",
  md: "h-11 px-[18px] text-button rounded-md gap-2",
  lg: "h-[54px] px-6 text-body-lg rounded-lg gap-2",
};
const ICON_ONLY: Record<ButtonSize, string> = { sm: "w-9 px-0", md: "w-11 px-0", lg: "w-[54px] px-0" };

const DISABLED =
  "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-gray-200 disabled:text-fg-disabled " +
  "aria-disabled:cursor-not-allowed aria-disabled:border-transparent aria-disabled:bg-gray-200 aria-disabled:text-fg-disabled";

/**
 * 공통 버튼.
 * - primary  : 네이비. 화면의 기본 액션
 * - accent   : 민트. 신청·결제 등 핵심 CTA (화면당 1개 권장)
 * - secondary / outline / ghost / danger
 * href 가 있으면 <Link>(페이지 이동), 없으면 <button>(동작)으로 렌더링한다.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", fullWidth, loading, leftIcon, rightIcon, iconOnly, className, children, ...rest } = props;

  const classes = cx(
    "inline-flex items-center justify-center font-semibold whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,transform] active:scale-[0.98]",
    VARIANT[variant],
    SIZE[size],
    iconOnly && ICON_ONLY[size],
    // fullWidth 버튼 여러 개가 한 줄에 있을 때 나눠 갖도록 shrink 허용 (shrink-0 이면 화면이 넘침)
    fullWidth ? "w-full min-w-0 shrink" : "shrink-0",
    loading ? "cursor-progress" : DISABLED,
    className,
  );

  const inner = (
    <>
      {loading ? <Spinner size={16} /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </>
  );

  if (typeof rest.href === "string") {
    const { href, disabled, ...linkRest } = rest as ButtonAsLink;
    if (disabled) {
      return (
        <span className={classes} aria-disabled="true">
          {inner}
        </span>
      );
    }
    return (
      <Link href={href} className={classes} {...linkRest}>
        {inner}
      </Link>
    );
  }

  const { type = "button", disabled, ...btnRest } = rest as ButtonAsButton;
  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...btnRest}>
      {inner}
    </button>
  );
}
