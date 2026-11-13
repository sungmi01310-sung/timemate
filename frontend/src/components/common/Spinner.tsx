import { cx } from "@/lib/format";

/** 로딩 스피너. 색상은 부모의 글자색(currentColor)을 따른다. */
export function Spinner({ size = 20, className, label }: { size?: number; className?: string; label?: string }) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cx("inline-block animate-spin rounded-full border-2 border-current border-r-transparent", className)}
      style={{ width: size, height: size }}
    />
  );
}
